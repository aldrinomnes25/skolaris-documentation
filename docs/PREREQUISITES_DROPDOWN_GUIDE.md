# Prerequisites Dropdown Feature - Guide

## 🎯 Overview

The **Prerequisites Dropdown Feature** ensures that prerequisites can only be selected from subjects that students would have already completed. This is achieved by dynamically filtering subjects to show only those from **previous terms**.

---

## ✨ What Changed?

### Before (Old System)
❌ Prerequisites were **manually typed** as comma-separated text  
❌ No validation - could type any subject code  
❌ Easy to add prerequisites from future terms (invalid)  
❌ Typos in subject codes common  
❌ No guarantee that prerequisite subjects actually exist  

### After (New System)
✅ Prerequisites are **selected from a dropdown** (multi-select)  
✅ Dropdown **only shows subjects from previous terms**  
✅ **Automatic filtering** based on selected program, year, and term  
✅ **Prevents errors** - can't select future subjects as prerequisites  
✅ **Multi-select** - can choose multiple prerequisites easily  

---

## 🔍 How It Works

### Smart Filtering Logic

When you select Program, Year Level, and Term for a subject, the prerequisites dropdown automatically filters to show:

**Rule:** Only subjects from **EARLIER** terms in the **SAME PROGRAM**

#### What Counts as "Previous"?

**Example 1: Year 1, 2nd Semester**
```
Can select prerequisites from:
✅ Year 1, 1st Semester

Cannot select from:
❌ Year 1, 2nd Semester (same term)
❌ Year 1, Summer (later term)
❌ Year 2+ (future years)
```

**Example 2: Year 2, 1st Semester**
```
Can select prerequisites from:
✅ Year 1, 1st Semester
✅ Year 1, 2nd Semester
✅ Year 1, Summer

Cannot select from:
❌ Year 2, 1st Semester (same term)
❌ Year 2+ (future terms)
```

**Example 3: Year 3, 2nd Semester**
```
Can select prerequisites from:
✅ All Year 1 subjects (all terms)
✅ All Year 2 subjects (all terms)
✅ Year 3, 1st Semester

Cannot select from:
❌ Year 3, 2nd Semester (same term)
❌ Year 3, Summer (later term)
❌ Year 4 (future year)
```

### Term Order Logic

The system recognizes this term order:
1. **1st Semester** (comes first)
2. **2nd Semester** (comes second)
3. **Summer** (comes third/last)

So:
- 2nd Semester subjects can have 1st Semester prerequisites
- Summer subjects can have 1st Semester and 2nd Semester prerequisites

---

## 📋 How to Use

### Step-by-Step: Adding a Subject with Prerequisites

#### Step 1: Fill Basic Information
1. Click "➕ Add Curriculum"
2. Select **Program** (e.g., BSCS)
3. Select **Year Level** (e.g., Year 2)
4. Select **Term** (e.g., 1st Semester)
5. Enter Subject Code and Name
6. Enter Units

#### Step 2: Select Prerequisites
The **Prerequisites dropdown** will now be populated with subjects from previous terms.

**Example:** If you selected BSCS Year 2 1st Semester, you'll see:
```
Prerequisites dropdown shows:
✅ CS101 - Introduction to Computing (Year 1 1st Semester)
✅ MATH101 - Calculus I (Year 1 1st Semester)
✅ ENG101 - English I (Year 1 1st Semester)
✅ FIL101 - Filipino I (Year 1 1st Semester)
✅ PE101 - Physical Education 1 (Year 1 1st Semester)
✅ NSTP101 - NSTP 1 (Year 1 1st Semester)
✅ CS102 - Programming Fundamentals (Year 1 2nd Semester)
✅ MATH102 - Calculus II (Year 1 2nd Semester)
... and so on (all Year 1 subjects)
```

#### Step 3: Multi-Select
- **Windows:** Hold `Ctrl` key and click multiple subjects
- **Mac:** Hold `Cmd` key and click multiple subjects
- **Alternative:** Click first subject, hold `Shift`, click last subject to select range

#### Step 4: Save
- Click "💾 Save Curriculum"
- Prerequisites will be saved as comma-separated list (e.g., "CS101, MATH101")

### What If No Previous Subjects Exist?

**Scenario:** Adding a Year 1, 1st Semester subject

The dropdown will show:
```
Prerequisites:
✅ None (No Prerequisites)
   (No previous subjects available)
```

This is **expected** - first semester subjects typically have no prerequisites!

---

## 💻 Technical Implementation

### Function: `updateCurriculumPrerequisites()`

This function is called whenever:
- Program changes
- Year Level changes
- Term changes

**Logic Flow:**
```javascript
1. Get selected program, year, term
2. Filter curriculumData to find subjects where:
   - Same program
   - Status = active
   - Year < selected year (earlier years)
     OR
   - Year = selected year AND term is earlier in sequence
3. Sort subjects by year and term
4. Populate dropdown with filtered subjects
```

### Code Snippet:
```javascript
function updateCurriculumPrerequisites() {
    const program = document.getElementById('curriculum-program').value;
    const year = parseInt(document.getElementById('curriculum-year').value);
    const term = document.getElementById('curriculum-term').value;
    
    const previousSubjects = [];
    
    curriculumData.forEach(subject => {
        if (subject.program !== program || subject.status !== 'active') return;
        
        const subjectYear = parseInt(subject.year);
        const subjectTerm = subject.term;
        
        let isPrevious = false;
        
        if (subjectYear < year) {
            isPrevious = true; // Any subject from earlier years
        } else if (subjectYear === year) {
            // Same year - check term order
            const termOrder = ['1st Semester', '2nd Semester', 'Summer'];
            const currentTermIndex = termOrder.indexOf(term);
            const subjectTermIndex = termOrder.indexOf(subjectTerm);
            
            if (subjectTermIndex < currentTermIndex && subjectTermIndex !== -1) {
                isPrevious = true;
            }
        }
        
        if (isPrevious) {
            previousSubjects.push(subject);
        }
    });
    
    // Populate dropdown with previousSubjects
}
```

### Saving Prerequisites

When saving, the function:
1. Gets all selected options from the multi-select dropdown
2. Extracts their values (subject codes)
3. Joins them as comma-separated string
4. Saves to curriculum data

```javascript
const prereqSelect = document.getElementById('curriculum-prerequisites');
const selectedPrereqs = Array.from(prereqSelect.selectedOptions).map(opt => opt.value);
let prerequisites = 'None';

if (selectedPrereqs.length > 0 && !selectedPrereqs.includes('None')) {
    prerequisites = selectedPrereqs.join(', ');
}
```

### Editing Prerequisites

When editing an existing curriculum:
1. Load the subject data
2. Call `updateCurriculumPrerequisites()` to populate dropdown
3. Parse saved prerequisites (split by comma)
4. Select matching options in dropdown

```javascript
// Parse saved prerequisites
const savedPrereqs = curriculum.prerequisites.split(',').map(p => p.trim());

// Select matching options
Array.from(prereqSelect.options).forEach(opt => {
    if (savedPrereqs.includes(opt.value)) {
        opt.selected = true;
    }
});
```

---

## 🎨 UI/UX Design

### Multi-Select Dropdown
```html
<select id="curriculum-prerequisites" multiple style="min-height: 120px;">
    <option value="None">None (No Prerequisites)</option>
    <!-- Dynamically populated -->
</select>
```

**Features:**
- `multiple` attribute allows multi-selection
- `min-height: 120px` makes it tall enough to see several options
- Helper text below explains how to multi-select

### Helper Text
```
📋 Hold Ctrl (Windows) or Cmd (Mac) to select multiple subjects. 
Only subjects from previous terms will appear.
```

### Display Format
Each option shows:
```
[Subject Code] - [Subject Name] (Year [Y] [Term])
```

**Example:**
```
CS101 - Introduction to Computing (Year 1 1st Semester)
MATH102 - Calculus II (Year 1 2nd Semester)
```

---

## ✅ Benefits

### 1. Data Integrity
- Prerequisites are always valid subject codes
- Can't add prerequisites from future terms
- Ensures logical course progression

### 2. Error Prevention
- No typos in subject codes
- Can't accidentally type non-existent subjects
- Visual selection reduces mistakes

### 3. User-Friendly
- See all available prerequisites at a glance
- Multi-select is faster than typing
- Clear visual feedback

### 4. Academic Accuracy
- Enforces proper prerequisite rules
- Ensures students complete prerequisites before advanced subjects
- Maintains academic progression logic

### 5. Consistency
- All programs use the same prerequisite selection method
- Standardized across the system
- Easy to maintain

---

## 🔍 Example Scenarios

### Scenario 1: Adding Data Structures (Year 2 Subject)

**Subject:** CS201 - Data Structures  
**Program:** BSCS  
**Year:** 2  
**Term:** 1st Semester  

**Prerequisites Dropdown Shows:**
```
✅ CS101 - Introduction to Computing (Year 1 1st Semester)
✅ CS102 - Programming Fundamentals (Year 1 2nd Semester) ← Select this
✅ MATH101 - Calculus I (Year 1 1st Semester)
✅ MATH102 - Calculus II (Year 1 2nd Semester)
✅ ENG101 - English I (Year 1 1st Semester)
... (all Year 1 subjects)
```

**Action:** Select **CS102** as prerequisite (makes sense - need programming basics before data structures)

**Result:** Prerequisites saved as "CS102"

### Scenario 2: Adding Capstone Project (Year 4 Subject)

**Subject:** CS401 - Capstone Project 1  
**Program:** BSCS  
**Year:** 4  
**Term:** 1st Semester  

**Prerequisites Dropdown Shows:**
```
All subjects from:
✅ Year 1 - 1st Semester
✅ Year 1 - 2nd Semester
✅ Year 1 - Summer
✅ Year 2 - 1st Semester
✅ Year 2 - 2nd Semester
✅ Year 2 - Summer
✅ Year 3 - 1st Semester
✅ Year 3 - 2nd Semester
✅ Year 3 - Summer
```

**Action:** Select **CS301 (Software Engineering)** from Year 3

**Result:** Prerequisites saved as "CS301"

### Scenario 3: First Semester Subject (No Prerequisites)

**Subject:** CS101 - Introduction to Computing  
**Program:** BSCS  
**Year:** 1  
**Term:** 1st Semester  

**Prerequisites Dropdown Shows:**
```
✅ None (No Prerequisites)
   (No previous subjects available)
```

**Action:** Leave "None" selected

**Result:** Prerequisites saved as "None"

---

## 📊 Comparison Table

| Feature | Old System (Text Input) | New System (Dropdown) |
|---------|------------------------|----------------------|
| **Input Method** | Manual typing | Dropdown selection |
| **Validation** | None | Automatic |
| **Typo Prevention** | No | Yes |
| **Time Validation** | No | Yes (only previous terms) |
| **Multi-Select** | Manual comma separation | Native multi-select |
| **Visual Feedback** | No | Yes (see all options) |
| **Error Prevention** | Low | High |
| **User Experience** | Moderate | Excellent |
| **Data Integrity** | Low | High |

---

## 🚀 Future Enhancements

### Potential Improvements

1. **Prerequisite Chain Visualization**
   - Show visual flowchart of prerequisite relationships
   - Highlight prerequisite paths

2. **Recommended Prerequisites**
   - System suggests common prerequisites based on subject code patterns
   - E.g., CS2XX subjects often require CS1XX

3. **Prerequisite Validation on Save**
   - Check if selected prerequisites form a valid chain
   - Warn about circular dependencies

4. **Co-requisites Support**
   - Add separate field for co-requisites (subjects taken together)
   - Different logic from prerequisites

5. **Prerequisite Groups**
   - Support "one of" logic (e.g., CS101 OR IT101)
   - More flexible prerequisite rules

---

## ❓ FAQ

**Q: Can I select subjects from a different program as prerequisites?**  
A: No. The dropdown only shows subjects from the SAME program to maintain consistency.

**Q: What if I select the wrong term order?**  
A: The dropdown automatically adjusts. If you change from 2nd Semester to 1st Semester, it will remove previously available subjects.

**Q: Can I still have "None" as prerequisite?**  
A: Yes! "None" is always available in the dropdown. Just select it if the subject has no prerequisites.

**Q: What happens if I select multiple prerequisites?**  
A: They are saved as a comma-separated list (e.g., "CS101, MATH101").

**Q: Can I clear all selections?**  
A: Yes. Ctrl+Click (Windows) or Cmd+Click (Mac) on a selected item to deselect it. Or select "None" to indicate no prerequisites.

**Q: What if I need to add a prerequisite from a different year level?**  
A: It will automatically appear if it's from a previous year. The system shows all subjects from earlier years.

**Q: Does this work with the Course Offerings dependency?**  
A: Yes! The prerequisites dropdown in Default Curriculum works independently, and Course Offerings will automatically show the prerequisites from the curriculum.

---

## 🎓 Summary

### Key Points

✅ **Smart Dropdown:** Prerequisites selected from dropdown, not typed  
✅ **Previous Terms Only:** Shows only subjects students would have completed  
✅ **Multi-Select:** Easy selection of multiple prerequisites  
✅ **Automatic Filtering:** Changes based on program/year/term selection  
✅ **Error Prevention:** Can't select invalid prerequisites  
✅ **Data Integrity:** Ensures proper course progression  

### What This Solves

❌ **Before:** Manual typing, no validation, possible errors  
✅ **After:** Dropdown selection, automatic validation, guaranteed accuracy  

### Impact

This feature ensures that curriculum prerequisites are:
- **Logically valid** (only from previous terms)
- **Consistent** (no typos or invalid codes)
- **Easy to manage** (dropdown vs typing)
- **Academically sound** (proper progression)

---

**This feature maintains academic integrity by ensuring prerequisites are always from subjects students have already completed! 🎉**

---

**Last Updated:** October 10, 2025  
**Feature Version:** 1.3  
**Related Features:** Course Offerings Dependency, Program Roadmap

