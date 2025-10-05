/**
 * SKOLARIS Trello Integration Module
 * Handles synchronization of Phase 1 tasks with Trello boards
 */

class TrelloIntegration {
    constructor() {
        this.apiKey = 'f3cba5684e71b81cf564e204aa79df6e';
        this.secret = '0d6d16da777fdf84f1fb7f6b88f0a9c0d8eaa6122a5adfbe6832a9737a688ce3';
        this.baseUrl = 'https://api.trello.com/1';
        // Use admin token for reading data (board, cards, etc.)
        this.adminToken = 'ATTAb0d5216ceefb6bfbaa9a4254337a81f3a898e6190c50cdf4ff764137cda4b06d19612FC5';
        // User token for comments (will be set per user)
        this.userToken = localStorage.getItem('trello_user_token') || null;
        this.boardId = null;
        this.lists = {};
    } 
    /**
     * Initialize Trello integration
     */
    async initialize() {
        try {
            // Verify token is valid
            const isValid = await this.verifyToken();
            if (!isValid) {
                throw new Error('Invalid Trello token');
            }
            
            return true;
        } catch (error) {
            console.error('Trello initialization failed:', error);
            return false;
        }
    }

    /**
     * Authenticate individual user with Trello for commenting
     */
    async authenticateUser() {
        return new Promise((resolve, reject) => {
            // Use Trello's client.js for authentication
            if (typeof Trello !== 'undefined') {
                // Use official Trello client
                Trello.setKey(this.apiKey);
                Trello.authorize({
                    type: 'popup',
                    name: 'SKOLARIS Comments',
                    scope: {
                        read: true,
                        write: true
                    },
                    expiration: 'never',
                    success: () => {
                        this.userToken = Trello.token();
                        localStorage.setItem('trello_user_token', this.userToken);
                        resolve(true);
                    },
                    error: (error) => {
                        reject(new Error('Authentication failed: ' + error));
                    }
                });
            } else {
                // Fallback: Simple popup without return URL
                const authUrl = `https://trello.com/1/authorize?expiration=never&scope=read,write&name=SKOLARIS%20Comments&key=${this.apiKey}&response_type=token`;
                
                // Open authentication window
                const authWindow = window.open(authUrl, 'trello_user_auth', 'width=500,height=600,scrollbars=yes,resizable=yes');
                
                // Check if window is closed and show token modal
                const checkClosed = setInterval(() => {
                    if (authWindow.closed) {
                        clearInterval(checkClosed);
                        
                        // Show token input section instead of prompt
                        setTimeout(() => {
                            if (typeof showTokenInput === 'function') {
                                showTokenInput();
                                resolve(true); // Resolve immediately, token will be handled by input section
                            } else {
                                // Fallback to prompt if modal function is not available
                                const token = prompt('Please paste your Trello token here:');
                                if (token && token.trim()) {
                                    const cleanToken = token.trim();
                                    this.userToken = cleanToken;
                                    localStorage.setItem('trello_user_token', cleanToken);
                                    resolve(true);
                                } else {
                                    reject(new Error('No token provided'));
                                }
                            }
                        }, 500);
                    }
                }, 1000);
            }
        });
    }

    /**
     * Check if user is authenticated for commenting
     */
    isUserAuthenticated() {
        return !!this.userToken;
    }

    /**
     * Get current user info
     */
    async getCurrentUser() {
        if (!this.userToken) return null;
        
        try {
            const response = await fetch(`${this.baseUrl}/members/me?key=${this.apiKey}&token=${this.userToken}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error getting current user:', error);
        }
        return null;
    }

    /**
     * Logout user (clear their token)
     */
    logoutUser() {
        this.userToken = null;
        localStorage.removeItem('trello_user_token');
    }

    /**
     * Authenticate with Trello (admin functions)
     */
    async authenticate() {
        return new Promise((resolve, reject) => {
            const authUrl = `https://trello.com/1/authorize?expiration=never&scope=read,write&name=SKOLARIS%20Task%20Management&key=${this.apiKey}&response_type=token`;
            
            // Open authentication window
            const authWindow = window.open(authUrl, 'trello_auth', 'width=500,height=600');
            
            // Listen for token
            const checkClosed = setInterval(() => {
                if (authWindow.closed) {
                    clearInterval(checkClosed);
                    const token = localStorage.getItem('trello_token');
                    if (token) {
                        this.adminToken = token;
                        resolve(true);
                    } else {
                        reject(new Error('Authentication cancelled'));
                    }
                }
            }, 1000);
        });
    }

    /**
     * Verify if token is valid
     */
    async verifyToken() {
        try {
            const response = await fetch(`${this.baseUrl}/tokens/${this.adminToken}?key=${this.apiKey}`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Create or get SKOLARIS board
     */
    async createOrGetBoard() {
        try {
            // First, try to find existing board
            const boards = await this.getBoards();
            const existingBoard = boards.find(board => 
                board.name === 'SKOLARIS - Phase 1 Development' || 
                board.name.includes('SKOLARIS')
            );

            if (existingBoard) {
                this.boardId = existingBoard.id;
                return existingBoard;
            }

            // Create new board
            const boardData = {
                name: 'SKOLARIS - Phase 1 Development',
                desc: 'Phase 1 (3-Month) Core Process Implementation - October to December 2025',
                defaultLists: false,
                key: this.apiKey,
                token: this.adminToken
            };

            const response = await fetch(`${this.baseUrl}/boards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(boardData)
            });

            if (response.ok) {
                const board = await response.json();
                this.boardId = board.id;
                return board;
            } else {
                throw new Error('Failed to create board');
            }
        } catch (error) {
            console.error('Error creating/getting board:', error);
            throw error;
        }
    }

    /**
     * Get user's boards
     */
    async getBoards() {
        try {
            const response = await fetch(`${this.baseUrl}/members/me/boards?key=${this.apiKey}&token=${this.adminToken}`);
            if (response.ok) {
                return await response.json();
            }
            return [];
        } catch (error) {
            console.error('Error fetching boards:', error);
            return [];
        }
    }

    /**
     * Create lists for each priority level
     */
    async createPriorityLists() {
        const priorities = [
            { name: '📋 TO DO', pos: 1 },
            { name: '🔄 ON-GOING', pos: 2 },
            { name: '🧪 FOR TESTING', pos: 3 },
            { name: '✅ DONE', pos: 4 },
            { name: '🔥 Priority 1: System Foundation', pos: 5 },
            { name: '🛠️ Priority 2: Maintenance Features', pos: 6 },
            { name: '🎯 Priority 3: Student Core Processes', pos: 7 },
            { name: '👨‍🏫 Priority 4: Faculty Core Processes', pos: 8 },
            { name: '⚙️ Priority 5: Admin Core Processes', pos: 9 },
            { name: '🔗 Priority 6: Integration & Testing', pos: 10 },
            { name: '🎉 Pilot Launch (Jan 2026)', pos: 11 },
            { name: 'General', pos: 12 }
        ];

        for (const priority of priorities) {
            try {
                // Check if list already exists
                const existingLists = await this.getBoardLists();
                const existingList = existingLists.find(list => list.name === priority.name);
                
                if (existingList) {
                    this.lists[priority.name] = existingList.id;
                    console.log(`List ${priority.name} already exists`);
                    continue;
                }

                const listData = {
                    name: priority.name,
                    idBoard: this.boardId,
                    pos: priority.pos,
                    key: this.apiKey,
                    token: this.token
                };

                const response = await fetch(`${this.baseUrl}/lists`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(listData)
                });

                if (response.ok) {
                    const list = await response.json();
                    this.lists[priority.name] = list.id;
                    console.log(`Created list: ${priority.name}`);
                } else {
                    const errorText = await response.text();
                    console.error(`Failed to create list ${priority.name}:`, errorText);
                }
                
                // Small delay between list creations
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error creating list ${priority.name}:`, error);
            }
        }
    }

    /**
     * Create only the 4 main status lists (for priority sync)
     */
    async createMainStatusLists() {
        const mainLists = [
            { name: '📋 TO DO', pos: 1 },
            { name: '🔄 ON-GOING', pos: 2 },
            { name: '🧪 FOR TESTING', pos: 3 },
            { name: '✅ DONE', pos: 4 }
        ];

        for (const list of mainLists) {
            try {
                // Check if list already exists
                const existingLists = await this.getBoardLists();
                const existingList = existingLists.find(existingList => existingList.name === list.name);
                
                if (existingList) {
                    this.lists[list.name] = existingList.id;
                    console.log(`List ${list.name} already exists`);
                    continue;
                }

                const listData = {
                    name: list.name,
                    idBoard: this.boardId,
                    pos: list.pos,
                    key: this.apiKey,
                    token: this.token
                };

                const response = await fetch(`${this.baseUrl}/lists`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(listData)
                });

                if (response.ok) {
                    const newList = await response.json();
                    this.lists[list.name] = newList.id;
                    console.log(`Created main status list: ${list.name}`);
                } else {
                    const errorText = await response.text();
                    console.error(`Failed to create list ${list.name}:`, errorText);
                }
                
                // Small delay between list creations
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error creating main status list ${list.name}:`, error);
            }
        }
    }

    /**
     * Get all lists from the board
     */
    async getBoardLists() {
        try {
            const response = await fetch(`${this.baseUrl}/boards/${this.boardId}/lists?key=${this.apiKey}&token=${this.adminToken}`);
            if (response.ok) {
                const lists = await response.json();
                lists.forEach(list => {
                    this.lists[list.name] = list.id;
                });
                return lists;
            }
            return [];
        } catch (error) {
            console.error('Error fetching lists:', error);
            return [];
        }
    }

    /**
     * Create or update card for a task
     */
    async createCard(taskData, listName) {
        try {
            const listId = this.lists[listName];
            if (!listId) {
                console.log(`Available lists:`, Object.keys(this.lists));
                console.log(`Looking for list: ${listName}`);
                throw new Error(`List ${listName} not found`);
            }

            // Check if card exists in any list
            const cardInfo = await this.findCardInAnyList(taskData.title);
            
            if (cardInfo) {
                // Card exists - check if it's in the target list
                if (cardInfo.currentList === listName) {
                    // Card is in the target list - update it
                    console.log(`Updating existing card in ${listName}: ${taskData.title}`);
                    return await this.updateCard(cardInfo.card.id, taskData, listId);
                } else {
                    // Card is in a different list - skip it
                    console.log(`Skipping card "${taskData.title}" - already in ${cardInfo.currentList}`);
                    return {
                        ...cardInfo.card,
                        wasUpdated: false,
                        wasSkipped: true,
                        skipReason: `Already in ${cardInfo.currentList}`
                    };
                }
            } else {
                // Card doesn't exist - create new one
                console.log(`Creating new card in ${listName}: ${taskData.title}`);
                return await this.createNewCard(taskData, listId);
            }
        } catch (error) {
            console.error('Error creating/updating card:', error);
            throw error;
        }
    }

    /**
     * Find existing card by title in a specific list
     */
    async findExistingCard(title, listId) {
        try {
            const response = await fetch(`${this.baseUrl}/lists/${listId}/cards?key=${this.apiKey}&token=${this.adminToken}`);
            if (!response.ok) {
                return null;
            }
            
            const cards = await response.json();
            return cards.find(card => card.name === title);
        } catch (error) {
            console.error('Error finding existing card:', error);
            return null;
        }
    }

    /**
     * Check if card exists in any list and get its current list
     */
    async findCardInAnyList(title) {
        try {
            // Get all lists from the board
            const lists = await this.getBoardLists();
            
            for (const list of lists) {
                const response = await fetch(`${this.baseUrl}/lists/${list.id}/cards?key=${this.apiKey}&token=${this.adminToken}`);
                if (response.ok) {
                    const cards = await response.json();
                    const card = cards.find(card => card.name === title);
                    if (card) {
                        return {
                            card: card,
                            currentList: list.name,
                            listId: list.id
                        };
                    }
                }
            }
            return null;
        } catch (error) {
            console.error('Error finding card in any list:', error);
            return null;
        }
    }

    /**
     * Create new card
     */
    async createNewCard(taskData, listId) {
        const cardData = {
            name: taskData.title,
            desc: this.formatCardDescription(taskData),
            idList: listId,
            pos: 'top',
            labels: this.getCardLabels(taskData),
            key: this.apiKey,
            token: this.token
        };

        const response = await fetch(`${this.baseUrl}/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardData)
        });

        if (response.ok) {
            const card = await response.json();
            card.wasUpdated = false; // Mark as newly created
            console.log(`Created new card: ${taskData.title}`);
            
            // Create checklist for task details
            if (taskData.details && taskData.details.length > 0) {
                await this.createChecklist(card.id, taskData.details);
            }
            
            return card;
        } else {
            const errorText = await response.text();
            console.error(`Failed to create card ${taskData.title}:`, errorText);
            throw new Error(`Failed to create card: ${errorText}`);
        }
    }

    /**
     * Update existing card
     */
    async updateCard(cardId, taskData, listId) {
        const cardData = {
            name: taskData.title,
            desc: this.formatCardDescription(taskData),
            idList: listId,
            labels: this.getCardLabels(taskData),
            key: this.apiKey,
            token: this.token
        };

        const response = await fetch(`${this.baseUrl}/cards/${cardId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardData)
        });

        if (response.ok) {
            const card = await response.json();
            card.wasUpdated = true; // Mark as updated
            console.log(`Updated existing card: ${taskData.title}`);
            
            // Update checklist for task details
            if (taskData.details && taskData.details.length > 0) {
                await this.updateChecklist(cardId, taskData.details);
            }
            
            return card;
        } else {
            const errorText = await response.text();
            console.error(`Failed to update card ${taskData.title}:`, errorText);
            throw new Error(`Failed to update card: ${errorText}`);
        }
    }

    /**
     * Create checklist for task details
     */
    async createChecklist(cardId, details) {
        try {
            const checklistData = {
                name: '📋 Requirements & Specifications',
                idCard: cardId,
                key: this.apiKey,
                token: this.adminToken
            };

            const response = await fetch(`${this.baseUrl}/checklists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(checklistData)
            });

            if (response.ok) {
                const checklist = await response.json();
                console.log(`Created checklist for card ${cardId}`);
                
                // Add checklist items with proper formatting
                for (const detail of details) {
                    if (detail.trim()) {
                        await this.addChecklistItem(checklist.id, detail);
                    }
                }
            } else {
                console.error(`Failed to create checklist for card ${cardId}`);
            }
        } catch (error) {
            console.error('Error creating checklist:', error);
        }
    }

    /**
     * Update checklist for task details
     */
    async updateChecklist(cardId, details) {
        try {
            // Get existing checklists for the card
            const response = await fetch(`${this.baseUrl}/cards/${cardId}/checklists?key=${this.apiKey}&token=${this.adminToken}`);
            if (!response.ok) {
                return;
            }

            const checklists = await response.json();
            let checklist = checklists.find(c => c.name === '📋 Requirements & Specifications' || c.name === 'Task Details');

            if (!checklist) {
                // Create new checklist if it doesn't exist
                await this.createChecklist(cardId, details);
                return;
            }

            // Clear existing items
            for (const item of checklist.checkItems) {
                await fetch(`${this.baseUrl}/checklists/${checklist.id}/checkItems/${item.id}?key=${this.apiKey}&token=${this.adminToken}`, {
                    method: 'DELETE'
                });
            }

            // Add new items with proper formatting
            for (const detail of details) {
                if (detail.trim()) {
                    await this.addChecklistItem(checklist.id, detail);
                }
            }

            console.log(`Updated checklist for card ${cardId}`);
        } catch (error) {
            console.error('Error updating checklist:', error);
        }
    }

    /**
     * Add item to checklist
     */
    async addChecklistItem(checklistId, itemName) {
        try {
            const itemData = {
                name: itemName,
                key: this.apiKey,
                token: this.adminToken
            };

            const response = await fetch(`${this.baseUrl}/checklists/${checklistId}/checkItems`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData)
            });

            if (response.ok) {
                console.log(`Added checklist item: ${itemName}`);
            } else {
                console.error(`Failed to add checklist item: ${itemName}`);
            }
        } catch (error) {
            console.error('Error adding checklist item:', error);
        }
    }

    /**
     * Format card description
     */
    formatCardDescription(taskData) {
        let desc = `**Ticket:** ${taskData.ticket}\n`;
        desc += `**Priority:** ${taskData.priority}\n`;
        desc += `**Week:** ${taskData.week}\n`;
        desc += `**Category:** ${taskData.priorityCategory}\n`;
        desc += `**Type:** ${taskData.type.toUpperCase()}\n\n`;
        
        if (taskData.expectedResult) {
            desc += `**Expected Result:**\n${taskData.expectedResult}\n\n`;
        }
        
        desc += `📋 **Comprehensive task details and requirements are organized in the checklist below**\n`;
        desc += `✅ **Check off items as you complete them to track progress**\n\n`;
        desc += `🔍 **Priority Category Sync:** This task was synced by priority category for focused development`;
        
        return desc;
    }

    /**
     * Get card labels based on task type
     */
    getCardLabels(taskData) {
        const labels = [];
        
        if (taskData.type === 'frontend') {
            labels.push('green'); // Frontend tasks
        } else if (taskData.type === 'backend') {
            labels.push('red'); // Backend tasks
        }
        
        if (taskData.priority === 'Critical') {
            labels.push('purple'); // Critical priority
        } else if (taskData.priority === 'High') {
            labels.push('orange'); // High priority
        }
        
        return labels;
    }

    /**
     * Sync all Phase 1 tasks to Trello
     */
    async syncAllTasks() {
        try {
            // Initialize and create board
            await this.initialize();
            await this.createOrGetBoard();
            
            // Create priority lists first
            await this.createPriorityLists();
            
            // Create board labels
            await this.createBoardLabels();
            
            // Wait a moment for lists to be created
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Get all lists from the board
            await this.getBoardLists();

            // Get all task data from the page
            const tasks = this.extractTasksFromPage();
            console.log(`Extracted ${tasks.length} tasks from page`);
            console.log('Available lists:', Object.keys(this.lists));
            
            // Create cards for each task
            const results = [];
            for (const task of tasks) {
                try {
                    console.log(`Processing card for "${task.taskData.title}" in list "${task.listName}"`);
                    const card = await this.createCard(task.taskData, task.listName);
                    results.push({ 
                        success: true, 
                        task: task.taskData.title, 
                        card: card,
                        action: card.wasSkipped ? 'skipped' : (card.wasUpdated ? 'updated' : 'created')
                    });
                } catch (error) {
                    console.log(`Failed to process card for "${task.taskData.title}": ${error.message}`);
                    results.push({ success: false, task: task.taskData.title, error: error.message });
                }
            }

            return results;
        } catch (error) {
            console.error('Error syncing tasks:', error);
            throw error;
        }
    }

    /**
     * Sync tasks for a specific priority category
     */
    async syncPriorityTasks(priorityCategory) {
        try {
            // Initialize and create board
            await this.initialize();
            await this.createOrGetBoard();
            
            // Only create the 4 main status lists, not priority category lists
            await this.createMainStatusLists();
            
            // Create board labels
            await this.createBoardLabels();
            
            // Wait a moment for lists to be created
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Get all lists from the board
            await this.getBoardLists();

            // Get tasks for specific priority category
            const tasks = this.extractTasksFromPage(priorityCategory);
            console.log(`Extracted ${tasks.length} tasks for priority: ${priorityCategory}`);
            
            // Create cards for each task (all go to TO DO list)
            const results = [];
            for (const task of tasks) {
                try {
                    console.log(`Processing card for "${task.taskData.title}" in list "${task.listName}"`);
                    console.log(`Task details count: ${task.taskData.details.length}`);
                    const card = await this.createCard(task.taskData, task.listName);
                    results.push({ 
                        success: true, 
                        task: task.taskData.title, 
                        card: card,
                        action: card.wasSkipped ? 'skipped' : (card.wasUpdated ? 'updated' : 'created'),
                        detailsCount: task.taskData.details.length
                    });
                } catch (error) {
                    console.log(`Failed to process card for "${task.taskData.title}": ${error.message}`);
                    results.push({ success: false, task: task.taskData.title, error: error.message });
                }
            }

            return results;
        } catch (error) {
            console.error('Error syncing priority tasks:', error);
            throw error;
        }
    }

    /**
     * Extract task data from the page
     */
    extractTasksFromPage(filterPriority = null) {
        const tasks = [];
        const taskCards = document.querySelectorAll('.task-card');
        
        taskCards.forEach(card => {
            const ticket = card.querySelector('.task-ticket')?.textContent || '';
            const title = card.querySelector('h4')?.textContent || '';
            const priority = card.querySelector('.task-priority')?.textContent?.replace('Priority: ', '') || '';
            const week = card.querySelector('.task-status')?.textContent || '';
            const type = card.classList.contains('frontend') ? 'frontend' : 'backend';
            
            // Extract comprehensive task details for checklists
            const taskDetails = this.extractComprehensiveTaskDetails(card);
            
            const expectedResult = card.querySelector('.expected-result p')?.textContent || '';
            
            // All tasks start in TO DO list
            let listName = '📋 TO DO';
            
            // Determine priority category for labeling (but keep in TO DO)
            const moduleHeader = card.closest('.module-section')?.querySelector('.module-header h3');
            let priorityCategory = 'General';
            
            if (moduleHeader) {
                const headerText = moduleHeader.textContent;
                // Map the module headers to priority categories for labeling
                if (headerText.includes('Priority 1: System Foundation')) {
                    priorityCategory = '🔥 Priority 1: System Foundation';
                } else if (headerText.includes('Priority 2: Maintenance Features')) {
                    priorityCategory = '🛠️ Priority 2: Maintenance Features';
                } else if (headerText.includes('Priority 3: Student Core Processes')) {
                    priorityCategory = '🎯 Priority 3: Student Core Processes';
                } else if (headerText.includes('Priority 4: Faculty Core Processes')) {
                    priorityCategory = '👨‍🏫 Priority 4: Faculty Core Processes';
                } else if (headerText.includes('Priority 5: Admin Core Processes')) {
                    priorityCategory = '⚙️ Priority 5: Admin Core Processes';
                } else if (headerText.includes('Priority 6: Integration & Testing')) {
                    priorityCategory = '🔗 Priority 6: Integration & Testing';
                } else if (headerText.includes('Pilot Launch')) {
                    priorityCategory = '🎉 Pilot Launch (Jan 2026)';
                }
            }
            
            // Filter by priority category if specified
            if (filterPriority && priorityCategory !== filterPriority) {
                return; // Skip this task if it doesn't match the filter
            }
            
            const taskData = {
                ticket,
                title,
                priority,
                week,
                type,
                details: taskDetails, // Use comprehensive details
                expectedResult,
                priorityCategory
            };
            
            tasks.push({ taskData, listName });
        });
        
        return tasks;
    }

    /**
     * Extract comprehensive task details for checklist creation
     */
    extractComprehensiveTaskDetails(card) {
        const details = [];
        
        // Extract Frontend Requirements
        const frontendSection = card.querySelector('.task-details');
        if (frontendSection) {
            const frontendItems = frontendSection.querySelectorAll('li');
            if (frontendItems.length > 0) {
                frontendItems.forEach(item => {
                    const text = item.textContent.trim();
                    if (text) {
                        details.push(`• ${text}`);
                    }
                });
            }
        }
        
        // Extract Backend Requirements (if exists)
        const backendSection = card.querySelector('.task-details.backend');
        if (backendSection) {
            const backendItems = backendSection.querySelectorAll('li');
            if (backendItems.length > 0) {
                backendItems.forEach(item => {
                    const text = item.textContent.trim();
                    if (text) {
                        details.push(`• ${text}`);
                    }
                });
            }
        }
        
        // Extract UI/UX Specifications
        const uiSpecs = card.querySelector('.task-description');
        if (uiSpecs) {
            const uiSections = uiSpecs.querySelectorAll('.task-expected, h5');
            
            uiSections.forEach(section => {
                if (section.tagName === 'H5') {
                    const sectionTitle = section.textContent.trim();
                    if (sectionTitle && !sectionTitle.includes('UI/UX')) {
                        // Add section as a checklist item
                        details.push(`📌 ${sectionTitle}`);
                    }
                } else if (section.classList.contains('task-expected')) {
                    const subSections = section.querySelectorAll('h5, ul');
                    subSections.forEach(subSection => {
                        if (subSection.tagName === 'H5') {
                            const subTitle = subSection.textContent.trim();
                            details.push(`🔹 ${subTitle}`);
                        } else if (subSection.tagName === 'UL') {
                            const items = subSection.querySelectorAll('li');
                            items.forEach(item => {
                                const text = item.textContent.trim();
                                if (text) {
                                    details.push(`  • ${text}`);
                                }
                            });
                        }
                    });
                }
            });
        }
        
        // Extract Expected Results
        const expectedSection = card.querySelector('.task-expected');
        if (expectedSection) {
            const expectedItems = expectedSection.querySelectorAll('li');
            if (expectedItems.length > 0) {
                expectedItems.forEach(item => {
                    const text = item.textContent.trim();
                    if (text) {
                        details.push(`✅ ${text}`);
                    }
                });
            }
        }
        
        // Extract additional task details from task-body
        const taskBody = card.querySelector('.task-body');
        if (taskBody) {
            const additionalSections = taskBody.querySelectorAll('h5, .task-expected');
            additionalSections.forEach(section => {
                if (section.tagName === 'H5') {
                    const title = section.textContent.trim();
                    if (title && !details.some(d => d.includes(title))) {
                        const nextElement = section.nextElementSibling;
                        if (nextElement && nextElement.tagName === 'UL') {
                            details.push(`📝 ${title}`);
                            const items = nextElement.querySelectorAll('li');
                            items.forEach(item => {
                                const text = item.textContent.trim();
                                if (text) {
                                    details.push(`  • ${text}`);
                                }
                            });
                        }
                    }
                }
            });
        }
        
        // If no detailed requirements found, try to extract basic details
        if (details.length === 0) {
            const basicDetails = card.querySelectorAll('.task-details li');
            if (basicDetails.length > 0) {
                basicDetails.forEach(item => {
                    const text = item.textContent.trim();
                    if (text) {
                        details.push(`• ${text}`);
                    }
                });
            }
        }
        
        return details;
    }

    /**
     * Create labels for the board
     */
    async createBoardLabels() {
        const labels = [
            { name: 'Frontend', color: 'green' },
            { name: 'Backend', color: 'red' },
            { name: 'Critical', color: 'purple' },
            { name: 'High Priority', color: 'orange' },
            { name: 'Medium Priority', color: 'yellow' },
            { name: 'Low Priority', color: 'blue' }
        ];

        for (const label of labels) {
            try {
                const labelData = {
                    name: label.name,
                    color: label.color,
                    idBoard: this.boardId,
                    key: this.apiKey,
                    token: this.token
                };

                await fetch(`${this.baseUrl}/labels`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(labelData)
                });
            } catch (error) {
                console.error(`Error creating label ${label.name}:`, error);
            }
        }
    }

    /**
     * Clean up old cards and unwanted lists from the board
     */
    async cleanupBoard() {
        try {
            if (!this.boardId) {
                throw new Error('No board ID available. Please sync tasks first.');
            }

            // Define the lists we want to keep (only the 4 main status lists)
            const keepLists = [
                '📋 TO DO',
                '🔄 ON-GOING', 
                '🧪 FOR TESTING',
                '✅ DONE'
            ];

            // Get all lists from the board
            const listsResponse = await fetch(`${this.baseUrl}/boards/${this.boardId}/lists?key=${this.apiKey}&token=${this.adminToken}`);
            if (!listsResponse.ok) {
                throw new Error('Failed to fetch board lists');
            }

            const allLists = await listsResponse.json();
            console.log(`Found ${allLists.length} lists on board`);

            // Find lists to delete (all except the 4 main status lists)
            const listsToDelete = allLists.filter(list => !keepLists.includes(list.name));
            console.log(`Found ${listsToDelete.length} lists to delete:`, listsToDelete.map(l => l.name));

            let deletedLists = 0;
            let listErrors = 0;

            // Delete unwanted lists
            for (const list of listsToDelete) {
                try {
                    // First, archive the list (this also removes all cards in it)
                    const archiveResponse = await fetch(`${this.baseUrl}/lists/${list.id}?closed=true&key=${this.apiKey}&token=${this.token}`, {
                        method: 'PUT'
                    });
                    
                    if (archiveResponse.ok) {
                        deletedLists++;
                        console.log(`Archived list: ${list.name}`);
                    } else {
                        listErrors++;
                        console.log(`Failed to archive list: ${list.name}`);
                    }
                    
                    // Small delay between list operations
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    listErrors++;
                    console.log(`Error archiving list ${list.name}:`, error.message);
                }
            }

            // Get remaining cards from the kept lists
            const cardsResponse = await fetch(`${this.baseUrl}/boards/${this.boardId}/cards?key=${this.apiKey}&token=${this.adminToken}`);
            if (!cardsResponse.ok) {
                throw new Error('Failed to fetch board cards');
            }

            const cards = await cardsResponse.json();
            console.log(`Found ${cards.length} cards to clean up from remaining lists`);

            // Delete remaining cards in batches
            const batchSize = 10;
            const batches = [];
            for (let i = 0; i < cards.length; i += batchSize) {
                batches.push(cards.slice(i, i + batchSize));
            }

            let totalDeleted = 0;
            let totalErrors = 0;
            const errors = [];

            for (let i = 0; i < batches.length; i++) {
                const batch = batches[i];
                console.log(`Processing card batch ${i + 1}/${batches.length} (${batch.length} cards)`);
                
                const batchPromises = batch.map(async (card, index) => {
                    await new Promise(resolve => setTimeout(resolve, index * 100));
                    
                    try {
                        const deleteResponse = await fetch(`${this.baseUrl}/cards/${card.id}?key=${this.apiKey}&token=${this.adminToken}`, {
                            method: 'DELETE'
                        });
                        
                        if (deleteResponse.ok) {
                            return { success: true, cardId: card.id };
                        } else {
                            const errorText = await deleteResponse.text();
                            return { success: false, cardId: card.id, error: errorText };
                        }
                    } catch (error) {
                        return { success: false, cardId: card.id, error: error.message };
                    }
                });

                const batchResults = await Promise.all(batchPromises);
                
                const batchDeleted = batchResults.filter(r => r.success).length;
                const batchErrors = batchResults.filter(r => !r.success).length;
                
                totalDeleted += batchDeleted;
                totalErrors += batchErrors;
                
                batchResults.filter(r => !r.success).forEach(r => {
                    errors.push(`Card ${r.cardId}: ${r.error}`);
                });

                console.log(`Card batch ${i + 1} completed: ${batchDeleted} deleted, ${batchErrors} errors`);
                
                if (i < batches.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }

            return {
                success: true,
                totalLists: allLists.length,
                deletedLists: deletedLists,
                listErrors: listErrors,
                totalCards: cards.length,
                deletedCards: totalDeleted,
                cardErrors: totalErrors,
                errorDetails: errors.slice(0, 10)
            };
        } catch (error) {
            console.error('Error cleaning up board:', error);
            throw error;
        }
    }

    /**
     * Get board URL
     */
    getBoardUrl() {
        if (this.boardId) {
            return `https://trello.com/b/${this.boardId}`;
        }
        return null;
    }

    /**
     * Find and get SKOLARIS board URL
     */
    async findSkolarisBoardUrl() {
        try {
            const boards = await this.getBoards();
            const skolarisBoard = boards.find(board => 
                board.name === 'SKOLARIS - Phase 1 Development' || 
                board.name.includes('SKOLARIS')
            );
            
            if (skolarisBoard) {
                this.boardId = skolarisBoard.id;
                return skolarisBoard.url;
            }
            return null;
        } catch (error) {
            console.error('Error finding SKOLARIS board:', error);
            return null;
        }
    }

    /**
     * Get checklist status for a specific task card
     */
    async getTaskChecklistStatus(cardId) {
        try {
            const response = await fetch(`${this.baseUrl}/cards/${cardId}/checklists?key=${this.apiKey}&token=${this.adminToken}`);
            if (!response.ok) {
                return null;
            }
            
            const checklists = await response.json();
            const checklistStatus = [];
            
            for (const checklist of checklists) {
                if (checklist.checkItems && checklist.checkItems.length > 0) {
                    const items = checklist.checkItems.map(item => ({
                        id: item.id,
                        name: item.name,
                        state: item.state, // 'complete' or 'incomplete'
                        status: item.state === 'complete' ? 'completed' : 'pending'
                    }));
                    
                    checklistStatus.push({
                        checklistName: checklist.name,
                        items: items,
                        totalItems: items.length,
                        completedItems: items.filter(item => item.state === 'complete').length,
                        completionRate: items.length > 0 ? Math.round((items.filter(item => item.state === 'complete').length / items.length) * 100) : 0
                    });
                }
            }
            
            return checklistStatus;
        } catch (error) {
            console.error('Error getting checklist status:', error);
            return null;
        }
    }

    /**
     * Get all task cards with their checklist status
     */
    async getAllTasksWithChecklistStatus() {
        try {
            // Find SKOLARIS board
                const boardUrl = await this.findSkolarisBoardUrl();
                if (!boardUrl) {
                    throw new Error('No SKOLARIS board found');
            }

            // Get all cards
            const cardsResponse = await fetch(`${this.baseUrl}/boards/${this.boardId}/cards?key=${this.apiKey}&token=${this.adminToken}`);
            if (!cardsResponse.ok) {
                throw new Error('Failed to fetch cards');
            }
            const cards = await cardsResponse.json();

            // Get all lists
            const lists = await this.getBoardLists();

            // Get checklist status for each card
            const tasksWithStatus = [];
            for (const card of cards) {
                const checklistStatus = await this.getTaskChecklistStatus(card.id);
                const listName = lists.find(list => list.id === card.idList)?.name || 'Unknown';
                
                tasksWithStatus.push({
                    cardId: card.id,
                    cardName: card.name,
                    listName: listName,
                    checklistStatus: checklistStatus,
                    url: card.url
                });
            }

            return tasksWithStatus;
        } catch (error) {
            console.error('Error getting tasks with checklist status:', error);
            throw error;
        }
    }

    /**
     * Get comments and activity for a specific card
     */
    async getCardComments(cardId) {
        try {
            // Fetch comprehensive activity types for detailed logs
            const response = await fetch(`${this.baseUrl}/cards/${cardId}/actions?filter=commentCard,updateCard,createCard,addChecklistToCard,updateCheckItemStateOnCard,addMemberToCard,removeMemberFromCard,addAttachmentToCard,deleteAttachmentFromCard,addLabelToCard,removeLabelFromCard,copyCard,moveCardToBoard&key=${this.apiKey}&token=${this.adminToken}`);
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            
            const actions = await response.json();
            const comments = [];
            
            actions.forEach(action => {
                const memberCreator = action.memberCreator;
                const baseData = {
                    id: action.id,
                    author: memberCreator ? memberCreator.fullName : 'Unknown User',
                    username: memberCreator ? memberCreator.username : 'unknown',
                    initials: memberCreator ? (memberCreator.initials || memberCreator.fullName.split(' ').map(n => n[0]).join('').toUpperCase()) : '??',
                    avatarUrl: memberCreator ? memberCreator.avatarUrl : null,
                    date: new Date(action.date)
                };

                if (action.type === 'commentCard') {
                    comments.push({
                        ...baseData,
                        text: action.data.text,
                        type: 'comment'
                    });
                } else if (action.type === 'updateCard') {
                    if (action.data.listAfter && action.data.listBefore) {
                        comments.push({
                            ...baseData,
                            text: `📋 Moved from "${action.data.listBefore.name}" to "${action.data.listAfter.name}"`,
                            type: 'activity',
                            activityType: 'move'
                        });
                    } else if (action.data.card && action.data.old) {
                        // Handle other card updates with specific details
                        let updateText = '';
                        let updateDetails = [];
                        
                        // Check for name changes
                        if (action.data.old.name !== undefined && action.data.card.name !== action.data.old.name) {
                            updateText = `📝 Renamed card from "${action.data.old.name}" to "${action.data.card.name}"`;
                        }
                        // Check for description changes
                        else if (action.data.old.desc !== undefined) {
                            if (action.data.old.desc === '' && action.data.card.desc) {
                                updateText = `📄 Added card description`;
                            } else if (action.data.old.desc && action.data.card.desc === '') {
                                updateText = `📄 Removed card description`;
                            } else {
                                updateText = `📄 Updated card description`;
                            }
                        }
                        // Check for due date changes
                        else if (action.data.old.due !== undefined) {
                            if (action.data.old.due === null && action.data.card.due) {
                                const dueDate = new Date(action.data.card.due).toLocaleDateString();
                                updateText = `📅 Set due date to ${dueDate}`;
                            } else if (action.data.old.due && action.data.card.due === null) {
                                updateText = `📅 Removed due date`;
                            } else if (action.data.old.due && action.data.card.due) {
                                const oldDate = new Date(action.data.old.due).toLocaleDateString();
                                const newDate = new Date(action.data.card.due).toLocaleDateString();
                                updateText = `📅 Changed due date from ${oldDate} to ${newDate}`;
                            }
                        }
                        // Check for position changes (within same list)
                        else if (action.data.old.pos !== undefined && action.data.card.pos !== action.data.old.pos) {
                            updateText = `🔄 Changed card position in list`;
                        }
                        // Check for closed/archived status
                        else if (action.data.old.closed !== undefined) {
                            if (action.data.card.closed && !action.data.old.closed) {
                                updateText = `📦 Archived card`;
                            } else if (!action.data.card.closed && action.data.old.closed) {
                                updateText = `📤 Unarchived card`;
                            }
                        }
                        // Generic fallback with more details
                        else {
                            const changedFields = [];
                            Object.keys(action.data.old).forEach(key => {
                                if (key !== 'dateLastActivity') {
                                    changedFields.push(key);
                                }
                            });
                            
                            if (changedFields.length > 0) {
                                updateText = `✏️ Updated card ${changedFields.join(', ').replace(/([A-Z])/g, ' $1').toLowerCase()}`;
                            } else {
                                updateText = `✏️ Updated card properties`;
                            }
                        }
                        
                        if (updateText) {
                            comments.push({
                                ...baseData,
                                text: updateText,
                                type: 'activity',
                                activityType: 'update'
                            });
                        }
                    }
                } else if (action.type === 'createCard') {
                    comments.push({
                        ...baseData,
                        text: '🎯 Card created',
                        type: 'activity',
                        activityType: 'create'
                    });
                } else if (action.type === 'addChecklistToCard') {
                    comments.push({
                        ...baseData,
                        text: `📋 Added checklist "${action.data.checklist.name}"`,
                        type: 'activity',
                        activityType: 'checklist'
                    });
                } else if (action.type === 'updateCheckItemStateOnCard') {
                    const checkItem = action.data.checkItem;
                    const checklist = action.data.checklist;
                    const isCompleted = checkItem.state === 'complete';
                    comments.push({
                        ...baseData,
                        text: `${isCompleted ? '✅' : '⬜'} ${isCompleted ? 'Completed' : 'Unchecked'} "${checkItem.name}" in "${checklist.name}"`,
                        type: 'activity',
                        activityType: 'checklist',
                        isCompleted: isCompleted
                    });
                } else if (action.type === 'addMemberToCard') {
                    const member = action.data.member;
                    comments.push({
                        ...baseData,
                        text: `👤 Added ${member.fullName} to the card`,
                        type: 'activity',
                        activityType: 'member'
                    });
                } else if (action.type === 'removeMemberFromCard') {
                    const member = action.data.member;
                    comments.push({
                        ...baseData,
                        text: `👤 Removed ${member.fullName} from the card`,
                        type: 'activity',
                        activityType: 'member'
                    });
                } else if (action.type === 'addAttachmentToCard') {
                    const attachment = action.data.attachment;
                    comments.push({
                        ...baseData,
                        text: `📎 Added attachment "${attachment.name}"`,
                        type: 'activity',
                        activityType: 'attachment'
                    });
                } else if (action.type === 'deleteAttachmentFromCard') {
                    const attachment = action.data.attachment;
                    comments.push({
                        ...baseData,
                        text: `🗑️ Removed attachment "${attachment.name}"`,
                        type: 'activity',
                        activityType: 'attachment'
                    });
                } else if (action.type === 'addLabelToCard') {
                    const label = action.data.label;
                    comments.push({
                        ...baseData,
                        text: `🏷️ Added label "${label.name || 'Unnamed'}" (${label.color})`,
                        type: 'activity',
                        activityType: 'label'
                    });
                } else if (action.type === 'removeLabelFromCard') {
                    const label = action.data.label;
                    comments.push({
                        ...baseData,
                        text: `🏷️ Removed label "${label.name || 'Unnamed'}" (${label.color})`,
                        type: 'activity',
                        activityType: 'label'
                    });
                } else if (action.type === 'copyCard') {
                    const card = action.data.card;
                    comments.push({
                        ...baseData,
                        text: `📋 Copied card to "${card.name}"`,
                        type: 'activity',
                        activityType: 'copy'
                    });
                } else if (action.type === 'moveCardToBoard') {
                    const board = action.data.board;
                    const boardAfter = action.data.boardTarget;
                    comments.push({
                        ...baseData,
                        text: `🔄 Moved card to board "${boardAfter.name}"`,
                        type: 'activity',
                        activityType: 'move'
                    });
                }
            });
            
            // Sort by date (oldest first, latest at bottom)
            comments.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            return comments;
        } catch (error) {
            console.error('Error fetching card comments:', error);
            throw error;
        }
    }

    /**
     * Add an attachment to a Trello card
     */
    async addCardAttachment(cardId, file) {
        if (!this.userToken) {
            throw new Error('Please connect your Trello account first to add attachments.');
        }
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('key', this.apiKey);
            formData.append('token', this.userToken);
            formData.append('name', file.name);

            const response = await fetch(`${this.baseUrl}/cards/${cardId}/attachments`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to add attachment: ${errorText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error adding attachment:', error);
            throw error;
        }
    }

    /**
     * Add a comment to a Trello card
     */
    async addCardComment(cardId, commentText) {
        if (!this.userToken) {
            throw new Error('Please connect your Trello account first to add comments.');
        }
        
        try {
            const commentData = {
                text: commentText,
                key: this.apiKey,
                token: this.userToken
            };

            const response = await fetch(`${this.baseUrl}/cards/${cardId}/actions/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to add comment: ${errorText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    }

    /**
     * Update a comment on a Trello card
     */
    async updateCardComment(actionId, newText) {
        if (!this.userToken) {
            throw new Error('Please connect your Trello account first to edit comments.');
        }
        
        try {
            const updateData = {
                text: newText,
                key: this.apiKey,
                token: this.userToken
            };

            const response = await fetch(`${this.baseUrl}/actions/${actionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update comment: ${errorText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error updating comment:', error);
            throw error;
        }
    }

    /**
     * Delete a comment from a Trello card
     */
    async deleteCardComment(actionId) {
        if (!this.userToken) {
            throw new Error('Please connect your Trello account first to delete comments.');
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/actions/${actionId}?key=${this.apiKey}&token=${this.userToken}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete comment: ${errorText}`);
            }

            return true;
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }

    /**
     * Get checklist progress for current priority
     */
    async getChecklistProgress() {
        try {
            // Find SKOLARIS board
            const boardUrl = await this.findSkolarisBoardUrl();
            if (!boardUrl) {
                throw new Error('No SKOLARIS board found');
            }

            // Get all cards
            const cardsResponse = await fetch(`${this.baseUrl}/boards/${this.boardId}/cards?key=${this.apiKey}&token=${this.adminToken}`);
            if (!cardsResponse.ok) {
                throw new Error('Failed to fetch cards');
            }
            const cards = await cardsResponse.json();

            // Get all lists
            const lists = await this.getBoardLists();

            // Get checklist progress for each card
            const checklistProgress = [];
            for (const card of cards) {
                const listName = lists.find(list => list.id === card.idList)?.name || 'Unknown';
                
                // Only get checklist progress for cards in main status lists
                if (listName.includes('TO DO') || listName.includes('ON-GOING') || 
                    listName.includes('FOR TESTING') || listName.includes('DONE')) {
                    
                    const checklistStatus = await this.getTaskChecklistStatus(card.id);
                    if (checklistStatus && checklistStatus.length > 0) {
                        checklistStatus.forEach(checklist => {
                            checklistProgress.push({
                                cardName: card.name,
                                listName: listName,
                                checklistName: checklist.checklistName,
                                completedItems: checklist.completedItems,
                                totalItems: checklist.totalItems,
                                completionRate: checklist.completionRate
                            });
                        });
                    }
                }
            }

            return checklistProgress;
        } catch (error) {
            console.error('Error getting checklist progress:', error);
            return [];
        }
    }

    /**
     * Get comprehensive status of all Trello tasks
     */
    async getAllTaskStatus() {
        try {
            // Find SKOLARIS board
            const boardUrl = await this.findSkolarisBoardUrl();
            if (!boardUrl) {
                throw new Error('No SKOLARIS board found');
            }

            // Get board details
            const boardResponse = await fetch(`${this.baseUrl}/boards/${this.boardId}?key=${this.apiKey}&token=${this.adminToken}`);
            if (!boardResponse.ok) {
                throw new Error('Failed to fetch board details');
            }
            const board = await boardResponse.json();

            // Get all lists
            const lists = await this.getBoardLists();
            
            // Get all cards
            const cardsResponse = await fetch(`${this.baseUrl}/boards/${this.boardId}/cards?key=${this.apiKey}&token=${this.adminToken}`);
            if (!cardsResponse.ok) {
                throw new Error('Failed to fetch cards');
            }
            const cards = await cardsResponse.json();

            // Analyze cards by status
            const statusCounts = {
                todoCards: 0,
                inProgressCards: 0,
                testingCards: 0,
                completedCards: 0
            };

            const priorityBreakdown = {};
            const typeBreakdown = { Frontend: 0, Backend: 0 };

            // Count cards by list
            cards.forEach(card => {
                const listName = lists.find(list => list.id === card.idList)?.name || 'Unknown';
                
                if (listName.includes('TO DO')) {
                    statusCounts.todoCards++;
                } else if (listName.includes('ON-GOING')) {
                    statusCounts.inProgressCards++;
                } else if (listName.includes('FOR TESTING')) {
                    statusCounts.testingCards++;
                } else if (listName.includes('DONE')) {
                    statusCounts.completedCards++;
                }

                // Analyze priority from labels
                if (card.labels && card.labels.length > 0) {
                    card.labels.forEach(label => {
                        if (label.name.includes('Priority')) {
                            priorityBreakdown[label.name] = (priorityBreakdown[label.name] || 0) + 1;
                        }
                        if (label.name === 'Frontend') {
                            typeBreakdown.Frontend++;
                        } else if (label.name === 'Backend') {
                            typeBreakdown.Backend++;
                        }
                    });
                }
            });

            // Get checklist statistics
            let checklistStats = null;
            try {
                const checklistResponse = await fetch(`${this.baseUrl}/boards/${this.boardId}/checklists?key=${this.apiKey}&token=${this.adminToken}`);
                if (checklistResponse.ok) {
                    const checklists = await checklistResponse.json();
                    let totalItems = 0;
                    let completedItems = 0;

                    for (const checklist of checklists) {
                        if (checklist.checkItems) {
                            totalItems += checklist.checkItems.length;
                            completedItems += checklist.checkItems.filter(item => item.state === 'complete').length;
                        }
                    }

                    checklistStats = {
                        totalItems,
                        completedItems,
                        completionRate: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
                    };
                }
            } catch (error) {
                console.log('Could not fetch checklist stats:', error.message);
            }

            return {
                boardName: board.name,
                boardUrl: board.url,
                totalCards: cards.length,
                ...statusCounts,
                priorityBreakdown: Object.keys(priorityBreakdown).length > 0 ? priorityBreakdown : null,
                typeBreakdown: Object.keys(typeBreakdown).length > 0 ? typeBreakdown : null,
                checklistStats
            };

        } catch (error) {
            console.error('Error getting task status:', error);
            throw error;
        }
    }
}

// Global instance
window.trelloIntegration = new TrelloIntegration();
