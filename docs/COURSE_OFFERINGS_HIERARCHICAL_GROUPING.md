# Course Offerings Hierarchical Grouping

**Date:** October 26, 2025  
**Status:** ✅ **COMPLETE**  
**Author:** SKOLARIS Development Team

---

## 🎯 Problem

The user requested a better way to view course offerings in a hierarchical structure:

**Request:** "sa grid pwde mo din ba i group sila under ng program may multiple section then nadun ung main edit button tapos under nun multiple subject?"

Translation: Can you group them under the program with multiple sections, then have a main edit button, and under that show multiple subjects?

---

## ✅ Solution

Implemented a hierarchical grouping structure that organizes course offerings in three levels:

1. **Program Level** - Groups all offerings by program, term, year level, and semester
2. **Section Level** - Under each program, groups offerings by section code
3. **Subject Level** - Shows all subjects offered in each section in a table

---

## 🎨 New Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Program Name (Manage Button)                                │
│ [Expanded/Collapsed Icon]                                    │
│ Term • Year X - Semester Y • M sections • N subjects        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌─ Section: LFCA111A001                                      │
│ │  3 subjects in this section                                 │
│ │  ┌──────────────────────────────────────────────────────┐ │
│ │  │ Subject │ Units │ Modality │ Schedule │ Faculty │      │ │
│ │  │ CS101  │  3    │    LF    │ Mon 8AM  │  Juan   │      │ │
│ │  │ MATH101│  3    │    LF    │ Mon 9AM  │  Maria  │      │ │
│ │  │ ENG101 │  3    │    LF    │ Mon 10AM │  Pedro  │      │ │
│ │  └──────────────────────────────────────────────────────┘ │
│ └───────────────────────────────────────────────────────────┘
│
│ ┌─ Section: LFCA111B001                                      │
│ │  2 subjects in this section                                 │
│ │  [Subjects table...]                                        │
│ └───────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Changes Made

### 1. Enhanced Grouping Logic

**File:** `src/pages/CourseOfferingsListAdmin.jsx`

**Before:**

- Grouped by: Program + Term + Year Level + Semester
- Flat structure with all offerings listed under the group

  **After:**

- Groups by: Program + Term + Year Level + Semester
- **Then groups by Section Code**
- Shows subjects as a table under each section

### 2. New Data Structure

```javascript
groupedOfferings = {
  programKey: {
    programId,
    programCode,
    programName,
    termName,
    yearLevel,
    semester,
    sections: {
      sectionCode: {
        sectionCode,
        offerings: [
          /* array of course offerings (subjects) in this section */
        ],
      },
    },
  },
};
```

### 3. Enhanced UI

- **Program Header**

  - Gradient background (blue to indigo)
  - "Manage" button with edit icon
  - Shows count of subjects and sections
  - Clickable to expand/collapse
  - Larger, bolder font for better visibility

- **Section Header**

  - Gradient background (purple to blue) for distinction
  - Users icon for visual cue
  - Shows number of subjects in this section
  - Each section is a separate collapsible section

- **Subjects Table**
  - Clean, compact table layout
  - Shows: Subject, Units, Modality, Schedule, Faculty, Enrollment, Status, Actions
  - Each subject has its own edit, toggle, and delete buttons
  - Responsive and scrollable

---

## 📊 Features

### User Experience

✅ **Hierarchical Navigation**: Easy to find offerings by program → subject → section  
✅ **Clear Organization**: Visual separation between program, subjects, and sections  
✅ **Quick Actions**: Main "Manage" button at program level for bulk operations  
✅ **Detailed View**: Compact table shows all relevant information for each section  
✅ **Expandable Groups**: Click headers to collapse/expand sections  
✅ **Status Indicators**: Clear badges showing enrollment status

### Benefits

1. **Better Organization**: Multiple sections of the same subject are grouped together
2. **Easier Management**: Quick access to all sections for a program
3. **Better Visibility**: Program-level summary shows total subjects and sections
4. **Cleaner Interface**: Hierarchical structure reduces visual clutter
5. **Scalable**: Works well with many offerings

---

## 🎨 Visual Hierarchy

### Level 1: Program

- **Background**: Gradient (blue-50 to indigo-50)
- **Font**: Bold, larger (text-lg)
- **Color**: Blue theme
- **Action**: Main "Manage" button

### Level 2: Section

- **Background**: Gradient (purple-50 to blue-50)
- **Font**: Bold (text-base)
- **Icon**: Users (purple)
- **Info**: Subject count

### Level 3: Subjects Table

- **Background**: White
- **Style**: Clean table with hover effects
- **Actions**: Edit, Toggle, Delete buttons per row

---

## 📝 Technical Details

### Grouping Logic

```javascript
offerings.forEach((offering) => {
  // Level 1: Group by Program + Term + Year + Semester
  const programKey = `${programId}|${programCode}|${programName}|${termName}|${yearLevel}|${semester}`;

  // Level 2: Group by Section Code
  const sectionCode = offering.section || "unsectioned";
  grouped[programKey].sections[sectionCode].offerings.push(offering);
});
```

### Rendering

```jsx
{
  Object.entries(groupedOfferings).map(([groupKey, group]) => {
    // Render Program Header
    // Then render each Section
    Object.values(group.sections).map((section) => {
      // Render Section Header
      // Then render Subjects Table
      section.offerings.map((offering) => {
        // Render subject row
      });
    });
  });
}
```

---

## 🚀 Usage

### For Users

1. **View by Program**: All offerings are grouped by program
2. **Browse Subjects**: Click to expand and see all subjects
3. **Manage Sections**: Each section has its own actions
4. **Quick Actions**: Use "Manage" button for program-level actions
5. **Filter**: Use filters to narrow down by term, year, semester, etc.

### For Developers

- Data structure is hierarchical and easy to extend
- Each level is rendered independently
- Actions are context-aware (program vs. section)
- Maintainable and scalable code

---

## 📌 Status

- ✅ Hierarchical grouping implemented
- ✅ Enhanced UI with visual hierarchy
- ✅ Program-level "Manage" button added
- ✅ Subject grouping with section tables
- ✅ No linting errors
- ✅ Backward compatible

---

## 🎯 Key Improvements

1. **Organization**: Much better than flat list
2. **Clarity**: Clear hierarchy of Program → Subject → Section
3. **Efficiency**: Easier to find and manage related offerings
4. **Aesthetics**: Modern, clean design with gradients and proper spacing
5. **Functionality**: Per-section actions preserved

---

**Related Files:**

- `/Users/aldrincruzomnes/SKOLARIS/skolaris-fe/src/pages/CourseOfferingsListAdmin.jsx`
- `/Users/aldrincruzomnes/SKOLARIS/skolaris-fe/src/pages/CourseOfferingFormAdmin.jsx`
- `/Users/aldrincruzomnes/SKOLARIS/skolaris-be/app/Http/Controllers/Api/CourseOfferingController.php`
