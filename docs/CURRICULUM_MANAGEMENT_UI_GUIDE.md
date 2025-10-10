# Curriculum Management UI - Complete Guide

## 📚 Overview

The **Curriculum Management System** is a comprehensive web-based interface for managing Default Curriculum and Course Offerings in the SKOLARIS Student Information System. This guide explains all features, functionality, and how to use the system.

---

## 🎯 Purpose

This UI serves three main purposes:

1. **Default Curriculum Management** - Define curriculum templates for programs
2. **Program Roadmap View** - Visualize complete academic journey per program
3. **Course Offerings Management** - Manage actual course offerings per term

---

## 📋 Tab 1: Default Curriculum

### What is Default Curriculum?

**Default Curriculum** is a **TEMPLATE** that defines:

- Which subjects students **SHOULD** take
- The recommended sequence (Year Level + Term)
- Prerequisites for each subject
- Unit requirements

**Think of it as:** The official program checklist or study plan

### Key Features

#### ✅ View Curriculum Records

- Displays all curriculum records in a sortable table
- Shows: ID, Program, Year/Term, Subject, Units, Prerequisites, Status
- Real-time search functionality
- Filters by text across all columns

#### ✅ Add New Curriculum

Click **"➕ Add Curriculum"** button to open the form:

**Required Fields:**

- **Program** - Select from BSCS, BSIT, BSIS, ACT
- **Year Level** - Select 1-4
- **Term** - Select 1st Semester, 2nd Semester, or Summer
- **Subject Code** - e.g., CS101
- **Subject Name** - e.g., Introduction to Computing
- **Units** - Number of units (1-6)
- **Status** - Active or Inactive

**Optional Fields:**

- **Prerequisites** - Comma-separated subject codes (e.g., CS101, MATH101)
- **Description** - Additional subject details

#### ✅ Edit Curriculum

- Click **"✏️ Edit"** button on any row
- Form pre-fills with existing data
- Make changes and save

#### ✅ Delete Curriculum

- Click **"🗑️ Delete"** button
- Confirms before deletion
- Permanently removes the record

#### 📊 Statistics Dashboard

Shows real-time counts:

- Total Curriculum Records
- Number of Programs
- Total Unique Subjects

---

## 🗺️ Tab 2: Program Roadmap (NEW!)

### What is Program Roadmap?

**Program Roadmap** is a **VISUAL JOURNEY MAP** that shows:

- Complete curriculum from Year 1 to Year 4
- All terms within each year
- All subjects per term
- Prerequisites clearly marked
- Total units per term and year

**Think of it as:** A student's complete academic GPS from enrollment to graduation

### How It Works

#### 1. **Program Selection**

- Dropdown at the top lets you select which program to view
- Choose from: BSCS, BSIT, BSIS, ACT
- View automatically updates when you change programs

#### 2. **Hierarchical Display**

```
📚 PROGRAM
  └─ 📚 Year 1
      ├─ 📖 1st Semester
      │   ├─ Subject 1 (3 units) - No prerequisite
      │   ├─ Subject 2 (3 units) - No prerequisite
      │   └─ Subject 3 (3 units) - No prerequisite
      ├─ 📖 2nd Semester
      │   ├─ Subject 4 (3 units) - Prereq: Subject 1
      │   └─ Subject 5 (3 units) - Prereq: Subject 2
  └─ 📚 Year 2
      ├─ 📖 1st Semester
      └─ 📖 2nd Semester
  ... and so on until Year 4
```

#### 3. **Color-Coded Layout**

- **Purple Gradient Headers** - Year level headers
- **Light Gray Headers** - Term headers
- **White Background** - Individual subjects
- **Hover Effect** - Subjects highlight on hover

#### 4. **Information Displayed Per Subject**

Each subject row shows:

- **Subject Code** (e.g., CS101) - Bold purple text
- **Units** (e.g., 3 Units) - Gray text
- **Subject Name** (e.g., Introduction to Computing) - Black text
- **Prerequisites** (e.g., Prereq: CS101) - Italic gray text

#### 5. **Summary Statistics**

**Year Level Summary:**

- Total subjects in the year
- Total units in the year

**Term Summary:**

- Number of subjects in the term
- Total units in the term

#### 6. **Print Functionality**

- Click **"🖨️ Print Roadmap"** button
- Opens print dialog
- Formatted for clean printing
- Removes buttons and navigation for print

### Example: BSCS Program Roadmap

#### Year 1 - 1st Semester (6 subjects, 17 units)

1. CS101 - Introduction to Computing (3 units)
2. MATH101 - Calculus I (3 units)
3. ENG101 - English I (3 units)
4. FIL101 - Filipino I (3 units)
5. PE101 - Physical Education 1 (2 units)
6. NSTP101 - NSTP 1 (3 units)

#### Year 1 - 2nd Semester (6 subjects, 17 units)

1. CS102 - Programming Fundamentals (3 units) - **Prereq: CS101**
2. MATH102 - Calculus II (3 units) - **Prereq: MATH101**
3. ENG102 - English II (3 units) - **Prereq: ENG101**
   ... continues through Year 4

### Benefits of Program Roadmap

✅ **For Students:**

- See entire academic journey at a glance
- Understand subject prerequisites
- Plan ahead for enrollment
- Track progress through the program

✅ **For Academic Advisors:**

- Visual tool for student counseling
- Easy reference for program requirements
- Print for student handouts

✅ **For Program Heads:**

- Review curriculum structure
- Ensure logical subject sequencing
- Identify prerequisite chains

---

## 📖 Tab 3: Course Offerings

### What are Course Offerings?

**Course Offerings** are **ACTUAL CLASSES** being offered in a specific term:

- Real faculty assignments
- Specific schedules and rooms
- Enrollment capacity and availability
- Current enrollment count

**Think of it as:** The actual class schedule for the semester

### Key Differences from Default Curriculum

| Aspect         | Default Curriculum      | Course Offerings                        |
| -------------- | ----------------------- | --------------------------------------- |
| **Purpose**    | Template/Guideline      | Actual Implementation                   |
| **Scope**      | All students in program | Specific term (e.g., 2025-2026 1st Sem) |
| **Faculty**    | Not specified           | Specific faculty assigned               |
| **Schedule**   | Not specified           | Specific days/times/rooms               |
| **Capacity**   | Not specified           | Has enrollment slots                    |
| **Enrollment** | N/A                     | Tracks current enrollment               |

### Key Features

#### ✅ View Course Offerings

- Displays all offerings in a sortable table
- Shows: Program, Term, Subject, Faculty, Schedule, Room, Enrolled/Capacity, Status
- Real-time search functionality

#### ✅ Add New Course Offering

Click **"➕ Add Course Offering"** button:

**Required Fields:**

- **Program** - BSCS, BSIT, BSIS, ACT
- **Academic Term** - e.g., 2025-2026 1st Semester
- **Subject Code** - e.g., CS101
- **Subject Name** - e.g., Introduction to Computing
- **Faculty Assigned** - Select from faculty list
- **Schedule** - e.g., MWF 8:00-9:00 AM
- **Room** - e.g., Room 301
- **Capacity** - Maximum students (e.g., 40)
- **Currently Enrolled** - Current count (default: 0)
- **Status** - Available, Full, or Closed

#### ✅ Edit Course Offering

- Click **"✏️ Edit"** button
- Update faculty, schedule, capacity, etc.
- Save changes

#### ✅ Delete Course Offering

- Click **"🗑️ Delete"** button
- Confirms before deletion

#### 📊 Statistics Dashboard

- Total Offerings
- Faculty Assigned
- Total Slots Available
- Total Enrolled Students

#### 🎨 Status Badges

- **🟢 Available** - Green badge, has open slots
- **🔴 Full** - Red badge, no slots available
- **⚫ Closed** - Gray badge, not accepting enrollment

---

## 🛠️ Technical Implementation

### Technology Stack

- **Frontend:** Pure HTML, CSS, JavaScript (No frameworks)
- **Styling:** Custom CSS with gradient designs
- **Data Storage:** Client-side JavaScript arrays (can be replaced with API calls)
- **Responsive:** Works on desktop, tablet, and mobile

### Data Structure

#### Curriculum Data Object

```javascript
{
    id: 1,
    program: 'BSCS',
    year: 1,
    term: '1st Semester',
    subjectCode: 'CS101',
    subjectName: 'Introduction to Computing',
    units: 3,
    prerequisites: 'None',
    description: '',
    status: 'active'
}
```

#### Offerings Data Object

```javascript
{
    id: 1,
    program: 'BSCS',
    term: '2025-2026 1st Sem',
    subjectCode: 'CS101',
    subjectName: 'Intro to Computing',
    faculty: 'Prof. Juan Dela Cruz',
    schedule: 'MWF 8:00-9:00 AM',
    room: 'Room 301',
    capacity: 40,
    enrolled: 30,
    status: 'available'
}
```

### Key JavaScript Functions

#### Roadmap Rendering

```javascript
function renderProgramRoadmap()
```

- Filters curriculum by selected program
- Groups by year and term
- Sorts years numerically
- Sorts terms logically (1st Sem → 2nd Sem → Summer)
- Calculates totals (subjects, units)
- Generates hierarchical HTML structure
- Displays in container

#### CRUD Operations

```javascript
saveCurriculum(event); // Create/Update curriculum
editCurriculum(id); // Load data for editing
deleteCurriculum(id); // Delete curriculum record

saveOffering(event); // Create/Update offering
editOffering(id); // Load offering for editing
deleteOffering(id); // Delete offering record
```

#### Utility Functions

```javascript
switchTab(tabName); // Switch between tabs
openModal(modalId); // Open add/edit modal
closeModal(modalId); // Close modal
searchTable(tableId); // Search/filter table rows
showNotification(msg, type); // Show success/error messages
printRoadmap(); // Print roadmap view
```

---

## 🎨 UI/UX Features

### Modern Design Elements

1. **Gradient Backgrounds** - Purple to violet gradients
2. **Card-Based Layout** - Clean, organized sections
3. **Responsive Design** - Works on all screen sizes
4. **Hover Effects** - Interactive feedback
5. **Modal Dialogs** - Smooth overlays for forms
6. **Color-Coded Badges** - Quick status identification
7. **Notification System** - Toast-style success/error messages

### Accessibility

- Semantic HTML structure
- Clear labels for form fields
- Keyboard navigation support
- High contrast colors
- Readable font sizes

---

## 📱 Responsive Behavior

- **Desktop (>1400px):** Full layout with all features
- **Tablet (768px-1399px):** Adjusted grid columns
- **Mobile (<768px):** Stacked layout, touch-friendly buttons

---

## 🔄 Integration with Backend

### Current Implementation: Static Data

Currently uses client-side JavaScript arrays for demonstration.

### Future Backend Integration

Replace static data with API calls:

```javascript
// Example: Fetch curriculum from backend
async function fetchCurriculumData() {
  const response = await fetch("/api/curriculum");
  curriculumData = await response.json();
  renderCurriculumTable();
}

// Example: Save curriculum to backend
async function saveCurriculum(formData) {
  const response = await fetch("/api/curriculum", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  // Handle response
}
```

### Backend Endpoints Needed

```
GET    /api/curriculum              - Fetch all curriculum
GET    /api/curriculum/:program     - Fetch by program
POST   /api/curriculum              - Create new curriculum
PUT    /api/curriculum/:id          - Update curriculum
DELETE /api/curriculum/:id          - Delete curriculum

GET    /api/offerings               - Fetch all offerings
GET    /api/offerings/:term         - Fetch by term
POST   /api/offerings               - Create new offering
PUT    /api/offerings/:id           - Update offering
DELETE /api/offerings/:id           - Delete offering
```

---

## 🧪 Testing Scenarios

### Test Cases for Curriculum

1. ✅ Add new curriculum record
2. ✅ Edit existing curriculum
3. ✅ Delete curriculum (with confirmation)
4. ✅ Search/filter curriculum table
5. ✅ Validate required fields
6. ✅ Handle duplicate entries

### Test Cases for Program Roadmap

1. ✅ Switch between programs
2. ✅ Display all years and terms correctly
3. ✅ Show prerequisites accurately
4. ✅ Calculate totals correctly
5. ✅ Print roadmap cleanly
6. ✅ Handle empty program data

### Test Cases for Course Offerings

1. ✅ Add new course offering
2. ✅ Edit offering details
3. ✅ Delete offering
4. ✅ Update enrollment count
5. ✅ Change status (Available/Full/Closed)
6. ✅ Assign faculty

---

## 💡 Usage Scenarios

### Scenario 1: New Academic Year Setup

1. Academic head reviews curriculum in **Program Roadmap** tab
2. Identifies subjects for upcoming term
3. Switches to **Course Offerings** tab
4. Creates new offerings for each subject
5. Assigns faculty, rooms, schedules
6. Sets capacity limits

### Scenario 2: Student Enrollment Planning

1. Student accesses system
2. Views **Program Roadmap** for their program
3. Sees Year 1, Term 1 requirements
4. Switches to **Course Offerings** tab
5. Checks available sections for required subjects
6. Notes schedule and faculty information

### Scenario 3: Curriculum Update

1. Program head reviews current curriculum
2. Identifies needed changes (new subjects, updated prerequisites)
3. Uses **Default Curriculum** tab
4. Edits existing records or adds new subjects
5. Updates prerequisite chains
6. Saves changes

---

## 🚀 Future Enhancements

### Planned Features

1. **Drag-and-Drop Curriculum Builder**

   - Visual interface to arrange subjects
   - Drag subjects between terms

2. **Prerequisite Visualization**

   - Flowchart showing subject dependencies
   - Interactive prerequisite tree

3. **Conflict Detection**

   - Check for scheduling conflicts
   - Warn about prerequisite issues

4. **Bulk Import/Export**

   - Import curriculum from Excel/CSV
   - Export to PDF for distribution

5. **Student Progress Overlay**

   - Show completed subjects on roadmap
   - Highlight next recommended subjects

6. **Faculty Workload View**

   - Calculate teaching loads
   - Detect overloaded faculty

7. **Historical Versions**

   - Track curriculum changes over time
   - Compare different curriculum versions

8. **Enrollment Statistics**
   - Show enrollment trends
   - Predict future capacity needs

---

## 📖 Glossary

- **Curriculum** - Official list of subjects required for a program
- **Program** - Degree program (e.g., BSCS, BSIT)
- **Term** - Academic period (1st Semester, 2nd Semester, Summer)
- **Subject** - Individual course or class
- **Prerequisite** - Subject(s) that must be completed before taking another subject
- **Course Offering** - Actual class section being offered in a term
- **Faculty** - Instructor/professor teaching the course
- **Capacity** - Maximum number of students allowed in a class
- **Enrollment** - Number of students currently registered
- **Roadmap** - Visual representation of the complete program curriculum

---

## ❓ FAQ

**Q: What's the difference between Default Curriculum and Course Offerings?**
A: Default Curriculum is the template (what students SHOULD take). Course Offerings are actual classes (what IS being offered with faculty, schedule, etc.).

**Q: Can I edit multiple curriculum records at once?**
A: Currently, no. Each record must be edited individually. Bulk edit feature is planned.

**Q: How do I print the Program Roadmap?**
A: Click the "🖨️ Print Roadmap" button or use Ctrl+P / Cmd+P. The page is formatted for printing.

**Q: What happens if I delete a subject that's a prerequisite for others?**
A: Currently, the system allows it. Future versions will warn about dependency issues.

**Q: Can students see this interface?**
A: This is an administrative interface. A student-facing view would be separate.

**Q: How do I add a new program?**
A: Currently, programs are hardcoded in the dropdowns. Adding new programs requires code changes.

**Q: Can I export the roadmap to PDF?**
A: Use the print function and select "Save as PDF" in your print dialog.

---

## 📞 Support

For questions or issues with the Curriculum Management UI:

- Contact: IT Support Team
- Email: support@skolaris.edu.ph
- Documentation: This guide

---

## 📝 Change Log

### Version 1.1 (Current)

- ✅ Added Program Roadmap view
- ✅ Hierarchical display by Year → Term → Subject
- ✅ Complete BSCS curriculum data (4 years)
- ✅ Print functionality for roadmap
- ✅ Enhanced visual design with gradients
- ✅ Statistics dashboard

### Version 1.0 (Initial)

- ✅ Default Curriculum management
- ✅ Course Offerings management
- ✅ CRUD operations
- ✅ Search and filter
- ✅ Modal forms
- ✅ Responsive design

---

## 📄 License

© 2025 SKOLARIS Student Information System. All rights reserved.

---

**Last Updated:** October 10, 2025  
**Maintained by:** ICCT IT Department
