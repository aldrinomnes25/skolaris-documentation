/**
 * SKOLARIS Chatbot Integration Script
 * Add this script to your existing skolaris.html to include the floating chatbot
 */

// Chatbot HTML structure
const chatbotHTML = `
<div class="chatbot-container" id="skolarisChatbotContainer">
    <button class="chatbot-toggle" id="skolarisChatbotToggle">
        💬
    </button>
    
    <div class="chatbot-window" id="skolarisChatbotWindow">
        <div class="chatbot-header">
            <div class="header-content">
                <div class="header-text">
            <h3>SKOLARIS Assistant</h3>
                </div>
            </div>
            <div class="header-bottom">
                <span class="status-indicator">Online</span>
                <div class="header-controls">
                    <div class="scale-indicator" id="skolarisScaleIndicator">100%</div>
                    <button class="zoom-control" id="skolarisChatbotZoomOut" title="Zoom Out">−</button>
                    <button class="zoom-control" id="skolarisChatbotZoomIn" title="Zoom In">+</button>
                    <button class="zoom-control" id="skolarisChatbotReset" title="Reset to 100%">⌂</button>
            <button class="chatbot-close" id="skolarisChatbotClose">×</button>
                </div>
            </div>
        </div>
        
        <div class="chatbot-messages" id="skolarisChatbotMessages">
            <div class="message bot">
                <div class="message-content">
                    <strong>👋 Hello! I'm your SKOLARIS Assistant!</strong><br><br>
                    I can help you with:
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>📚 Navigating SKOLARIS documentation</li>
                        <li>🔗 Trello integration guidance</li>
                        <li>🛠️ Development task assistance</li>
                        <li>📊 Progress tracking help</li>
                    </ul>
                    <div class="quick-actions">
                        <button class="quick-action" onclick="askSkolarisQuestion('How do I use the Progress Tracker?')">Progress Tracker</button>
                        <button class="quick-action" onclick="askSkolarisQuestion('How do I sync tasks to Trello?')">Trello Sync</button>
                        <button class="quick-action" onclick="askSkolarisQuestion('What are the main documentation sections?')">Documentation</button>
                        <button class="quick-action" onclick="askSkolarisQuestion('How do I track development progress?')">Development</button>
                        <button class="quick-action" onclick="askSkolarisQuestion('What is the Phase 1 timeline?')">📅 Timeline</button>
                        <button class="quick-action" onclick="askSkolarisQuestion('What is the database structure?')">🗄️ Database</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="typing-indicator" id="skolarisTypingIndicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
        
        <div class="chatbot-input">
            <input type="text" id="skolarisChatbotInput" placeholder="Ask me anything about SKOLARIS..." autocomplete="off">
            <button class="chatbot-send" id="skolarisChatbotSend">Send</button>
        </div>
    </div>
</div>
`;

// Chatbot CSS styles
const chatbotCSS = `
<style>
/* SKOLARIS Chatbot Styles */
.chatbot-container {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 1000;
}

.chatbot-toggle {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chatbot-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 25px rgba(0,0,0,0.3);
}

.chatbot-window {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 350px;
    height: 500px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    display: none;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #e0e0e0;
}

.chatbot-window.active {
    display: flex;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.chatbot-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-content {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
}

.assistant-icon {
    font-size: 24px;
    background: rgba(255,255,255,0.2);
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.header-text h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    line-height: 1.2;
    white-space: nowrap;
}

.status-indicator {
    font-size: 0.75rem;
    color: #a8e6cf;
    font-weight: 500;
    display: block;
    margin-top: 2px;
}

.header-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.header-controls {
    display: flex;
    gap: 4px;
    align-items: center;
}

.scale-indicator {
    background: rgba(255,255,255,0.2);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
    min-width: 35px;
    text-align: center;
    margin-right: 4px;
}

.zoom-control {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    font-weight: bold;
}

.zoom-control:hover {
    background: rgba(255,255,255,0.2);
}

.chatbot-close {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    transition: background 0.2s;
}

.chatbot-close:hover {
    background: rgba(255,255,255,0.2);
}

.chatbot-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    scroll-behavior: smooth;
}

.chatbot-messages::-webkit-scrollbar {
    width: 6px;
}

.chatbot-messages::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.chatbot-messages::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.chatbot-messages::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

.message {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.message.user {
    align-items: flex-end;
}

.message.bot {
    align-items: flex-start;
}

.message-content {
    max-width: 85%;
    padding: 16px 20px;
    border-radius: 20px;
    font-size: 13px;
    line-height: 1.5;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    position: relative;
}

.message.user .message-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom-right-radius: 8px;
}

.message.bot .message-content {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    color: #2c3e50;
    border: 1px solid #e9ecef;
    border-bottom-left-radius: 8px;
}

.message-time {
    font-size: 10px;
    color: #6c757d;
    margin-top: 8px;
    padding: 0 8px;
    font-weight: 500;
}

.message.user .message-time {
    text-align: right;
}

.message.bot .message-time {
    text-align: left;
}

/* Enhanced message styling for better readability */
.message-content h1, .message-content h2, .message-content h3, 
.message-content h4, .message-content h5, .message-content h6 {
    margin: 12px 0 8px 0;
    color: inherit;
    font-weight: 600;
}

.message-content ul, .message-content ol {
    margin: 10px 0;
    padding-left: 20px;
}

.message-content li {
    margin: 6px 0;
}

.message-content strong {
    font-weight: 600;
}

.message-content code {
    background: rgba(0,0,0,0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 13px;
}

.message.user .message-content code {
    background: rgba(255,255,255,0.2);
}

.message-content blockquote {
    border-left: 3px solid #667eea;
    padding-left: 12px;
    margin: 10px 0;
    font-style: italic;
}

.message.user .message-content blockquote {
    border-left-color: rgba(255,255,255,0.5);
}

.chatbot-input {
    padding: 20px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-top: 1px solid #e9ecef;
    display: flex;
    gap: 12px;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
}

.chatbot-input input {
    flex: 1;
    padding: 14px 18px;
    border: 2px solid #e9ecef;
    border-radius: 25px;
    outline: none;
    font-size: 15px;
    transition: all 0.3s ease;
    background: white;
}

.chatbot-input input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
}

.chatbot-input input::placeholder {
    color: #6c757d;
    font-style: italic;
}

.chatbot-send {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    padding: 14px 24px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.chatbot-send:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.chatbot-send:active {
    transform: translateY(0);
}

.quick-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 15px;
            width: 100%;
            justify-content: flex-start;
}

.quick-action {
    background: #f0f0f0;
    border: none;
    padding: 6px 10px;
    border-radius: 12px;
    font-size: 10px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
}

.quick-action:hover {
    background: #e0e0e0;
    transform: translateY(-1px);
}

/* Expandable Message Styles */
.expandable-message {
    position: relative;
}

.message-preview {
    margin-bottom: 8px;
}

.message-full-content {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(0,0,0,0.1);
}

.expand-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 8px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.expand-button:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.expand-button:active {
    transform: translateY(0);
}

.typing-indicator {
    display: none;
    align-items: center;
    gap: 8px;
    padding: 12px 18px;
    background: transparent;
    border: none;
    border-radius: 20px;
    border-bottom-left-radius: 6px;
    max-width: 90px;
}

.typing-dot {
    width: 6px;
    height: 6px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    animation: typing 1.6s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
    animation-delay: 0s;
}

.typing-dot:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {
    0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
    }
    40% {
        transform: scale(1.2);
        opacity: 1;
    }
}

/* Enhanced Bot Response Styling */
.bot-response {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 1px solid #dee2e6;
    border-radius: 12px;
    padding: 0;
    margin: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.response-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 16px;
    border-radius: 12px 12px 0 0;
    margin: 0;
}

.response-header h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
}

.response-content {
    padding: 16px;
    color: #333;
    line-height: 1.6;
    font-size: 13px;
}

.response-content h5 {
    color: #2c3e50;
    margin: 12px 0 8px 0;
    font-size: 13px;
    font-weight: 600;
    border-bottom: 1px solid #e9ecef;
    padding-bottom: 4px;
}

.response-content ul {
    margin: 8px 0;
    padding-left: 20px;
}

.response-content li {
    margin: 4px 0;
    color: #495057;
}

.response-content strong {
    color: #2c3e50;
    font-weight: 600;
}

.response-content code {
    background: #f8f9fa;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: #e83e8c;
    border: 1px solid #e9ecef;
}

.response-content .highlight-box {
    background: #e3f2fd;
    border: 1px solid #bbdefb;
    border-radius: 8px;
    padding: 12px;
    margin: 10px 0;
}

.response-content .highlight-box h6 {
    color: #1976d2;
    margin: 0 0 8px 0;
    font-size: 12px;
    font-weight: 600;
}

.response-content .step-list {
    counter-reset: step-counter;
    list-style: none;
    padding-left: 0;
}

.response-content .step-list li {
    counter-increment: step-counter;
    margin: 8px 0;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 3px solid #667eea;
    position: relative;
}

.response-content .step-list li::before {
    content: counter(step-counter);
    position: absolute;
    left: -15px;
    top: 50%;
    transform: translateY(-50%);
    background: #667eea;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
}

.response-content .feature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin: 10px 0;
}

.response-content .feature-item {
    background: #f8f9fa;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    font-size: 12px;
    text-align: center;
}

.response-content .quick-tips {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    padding: 12px;
    margin: 10px 0;
}

.response-content .quick-tips h6 {
    color: #856404;
    margin: 0 0 8px 0;
    font-size: 12px;
    font-weight: 600;
}

@media (max-width: 768px) {
    .chatbot-window {
        width: 300px;
        height: 450px;
    }
    
    .chatbot-container {
        bottom: 20px;
        right: 20px;
    }
    
    .response-content .feature-grid {
        grid-template-columns: 1fr;
    }
}
</style>
`;

// Chatbot JavaScript functionality
class SKOLARISChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.toggle = document.getElementById('skolarisChatbotToggle');
        this.window = document.getElementById('skolarisChatbotWindow');
        this.messagesContainer = document.getElementById('skolarisChatbotMessages');
        this.input = document.getElementById('skolarisChatbotInput');
        this.sendButton = document.getElementById('skolarisChatbotSend');
        this.closeButton = document.getElementById('skolarisChatbotClose');
        this.typingIndicator = document.getElementById('skolarisTypingIndicator');
    }

    bindEvents() {
        this.toggle.addEventListener('click', () => this.toggleChatbot());
        this.closeButton.addEventListener('click', () => this.closeChatbot());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Add zoom event listeners
        const zoomOutBtn = document.getElementById('skolarisChatbotZoomOut');
        const zoomInBtn = document.getElementById('skolarisChatbotZoomIn');
        const resetBtn = document.getElementById('skolarisChatbotReset');
        this.scaleIndicator = document.getElementById('skolarisScaleIndicator');
        
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => this.zoomOut());
        }
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => this.zoomIn());
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetZoom());
        }

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.isOpen && (e.ctrlKey || e.metaKey)) {
                if (e.key === '+' || e.key === '=') {
                    e.preventDefault();
                    this.zoomIn();
                } else if (e.key === '-') {
                    e.preventDefault();
                    this.zoomOut();
                } else if (e.key === '0') {
                    e.preventDefault();
                    this.resetZoom();
                }
            }
        });
    }

    toggleChatbot() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.window.classList.add('active');
            this.input.focus();
            // Hide activity button when chat is open
            this.hideActivityButton();
        } else {
            this.window.classList.remove('active');
            // Show activity button when chat is closed
            this.showActivityButton();
        }
    }

    closeChatbot() {
        this.isOpen = false;
        this.window.classList.remove('active');
        // Show activity button when chat is closed
        this.showActivityButton();
    }

    hideActivityButton() {
        const activityButton = document.getElementById('sidebarToggle');
        if (activityButton) {
            activityButton.style.display = 'none';
        }
    }

    showActivityButton() {
        const activityButton = document.getElementById('sidebarToggle');
        if (activityButton) {
            activityButton.style.display = 'flex';
        }
    }

    zoomIn() {
        const currentScale = parseFloat(this.window.style.transform?.match(/scale\(([^)]+)\)/)?.[1] || '1');
        const newScale = Math.min(currentScale + 0.1, 2.0); // Max zoom 200%
        this.setScale(newScale);
    }

    zoomOut() {
        const currentScale = parseFloat(this.window.style.transform?.match(/scale\(([^)]+)\)/)?.[1] || '1');
        const newScale = Math.max(currentScale - 0.1, 0.5); // Min zoom 50%
        this.setScale(newScale);
    }

    resetZoom() {
        this.setScale(1.0);
    }

    setScale(scale) {
        this.window.style.transform = `scale(${scale})`;
        this.window.style.transformOrigin = 'bottom right';
        if (this.scaleIndicator) {
            this.scaleIndicator.textContent = Math.round(scale * 100) + '%';
        }
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.input.value = '';
        this.showTyping();

        // Simulate thinking time
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = this.getResponse(message);
        this.hideTyping();
        this.addMessage(response, 'bot');
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Debug: Log the content to see what we're getting
        console.log('Adding message content:', content);
        
        // Ensure content is treated as HTML
        // Check if content contains HTML tags
        if (content.includes('<div') || content.includes('<h5') || content.includes('<ul') || content.includes('<li')) {
        messageContent.innerHTML = content;
        } else {
            // If it's plain text, wrap it in a paragraph
            messageContent.innerHTML = `<p>${content}</p>`;
        }
        
        // Add expand/collapse functionality for long messages
        const messageText = messageContent.textContent || messageContent.innerText || '';
        const isLongMessage = messageText.length > 200 || content.includes('<h5') || content.includes('<ul');
        
        if (isLongMessage && sender === 'bot') {
            // Create expandable container
            const expandableContainer = document.createElement('div');
            expandableContainer.className = 'expandable-message';
            
            // Create preview (first 150 characters)
            const preview = document.createElement('div');
            preview.className = 'message-preview';
            const previewText = messageText.length > 150 ? messageText.substring(0, 150) + '...' : messageText;
            preview.innerHTML = content.includes('<div') ? content : `<p>${previewText}</p>`;
            
            // Create full content (hidden initially)
            const fullContent = document.createElement('div');
            fullContent.className = 'message-full-content';
            fullContent.style.display = 'none';
            fullContent.innerHTML = content;
            
            // Create expand/collapse button
            const expandButton = document.createElement('button');
            expandButton.className = 'expand-button';
            expandButton.innerHTML = '▼ Show More';
            expandButton.onclick = () => this.toggleMessage(expandButton, fullContent, preview);
            
            expandableContainer.appendChild(preview);
            expandableContainer.appendChild(expandButton);
            expandableContainer.appendChild(fullContent);
            
            messageContent.innerHTML = '';
            messageContent.appendChild(expandableContainer);
        }
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        const now = new Date();
        messageTime.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ' • ' + now.toLocaleDateString([], {month: 'short', day: 'numeric'});
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    toggleMessage(button, fullContent, preview) {
        const isExpanded = fullContent.style.display !== 'none';
        
        if (isExpanded) {
            fullContent.style.display = 'none';
            preview.style.display = 'block';
            button.innerHTML = '▼ Show More';
        } else {
            fullContent.style.display = 'block';
            preview.style.display = 'none';
            button.innerHTML = '▲ Show Less';
        }
    }

    showTyping() {
        this.typingIndicator.style.display = 'flex';
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    hideTyping() {
        this.typingIndicator.style.display = 'none';
    }

    initializeKnowledgeBase() {
        return {
            // SKOLARIS Documentation Knowledge
            'progress tracker': {
                title: '📊 Progress Tracker Guide',
                response: `<div class="bot-response">
                    <div class="response-header">
                        <h4>📊 Progress Tracker Guide</h4>
                </div>
                    <div class="response-content">
                        <p>The Progress Tracker is the <strong>MOST IMPORTANT</strong> section of SKOLARIS documentation! Here's how to use it:</p>

                        <h5>✨ Key Features:</h5>
                        <ul>
                            <li>Real-time project monitoring</li>
                            <li>Trello integration for task management</li>
                            <li>Team collaboration tools</li>
                            <li>Status tracking and reporting</li>
                        </ul>

                        <h5>🚀 How to Access:</h5>
                        <ol>
                    <li>Open <code>skolaris.html</code> in your browser</li>
                    <li>Enter password: <code>SKOLARIS2025!</code></li>
                    <li>Navigate to the Progress Tracker section</li>
                </ol>

                        <h5>🔗 Trello Integration:</h5>
                    <ul>
                        <li>Sync all Phase 1 tasks to Trello boards</li>
                            <li>Track task completion with checklists</li>
                        <li>Monitor team progress in real-time</li>
                        <li>Add comments and attachments</li>
                    </ul>

                        <h5>⚡ Quick Actions:</h5>
                        <ul>
                            <li>Click "Sync All Tasks" to create Trello cards</li>
                            <li>Use "Sync Priority Tasks" for specific categories</li>
                            <li>Check "Get Task Status" for current progress</li>
                            <li>View "Checklist Progress" for detailed completion rates</li>
                </ul>

                        <p><strong>This is your central hub for project management!</strong></p>
                    </div>
                </div>`,
                keywords: ['progress', 'tracker', 'monitoring', 'status', 'trello']
            },

            'trello': {
                title: '🔗 Trello Integration Help',
                response: `<div class="bot-response">
                    <div class="response-header">
                        <h4>🔗 Trello Integration Help</h4>
                    </div>
                    <div class="response-content">
                        <p>Trello integration is a core feature of SKOLARIS! Here's everything you need to know:</p>

                        <h5>🚀 Getting Started:</h5>
                        <ol>
                            <li><strong>Authentication</strong>: Connect your Trello account for commenting and attachments</li>
                            <li><strong>Board Creation</strong>: Automatically creates "SKOLARIS - Phase 1 Development" board</li>
                            <li><strong>Task Sync</strong>: Sync development tasks with detailed checklists</li>
                </ol>

                        <h5>✨ Main Features:</h5>
                        <ul>
                            <li><strong>Task Management</strong>: Create cards for each development task</li>
                            <li><strong>Status Tracking</strong>: Move cards between TO DO → ON-GOING → FOR TESTING → DONE</li>
                            <li><strong>Checklists</strong>: Detailed requirements and specifications for each task</li>
                            <li><strong>Comments</strong>: Add progress updates and team communication</li>
                            <li><strong>Attachments</strong>: Upload files and documents</li>
                        </ul>

                        <h5>📋 Board Structure:</h5>
                        <ul>
                            <li>📋 <strong>TO DO</strong> - New tasks</li>
                            <li>🔄 <strong>ON-GOING</strong> - Tasks in progress</li>
                            <li>🧪 <strong>FOR TESTING</strong> - Completed tasks ready for testing</li>
                            <li>✅ <strong>DONE</strong> - Fully completed tasks</li>
                        </ul>

                        <h5>🎯 Priority Categories:</h5>
                        <ul>
                            <li>🔥 <strong>Priority 1</strong>: System Foundation</li>
                            <li>🛠️ <strong>Priority 2</strong>: Maintenance Features</li>
                            <li>🎯 <strong>Priority 3</strong>: Student Core Processes</li>
                            <li>👨‍🏫 <strong>Priority 4</strong>: Faculty Core Processes</li>
                            <li>⚙️ <strong>Priority 5</strong>: Admin Core Processes</li>
                            <li>🔗 <strong>Priority 6</strong>: Integration & Testing</li>
                </ul>

                        <h5>⚡ How to Sync:</h5>
                        <ol>
                    <li>Go to Progress Tracker section</li>
                    <li>Click "Sync All Tasks" for complete sync</li>
                    <li>Or use "Sync Priority Tasks" for specific categories</li>
                    <li>Check "Get Task Status" to monitor progress</li>
                </ol>
                    </div>
                </div>`,
                keywords: ['trello', 'sync', 'board', 'cards', 'integration', 'tasks']
            },

            'documentation': {
                title: '📚 SKOLARIS Documentation Guide',
                response: `<div class="bot-response">
                    <div class="response-header">
                        <h4>📚 SKOLARIS Documentation Guide</h4>
                    </div>
                    <div class="response-content">
                        <p>SKOLARIS Documentation is organized into 12 main sections. Here's your complete guide:</p>

                        <h5>📋 Main Navigation (00)</h5>
                        <ul>
                            <li>Complete overview of all sections</li>
                            <li>Role-based recommendations</li>
                            <li>Quick access guide</li>
                        </ul>

                        <h5>📊 Project Overview (01)</h5>
                        <ul>
                            <li>System architecture and technology stack</li>
                            <li>Project objectives and scope</li>
                            <li>Technical specifications</li>
                        </ul>

                        <h5>🗄️ Database Structure (02)</h5>
                        <ul>
                            <li>Complete database schema (40+ tables)</li>
                            <li>SQL scripts and data models</li>
                            <li>Entity relationships and constraints</li>
                        </ul>

                        <h5>🛠️ Development Tasks (05)</h5>
                        <ul>
                            <li>Detailed development requirements</li>
                            <li>Frontend and backend specifications</li>
                            <li>Implementation guidelines</li>
                        </ul>

                        <h5>📊 Progress Tracker (06) - MOST IMPORTANT</h5>
                        <ul>
                            <li>Real-time project monitoring</li>
                            <li>Trello integration</li>
                            <li>Team collaboration tools</li>
                        </ul>

                        <h5>📅 Timeline Documentation (11)</h5>
                        <ul>
                            <li>3-Month implementation timeline</li>
                            <li>Weekly milestones and deadlines</li>
                            <li>Phase 1 and Phase 2 planning</li>
                        </ul>

                        <h5>🚀 Access Instructions:</h5>
                        <ol>
                            <li>Open <code>skolaris.html</code> in your browser</li>
                            <li>Enter password: <code>SKOLARIS2025!</code></li>
                            <li>Use the table of contents to navigate</li>
                        </ol>

                        <h5>👥 Role-Based Recommendations:</h5>
                        <ul>
                            <li><strong>Project Manager</strong>: Focus on Progress Tracker, Timeline, Task Management</li>
                            <li><strong>Developer</strong>: Use Development Tasks, Database Structure, Frontend guides</li>
                            <li><strong>Database Admin</strong>: Use Database Structure and Security guides</li>
                            <li><strong>Team Lead</strong>: Use all sections for comprehensive oversight</li>
                        </ul>
                    </div>
                </div>`,
                keywords: ['documentation', 'sections', 'guide', 'navigation', 'overview']
            },

            'development': {
                title: '🛠️ Development Tasks & Progress',
                response: `<div class="bot-response">
                    <div class="response-header">
                        <h4>🛠️ Development Tasks & Progress</h4>
                    </div>
                    <div class="response-content">
                        <p>Development in SKOLARIS is organized into comprehensive tasks with detailed tracking:</p>

                        <h5>💻 Development Categories:</h5>
                        <ul>
                            <li><strong>Frontend Development</strong>: React.js components, UI/UX implementation</li>
                            <li><strong>Backend Development</strong>: API development, database integration</li>
                            <li><strong>Mobile Development</strong>: Flutter cross-platform app</li>
                            <li><strong>Database Implementation</strong>: Schema creation and data management</li>
                        </ul>

                        <h5>📋 Task Management:</h5>
                        <ul>
                            <li>Each task has detailed requirements and specifications</li>
                            <li>Comprehensive checklists for progress tracking</li>
                            <li>Priority-based organization (Critical, High, Medium, Low)</li>
                            <li>Week-based scheduling and deadlines</li>
                        </ul>

                        <h5>📊 Progress Tracking:</h5>
                        <ul>
                            <li>Use Progress Tracker for real-time monitoring</li>
                            <li>Trello integration for team collaboration</li>
                            <li>Checklist completion rates</li>
                            <li>Status updates (TO DO → ON-GOING → FOR TESTING → DONE)</li>
                        </ul>

                        <h5>🎯 Key Development Areas:</h5>
                        <ol>
                            <li><strong>System Foundation</strong> (Priority 1)</li>
                            <li><strong>Maintenance Features</strong> (Priority 2)</li>
                            <li><strong>Student Core Processes</strong> (Priority 3)</li>
                            <li><strong>Faculty Core Processes</strong> (Priority 4)</li>
                            <li><strong>Admin Core Processes</strong> (Priority 5)</li>
                            <li><strong>Integration & Testing</strong> (Priority 6)</li>
                        </ol>

                        <h5>🚀 Getting Started:</h5>
                        <ol>
                            <li>Review Development Tasks Guide (05)</li>
                            <li>Check current progress in Progress Tracker (06)</li>
                            <li>Sync tasks to Trello for team collaboration</li>
                            <li>Use Timeline Guide (11) for scheduling</li>
                        </ol>
                    </div>
                </div>`,
                keywords: ['development', 'tasks', 'progress', 'frontend', 'backend', 'mobile']
            },

            'timeline': {
                title: '📅 Timeline & Milestones',
                response: `<div class="bot-response">
                    <div class="response-header">
                        <h4>📅 Timeline & Milestones</h4>
                    </div>
                    <div class="response-content">
                        <p>SKOLARIS follows a structured 3-Month implementation timeline:</p>

                        <h5>🚀 Phase 1 (3-Month Core Implementation)</h5>
                        <ul>
                            <li><strong>October 2025</strong>: System Foundation & Priority 1 tasks</li>
                            <li><strong>November 2025</strong>: Core Processes & Priority 2-4 tasks</li>
                            <li><strong>December 2025</strong>: Integration & Testing, Priority 5-6 tasks</li>
                            <li><strong>January 2026</strong>: Pilot Launch</li>
                        </ul>

                        <h5>📅 Weekly Milestones:</h5>
                        <ul>
                            <li>Each week has specific deliverables and goals</li>
                            <li>Priority-based task distribution</li>
                            <li>Regular progress reviews and updates</li>
                            <li>Team coordination and collaboration</li>
                        </ul>

                        <h5>🎯 Key Milestones:</h5>
                        <ul>
                            <li><strong>Week 1-4</strong>: System Foundation (Database, Authentication, Core APIs)</li>
                            <li><strong>Week 5-8</strong>: Student & Faculty Core Processes</li>
                            <li><strong>Week 9-12</strong>: Admin Processes & Integration</li>
                            <li><strong>Week 13</strong>: Pilot Launch Preparation</li>
                        </ul>

                        <h5>✨ Timeline Features:</h5>
                        <ul>
                            <li>Detailed weekly breakdown</li>
                            <li>Priority task scheduling</li>
                            <li>Resource allocation planning</li>
                            <li>Risk management and contingency planning</li>
                        </ul>

                        <h5>🔍 Access Timeline:</h5>
                        <ol>
                            <li>Open Timeline Guide (11) for detailed schedule</li>
                            <li>Use Progress Tracker (06) for current status</li>
                            <li>Check Development Tasks (05) for specific requirements</li>
                            <li>Monitor progress through Trello integration</li>
                        </ol>
                    </div>
                </div>`,
                keywords: ['timeline', 'milestones', 'schedule', 'deadlines', 'phases']
            },

            'database': {
                title: '🗄️ Database Structure & Management',
                response: `<div class="bot-response">
                    <div class="response-header">
                        <h4>🗄️ Database Structure & Management</h4>
                    </div>
                    <div class="response-content">
                        <p>SKOLARIS uses a comprehensive database structure with 40+ tables:</p>

                        <h5>💾 Core Database Features:</h5>
                        <ul>
                            <li><strong>User Management</strong>: Students, Faculty, Admin roles</li>
                            <li><strong>Academic System</strong>: Courses, Enrollments, Grades, Schedules</li>
                            <li><strong>Communication</strong>: Messages, Notifications, Announcements</li>
                            <li><strong>File Management</strong>: Documents, Submissions, Resources</li>
                            <li><strong>System Administration</strong>: Logs, Settings, Permissions</li>
                        </ul>

                        <h5>🗃️ Key Tables:</h5>
                        <ul>
                            <li><strong>users</strong>: User accounts and authentication</li>
                            <li><strong>students</strong>: Student-specific information</li>
                            <li><strong>faculty</strong>: Faculty profiles and assignments</li>
                            <li><strong>courses</strong>: Course catalog and details</li>
                            <li><strong>enrollments</strong>: Student course registrations</li>
                            <li><strong>grades</strong>: Grade management and tracking</li>
                            <li><strong>schedules</strong>: Class schedules and timetables</li>
                        </ul>

                        <h5>⚙️ Database Management:</h5>
                        <ul>
                            <li>Complete SQL scripts provided</li>
                            <li>Migration tools and procedures</li>
                            <li>Data validation and constraints</li>
                            <li>Backup and recovery procedures</li>
                        </ul>

                        <h5>🔍 Access Database Info:</h5>
                        <ol>
                            <li>Open Database Structure Guide (02)</li>
                            <li>Review complete schema documentation</li>
                            <li>Use provided SQL scripts for setup</li>
                            <li>Check Development Tasks (05) for implementation details</li>
                        </ol>

                        <h5>🚀 Implementation:</h5>
                        <ul>
                            <li>Follow the step-by-step setup guide</li>
                            <li>Use provided migration scripts</li>
                            <li>Test with sample data</li>
                            <li>Implement security measures</li>
                        </ul>
                    </div>
                </div>`,
                keywords: ['database', 'schema', 'tables', 'sql', 'structure', 'management']
                    },

                    // NEW COMPREHENSIVE CATEGORIES
                    'authentication': {
                        title: '🔐 Authentication & Security',
                        response: `<div class="bot-response">
                            <div class="response-header">
                                <h4>🔐 Authentication & Security</h4>
                            </div>
                            <div class="response-content">
                                <p>SKOLARIS implements comprehensive authentication and security measures:</p>

                                <h5>🔑 User Authentication:</h5>
                                <ul>
                                    <li><strong>Multi-factor Authentication (MFA)</strong>: SMS, Email, Authenticator apps</li>
                                    <li><strong>Role-based Access Control (RBAC)</strong>: Students, Faculty, Admin, Super Admin</li>
                                    <li><strong>Password Policies</strong>: Strong password requirements and expiration</li>
                                    <li><strong>Session Management</strong>: Secure session handling and timeout</li>
                                </ul>

                                <h5>🛡️ Security Features:</h5>
                                <ul>
                                    <li><strong>Data Encryption</strong>: AES-256 encryption for sensitive data</li>
                                    <li><strong>HTTPS/SSL</strong>: Secure communication protocols</li>
                                    <li><strong>SQL Injection Protection</strong>: Parameterized queries and input validation</li>
                                    <li><strong>XSS Protection</strong>: Cross-site scripting prevention</li>
                                    <li><strong>CSRF Protection</strong>: Cross-site request forgery prevention</li>
                                </ul>

                                <h5>👥 User Roles & Permissions:</h5>
                                <ul>
                                    <li><strong>Students</strong>: View grades, submit assignments, access course materials</li>
                                    <li><strong>Faculty</strong>: Grade management, course creation, student monitoring</li>
                                    <li><strong>Admin</strong>: System configuration, user management, reports</li>
                                    <li><strong>Super Admin</strong>: Full system access, security settings</li>
                                </ul>

                                <h5>🔒 Security Best Practices:</h5>
                                <ul>
                                    <li>Regular security audits and penetration testing</li>
                                    <li>Automated vulnerability scanning</li>
                                    <li>Security logging and monitoring</li>
                                    <li>Regular security training for users</li>
                                </ul>
                            </div>
                        </div>`,
                        keywords: ['authentication', 'security', 'login', 'password', 'roles', 'permissions', 'encryption']
                    },

                    'api': {
                        title: '🔌 API Documentation',
                        response: `<div class="bot-response">
                            <div class="response-header">
                                <h4>🔌 API Documentation</h4>
                            </div>
                            <div class="response-content">
                                <p>SKOLARIS provides comprehensive RESTful API endpoints for all system functions:</p>

                                <h5>🌐 Base API Information:</h5>
                                <ul>
                                    <li><strong>Base URL</strong>: <code>https://api.skolaris.edu</code></li>
                                    <li><strong>Version</strong>: v1.0</li>
                                    <li><strong>Authentication</strong>: Bearer Token (JWT)</li>
                                    <li><strong>Content-Type</strong>: application/json</li>
                                </ul>

                                <h5>📚 Core API Endpoints:</h5>
                                <ul>
                                    <li><strong>Authentication</strong>: <code>POST /auth/login</code>, <code>POST /auth/register</code></li>
                                    <li><strong>Users</strong>: <code>GET /users</code>, <code>PUT /users/{id}</code></li>
                                    <li><strong>Courses</strong>: <code>GET /courses</code>, <code>POST /courses</code></li>
                                    <li><strong>Grades</strong>: <code>GET /grades</code>, <code>POST /grades</code></li>
                                    <li><strong>Assignments</strong>: <code>GET /assignments</code>, <code>POST /assignments</code></li>
                                </ul>

                                <h5>📊 Response Formats:</h5>
                                <ul>
                                    <li><strong>Success</strong>: <code>{ "status": "success", "data": {...} }</code></li>
                                    <li><strong>Error</strong>: <code>{ "status": "error", "message": "Error description" }</code></li>
                                    <li><strong>Pagination</strong>: <code>{ "data": [...], "pagination": {...} }</code></li>
                                </ul>

                                <h5>🔧 API Testing:</h5>
                                <ul>
                                    <li>Postman collection available</li>
                                    <li>Swagger/OpenAPI documentation</li>
                                    <li>Rate limiting: 1000 requests/hour per user</li>
                                    <li>API versioning and backward compatibility</li>
                                </ul>
                            </div>
                        </div>`,
                        keywords: ['api', 'endpoints', 'rest', 'json', 'authentication', 'swagger', 'postman']
                    },

                    'mobile': {
                        title: '📱 Mobile App Development (Phase 2)',
                        response: `<div class="bot-response">
                            <div class="response-header">
                                <h4>📱 Mobile App Development (Phase 2)</h4>
                            </div>
                            <div class="response-content">
                                <p><strong>⚠️ Note: Mobile app development is planned for Phase 2 (February-April 2026)</strong></p>
                                
                                <p>SKOLARIS mobile app will be built with Flutter for cross-platform compatibility:</p>

                                <h5>📅 Phase 2 Timeline:</h5>
                                <ul>
                                    <li><strong>February 2026</strong>: Mobile app foundation and basic features</li>
                                    <li><strong>March 2026</strong>: Core mobile functionality and testing</li>
                                    <li><strong>April 2026</strong>: App store preparation and full deployment</li>
                                </ul>

                                <h5>📱 Planned Platform Support:</h5>
                                <ul>
                                    <li><strong>iOS</strong>: iOS 12.0+ (iPhone, iPad)</li>
                                    <li><strong>Android</strong>: Android 8.0+ (API level 26+)</li>
                                    <li><strong>Web</strong>: Progressive Web App (PWA) support</li>
                                </ul>

                                <h5>🎨 Planned Features:</h5>
                                <ul>
                                    <li><strong>Offline Support</strong>: Core features work without internet</li>
                                    <li><strong>Push Notifications</strong>: Real-time updates and alerts</li>
                                    <li><strong>Biometric Login</strong>: Fingerprint and face recognition</li>
                                    <li><strong>Dark Mode</strong>: Automatic and manual theme switching</li>
                                    <li><strong>Accessibility</strong>: Screen reader and voice control support</li>
                                </ul>

                                <h5>🛠️ Development Stack (Planned):</h5>
                                <ul>
                                    <li><strong>Framework</strong>: Flutter 3.0+</li>
                                    <li><strong>Language</strong>: Dart 3.0+</li>
                                    <li><strong>State Management</strong>: Provider/Riverpod</li>
                                    <li><strong>Local Storage</strong>: SQLite with Hive</li>
                                    <li><strong>HTTP Client</strong>: Dio for API communication</li>
                                </ul>

                                <p><strong>Current Phase 1 Focus:</strong> Web application development and core system features</p>
                            </div>
                        </div>`,
                        keywords: ['mobile', 'app', 'flutter', 'ios', 'android', 'pwa', 'phase2', 'future']
                    },

                    'deployment': {
                        title: '🚀 Deployment & DevOps',
                        response: `<div class="bot-response">
                            <div class="response-header">
                                <h4>🚀 Deployment & DevOps</h4>
                            </div>
                            <div class="response-content">
                                <p>SKOLARIS deployment strategy and DevOps practices:</p>

                                <h5>☁️ Infrastructure:</h5>
                                <ul>
                                    <li><strong>Cloud Provider</strong>: AWS (Amazon Web Services)</li>
                                    <li><strong>Containerization</strong>: Docker containers</li>
                                    <li><strong>Orchestration</strong>: Kubernetes (EKS)</li>
                                    <li><strong>Load Balancing</strong>: Application Load Balancer (ALB)</li>
                                    <li><strong>CDN</strong>: CloudFront for static assets</li>
                                </ul>

                                <h5>🔄 CI/CD Pipeline:</h5>
                                <ul>
                                    <li><strong>Version Control</strong>: Git (GitHub/GitLab)</li>
                                    <li><strong>CI/CD</strong>: GitHub Actions / GitLab CI</li>
                                    <li><strong>Testing</strong>: Automated unit, integration, and E2E tests</li>
                                    <li><strong>Code Quality</strong>: SonarQube analysis</li>
                                    <li><strong>Security Scanning</strong>: Snyk vulnerability scanning</li>
                                </ul>

                                <h5>🗄️ Database & Storage:</h5>
                                <ul>
                                    <li><strong>Primary Database</strong>: PostgreSQL (RDS)</li>
                                    <li><strong>Cache</strong>: Redis for session management</li>
                                    <li><strong>File Storage</strong>: S3 for documents and media</li>
                                    <li><strong>Backup</strong>: Automated daily backups with 30-day retention</li>
                                </ul>

                                <h5>📊 Monitoring & Logging:</h5>
                                <ul>
                                    <li><strong>Application Monitoring</strong>: New Relic / DataDog</li>
                                    <li><strong>Log Management</strong>: ELK Stack (Elasticsearch, Logstash, Kibana)</li>
                                    <li><strong>Uptime Monitoring</strong>: Pingdom / UptimeRobot</li>
                                    <li><strong>Error Tracking</strong>: Sentry for real-time error monitoring</li>
                                </ul>
                            </div>
                        </div>`,
                        keywords: ['deployment', 'devops', 'aws', 'docker', 'kubernetes', 'ci-cd', 'monitoring']
                    },

                    'testing': {
                        title: '🧪 Testing & Quality Assurance',
                        response: `<div class="bot-response">
                            <div class="response-header">
                                <h4>🧪 Testing & Quality Assurance</h4>
                            </div>
                            <div class="response-content">
                                <p>Comprehensive testing strategy for SKOLARIS quality assurance:</p>

                                <h5>🔬 Testing Types:</h5>
                                <ul>
                                    <li><strong>Unit Testing</strong>: Jest (Frontend), JUnit (Backend)</li>
                                    <li><strong>Integration Testing</strong>: API endpoint testing</li>
                                    <li><strong>End-to-End Testing</strong>: Cypress for user workflows</li>
                                    <li><strong>Performance Testing</strong>: Load testing with JMeter</li>
                                    <li><strong>Security Testing</strong>: OWASP ZAP vulnerability scanning</li>
                                </ul>

                                <h5>📊 Test Coverage:</h5>
                                <ul>
                                    <li><strong>Code Coverage</strong>: Minimum 80% coverage required</li>
                                    <li><strong>Branch Coverage</strong>: All code paths tested</li>
                                    <li><strong>API Coverage</strong>: All endpoints tested</li>
                                    <li><strong>UI Coverage</strong>: All user interactions tested</li>
                                </ul>

                                <h5>🔄 Testing Process:</h5>
                                <ul>
                                    <li><strong>Development</strong>: TDD (Test-Driven Development)</li>
                                    <li><strong>Pre-commit</strong>: Automated test execution</li>
                                    <li><strong>Pull Request</strong>: Full test suite validation</li>
                                    <li><strong>Staging</strong>: User acceptance testing (UAT)</li>
                                    <li><strong>Production</strong>: Smoke testing after deployment</li>
                                </ul>

                                <h5>🛠️ Testing Tools:</h5>
                                <ul>
                                    <li><strong>Frontend</strong>: Jest, React Testing Library, Cypress</li>
                                    <li><strong>Backend</strong>: JUnit, Mockito, TestContainers</li>
                                    <li><strong>API</strong>: Postman, Newman, RestAssured</li>
                                    <li><strong>Performance</strong>: JMeter, K6, Artillery</li>
                                    <li><strong>Security</strong>: OWASP ZAP, Snyk, SonarQube</li>
                                </ul>
                            </div>
                        </div>`,
                        keywords: ['testing', 'qa', 'quality', 'coverage', 'automation', 'cypress', 'jest']
                    },

                    'troubleshooting': {
                        title: '🔧 Troubleshooting & Support',
                        response: `<div class="bot-response">
                            <div class="response-header">
                                <h4>🔧 Troubleshooting & Support</h4>
                            </div>
                            <div class="response-content">
                                <p>Common issues and solutions for SKOLARIS system:</p>

                                <h5>❌ Common Issues:</h5>
                                <ul>
                                    <li><strong>Login Problems</strong>: Clear browser cache, check credentials</li>
                                    <li><strong>Slow Performance</strong>: Check internet connection, clear cache</li>
                                    <li><strong>File Upload Issues</strong>: Check file size and format restrictions</li>
                                    <li><strong>Mobile App Crashes</strong>: Update to latest version, restart app</li>
                                    <li><strong>API Errors</strong>: Check authentication token, verify endpoint</li>
                                </ul>

                                <h5>🛠️ Quick Fixes:</h5>
                                <ul>
                                    <li><strong>Browser Issues</strong>: Try different browser, disable extensions</li>
                                    <li><strong>Cache Problems</strong>: Hard refresh (Ctrl+F5), clear browser data</li>
                                    <li><strong>Network Issues</strong>: Check firewall settings, try different network</li>
                                    <li><strong>Database Errors</strong>: Check connection string, verify permissions</li>
                                </ul>

                                <h5>📞 Support Channels:</h5>
                                <ul>
                                    <li><strong>Email Support</strong>: support@skolaris.edu</li>
                                    <li><strong>Phone Support</strong>: +1-800-SKOLARIS (Mon-Fri, 9AM-5PM)</li>
                                    <li><strong>Live Chat</strong>: Available on website during business hours</li>
                                    <li><strong>Documentation</strong>: Comprehensive help center</li>
                                    <li><strong>Community Forum</strong>: User community support</li>
                                </ul>

                                <h5>📋 System Requirements:</h5>
                                <ul>
                                    <li><strong>Browser</strong>: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</li>
                                    <li><strong>Mobile</strong>: iOS 12+, Android 8.0+</li>
                                    <li><strong>Internet</strong>: Minimum 5 Mbps for optimal performance</li>
                                    <li><strong>Screen Resolution</strong>: Minimum 1024x768 for desktop</li>
                                </ul>
                            </div>
                        </div>`,
                        keywords: ['troubleshooting', 'support', 'help', 'issues', 'problems', 'fixes', 'errors']
                    },

                    'features': {
                        title: '✨ SKOLARIS Phase 1 Features',
                        response: `<div class="bot-response">
                            <div class="response-header">
                                <h4>✨ SKOLARIS Phase 1 Features</h4>
                            </div>
                            <div class="response-content">
                                <p><strong>Phase 1 Implementation (October-December 2025)</strong> - Core system features:</p>

                                <h5>🏗️ System Foundation (Priority 1):</h5>
                                <ul>
                                    <li><strong>Database Schema</strong>: 49 tables with complete data model including academic hierarchy</li>
                                    <li><strong>Multi-Campus Setup</strong>: Support for 8 ICCT campuses</li>
                                    <li><strong>JWT Authentication</strong>: Secure user authentication system</li>
                                    <li><strong>Role-Based Access Control</strong>: Students, Faculty, Admin roles</li>
                                    <li><strong>Basic API Structure</strong>: RESTful API endpoints</li>
                                </ul>

                                <h5>🔧 Maintenance Features (Priority 2):</h5>
                                <ul>
                                    <li><strong>Subject Management</strong>: Course catalog and subject administration</li>
                                    <li><strong>User Management</strong>: User account creation and management</li>
                                    <li><strong>Schedule Management</strong>: Class scheduling and timetables</li>
                                    <li><strong>Clinic Management</strong>: Medical records and health tracking</li>
                                    <li><strong>Bulk Import</strong>: Data import and migration tools</li>
                                    <li><strong>College Management ⭐ NEW</strong>: Organizational units administration</li>
                                    <li><strong>Academic Terms ⭐ NEW</strong>: Semester/trimester management</li>
                                    <li><strong>Default Curriculum ⭐ NEW</strong>: Template curriculum builder</li>
                                    <li><strong>Course Offerings ⭐ NEW</strong>: Programs→Terms→Subjects connection</li>
                                </ul>

                                <h5>👨‍🎓 Student Core Processes (Priority 3):</h5>
                                <ul>
                                    <li><strong>Student Registration</strong>: Account creation and profile setup</li>
                                    <li><strong>Course Enrollment</strong>: Course selection and enrollment system</li>
                                    <li><strong>Payment Processing</strong>: Fee payment and tracking</li>
                                    <li><strong>Medical Records</strong>: Health information management</li>
                                    <li><strong>Student Dashboard</strong>: Personal academic overview</li>
                                </ul>

                                <h5>👨‍🏫 Faculty Core Processes (Priority 4):</h5>
                                <ul>
                                    <li><strong>Class Management</strong>: View assigned classes and students</li>
                                    <li><strong>Grade Entry System</strong>: Enter and manage student grades</li>
                                    <li><strong>Student Records Access</strong>: View student academic information</li>
                                    <li><strong>Academic Reporting</strong>: Generate teaching reports</li>
                                    <li><strong>Faculty Dashboard</strong>: Teaching overview and tools</li>
                                </ul>

                                <h5>⚙️ Admin Core Processes (Priority 5):</h5>
                                <ul>
                                    <li><strong>User Management</strong>: Complete user lifecycle management</li>
                                    <li><strong>Payment Management</strong>: Fee collection and tracking</li>
                                    <li><strong>System Administration</strong>: System configuration and settings</li>
                                    <li><strong>Comprehensive Reporting</strong>: Administrative reports and analytics</li>
                                    <li><strong>Admin Dashboard</strong>: System overview and management tools</li>
                                </ul>

                                <h5>🔗 Integration & Testing (Priority 6):</h5>
                                <ul>
                                    <li><strong>Trello Integration</strong>: Project management and task tracking</li>
                                    <li><strong>Process Integration</strong>: System workflow integration</li>
                                    <li><strong>System Testing</strong>: Comprehensive testing and QA</li>
                                    <li><strong>Security Audit</strong>: Security testing and validation</li>
                                    <li><strong>Performance Optimization</strong>: System performance tuning</li>
                                </ul>

                                <p><strong>⚠️ Note:</strong> Mobile app development and advanced features are planned for Phase 2 (February-April 2026)</p>
                            </div>
                        </div>`,
                        keywords: ['features', 'phase1', 'students', 'faculty', 'admin', 'core', 'processes']
            }
        };
    }

    getResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for exact matches first
        for (const [key, data] of Object.entries(this.knowledgeBase)) {
            if (lowerMessage.includes(key)) {
                return this.formatResponse(data);
            }
        }

        // Check for keyword matches
        for (const [key, data] of Object.entries(this.knowledgeBase)) {
            for (const keyword of data.keywords) {
                if (lowerMessage.includes(keyword)) {
                    return this.formatResponse(data);
                }
            }
        }

        // Default responses for common questions
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return `<div class="bot-response">
                <div class="response-header">
                    <h4>👋 Hello! I'm your SKOLARIS Assistant!</h4>
                </div>
                <div class="response-content">
                    <p>I'm here to help you with SKOLARIS documentation and Trello integration. What would you like to know?</p>
                    <div class="quick-tips">
                        <h6>💡 Quick Start</h6>
                        <p>Try asking about "Progress Tracker", "Trello", or "Documentation" to get started!</p>
                    </div>
                </div>
            </div>`;
        }

        if (lowerMessage.includes('help')) {
            return `<div class="bot-response">
                <div class="response-header">
                    <h4>🆘 How Can I Help You?</h4>
                </div>
                <div class="response-content">
                    <h5>📚 I can help you with:</h5>
                    <div class="feature-grid">
                        <div class="feature-item">📊 Progress Tracker</div>
                        <div class="feature-item">🔗 Trello Integration</div>
                        <div class="feature-item">📚 Documentation</div>
                        <div class="feature-item">🛠️ Development Tasks</div>
                        <div class="feature-item">📅 Timeline</div>
                        <div class="feature-item">🗄️ Database</div>
                    </div>
                    <p>Just ask me about any of these topics!</p>
                </div>
            </div>`;
        }

        if (lowerMessage.includes('password')) {
            return `<div class="bot-response">
                <div class="response-header">
                    <h4>🔐 Access Information</h4>
                </div>
                <div class="response-content">
                    <div class="highlight-box">
                        <h6>🔑 SKOLARIS Documentation Password</h6>
                        <p><code>SKOLARIS2025!</code></p>
                    </div>
                    
                    <h5>🚀 How to Access:</h5>
                    <ol class="step-list">
                        <li>Open <code>skolaris.html</code> in your browser</li>
                        <li>Enter the password when prompted</li>
                        <li>Navigate through the different sections</li>
                    </ol>
                    
                    <p>The main sections are accessible through the table of contents.</p>
                </div>
            </div>`;
        }

        if (lowerMessage.includes('sync') || lowerMessage.includes('trello sync')) {
            return `<div class="bot-response">
                <div class="response-header">
                    <h4>🔄 Trello Sync Guide</h4>
                </div>
                <div class="response-content">
                    <h5>⚡ How to Sync Tasks to Trello:</h5>
                    <ol class="step-list">
                        <li><strong>Open Progress Tracker</strong> (Section 06)</li>
                        <li><strong>Click "Sync All Tasks"</strong> for complete sync</li>
                        <li><strong>Or use "Sync Priority Tasks"</strong> for specific categories</li>
                        <li><strong>Check "Get Task Status"</strong> to monitor progress</li>
                    </ol>

                    <h5>📋 Trello Board Structure:</h5>
                    <div class="highlight-box">
                        <h6>Task Status Flow</h6>
                        <p>📋 TO DO → 🔄 ON-GOING → 🧪 FOR TESTING → ✅ DONE</p>
                    </div>

                    <div class="quick-tips">
                        <h6>🔐 Authentication Required</h6>
                        <p>Connect your Trello account for commenting, attachments, and team collaboration!</p>
                    </div>
                </div>
            </div>`;
        }

        // Fallback response
        return `<div class="bot-response">
            <div class="response-header">
                <h4>🤔 Let me help you find the right information!</h4>
            </div>
            <div class="response-content">
                <p>I understand you're asking about <strong>"${message}"</strong>. Here are some topics I can help you with:</p>
                
                <h5>📚 Quick Help Options:</h5>
                <div class="feature-grid">
                    <div class="feature-item">📊 Progress Tracker</div>
                    <div class="feature-item">🔗 Trello</div>
                    <div class="feature-item">📚 Documentation</div>
                    <div class="feature-item">🛠️ Development</div>
                    <div class="feature-item">📅 Timeline</div>
                    <div class="feature-item">🗄️ Database</div>
                </div>
                
                <div class="quick-tips">
                    <h6>💡 Need More Help?</h6>
                    <p>Try asking more specifically about what you need help with, or use the quick action buttons above!</p>
                </div>
            </div>
        </div>`;
    }

    formatResponse(data) {
        return data.response;
    }
}

// Global function for quick actions
function askSkolarisQuestion(question) {
    document.getElementById('skolarisChatbotInput').value = question;
    window.skolarisChatbot.sendMessage();
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add chatbot styles to head
    document.head.insertAdjacentHTML('beforeend', chatbotCSS);
    
    // Add chatbot HTML to body
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    
    // Initialize chatbot
    window.skolarisChatbot = new SKOLARISChatbot();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SKOLARISChatbot, askSkolarisQuestion };
}
