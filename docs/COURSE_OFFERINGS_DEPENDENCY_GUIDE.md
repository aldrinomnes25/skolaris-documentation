# Course Offerings Dependency Feature - Guide

## 🔗 Overview

The **Course Offerings Dependency Feature** ensures that course offerings can only be created for subjects that exist in the **Default Curriculum**. This creates a proper hierarchical relationship:

```
Default Curriculum (Template)
    ↓
Program + Year Level + Term
    ↓
Available Subjects
    ↓
Course Offerings (Actual Classes)
```

---

## ✨ What Changed?

### Before (Old System)

❌ Could manually type any subject code and name  
❌ No validation if subject exists in curriculum  
❌ No connection between curriculum and offerings  
❌ Easy to create offerings for non-existent subjects

### After (New System)

✅ Subjects are **automatically pulled** from Default Curriculum  
✅ **Cascading dropdowns** - select Program → Year → Term → Subject  
✅ Subject details **auto-filled** (code, name, units, prerequisites)  
✅ **Prevents errors** - can only create offerings for curriculum subjects  
✅ **Data integrity** - ensures offerings match the curriculum

---

## 🎯 How It Works

### Step-by-Step Process

#### Step 1: Select Program

- Choose from: BSCS, BSIT, BSIS, ACT
- This enables the Year Level dropdown

#### Step 2: Select Academic Year

- Choose the school year (e.g., 2025-2026)

#### Step 3: Select Year Level

- Choose: Year 1, Year 2, Year 3, or Year 4
- This is needed to filter subjects

#### Step 4: Select Term

- Choose: 1st Semester, 2nd Semester, or Summer
- After selecting this, the Subject dropdown populates

#### Step 5: Select Subject

- **Subject dropdown** now shows **ONLY** subjects from Default Curriculum that match:
  - Selected Program
  - Selected Year Level
  - Selected Term
  - Status = Active

Example:

```
If you select:
- Program: BSCS
- Year Level: Year 1
- Term: 1st Semester

Subject dropdown will show:
- CS101 - Introduction to Computing (3 units)
- MATH101 - Calculus I (3 units)
- ENG101 - English I (3 units)
- FIL101 - Filipino I (3 units)
- PE101 - Physical Education 1 (2 units)
- NSTP101 - NSTP 1 (3 units)
```

#### Step 6: Auto-Fill

Once you select a subject, these fields **automatically fill**:

- Subject Code (e.g., CS101)
- Subject Name (e.g., Introduction to Computing)
- Units (e.g., 3 unit(s))
- Prerequisites (e.g., None or CS101)

These fields are **read-only** to prevent modification.

#### Step 7: Add Offering Details

Now add the offering-specific information:

- Faculty Assigned
- Schedule (e.g., MWF 8:00-9:00 AM)
- Room (e.g., Room 301)
- Capacity (e.g., 40)
- Currently Enrolled (default: 0)
- Status (Available/Full/Closed)

#### Step 8: Save

Click "Save Offering" and it will be added to the Course Offerings table.

---

## 📋 Form Structure

### New Course Offering Form Fields

**Row 1:**

- Program \* (dropdown)
- Academic Year \* (dropdown)

**Row 2:**

- Year Level \* (dropdown)
- Term \* (dropdown)

**Row 3:**

- Subject \* (dropdown - dynamically populated)
- Helper text: "📋 Only subjects from the Default Curriculum for the selected program, year, and term will appear here."

**Row 4:**

- Subject Code (auto-filled, read-only)
- Subject Name (auto-filled, read-only)

**Row 5:**

- Units (auto-filled, read-only)
- Prerequisites (auto-filled, read-only)

**Row 6:**

- Faculty Assigned \* (dropdown)

**Row 7:**

- Schedule \* (text input)
- Room \* (text input)

**Row 8:**

- Capacity \* (number input)
- Currently Enrolled (number input)

**Row 9:**

- Status \* (dropdown)

---

## 💻 Technical Implementation

### Cascading Dropdown Functions

#### 1. `updateOfferingYearLevels()`

```javascript
// Triggered when Program is selected
// Enables Year Level dropdown
// Resets subsequent dropdowns
```

#### 2. `updateOfferingSubjects()`

```javascript
// Triggered when Year Level OR Term is selected
// Filters curriculumData by:
//   - program
//   - year
//   - term
//   - status = 'active'
// Populates Subject dropdown
// Shows notification if no subjects found
```

#### 3. `fillSubjectDetails()`

```javascript
// Triggered when Subject is selected
// Finds selected subject in curriculumData
// Auto-fills:
//   - Subject Code
//   - Subject Name
//   - Units
//   - Prerequisites
```

#### 4. `clearSubjectDetails()`

```javascript
// Clears all auto-filled subject fields
// Called when form is reset
```

### Data Flow

```
User Action:
  Select Program → onChange → updateOfferingYearLevels()
  Select Year Level → onChange → updateOfferingSubjects()
  Select Term → onChange → updateOfferingSubjects()
  Select Subject → onChange → fillSubjectDetails()

Data Query:
  curriculumData.filter(c =>
    c.program === selectedProgram &&
    c.year == selectedYear &&
    c.term === selectedTerm &&
    c.status === 'active'
  )

Auto-Fill:
  const subject = curriculumData.find(c => c.id == selectedId)
  document.getElementById('offering-subject-code').value = subject.subjectCode
  document.getElementById('offering-subject-name').value = subject.subjectName
  // ... etc
```

### Data Structure

#### Course Offering Object (Updated)

```javascript
{
  id: 1,
  program: 'BSCS',                      // Selected from dropdown
  yearLevel: 1,                         // NEW: Selected from dropdown
  term: '2025-2026 1st Semester',      // Combination of academic year + term
  subjectCode: 'CS101',                 // Auto-filled from curriculum
  subjectName: 'Intro to Computing',    // Auto-filled from curriculum
  faculty: 'Prof. Juan Dela Cruz',      // User input
  schedule: 'MWF 8:00-9:00 AM',        // User input
  room: 'Room 301',                     // User input
  capacity: 40,                         // User input
  enrolled: 30,                         // User input
  status: 'available'                   // User input
}
```

---

## 🎨 UI/UX Features

### Visual Indicators

1. **Helper Text**

   ```
   📋 Only subjects from the Default Curriculum for the selected
   program, year, and term will appear here.
   ```

2. **Read-Only Fields**

   - Gray background (#f8f9fa)
   - Indicates auto-filled, non-editable fields

3. **Empty State**
   ```
   If no subjects found for the combination:
   - Subject dropdown shows: "No subjects found for this combination"
   - Toast notification: "⚠️ No subjects in curriculum for this program, year, and term"
   ```

### User Experience Flow

```
1. User opens "Add Course Offering" modal
2. Sees organized form with clear sections
3. Selects Program → Year Level → Term (in order)
4. Subject dropdown populates automatically
5. Selects Subject
6. Sees subject details auto-fill
7. Adds offering-specific info (faculty, schedule, etc.)
8. Saves
9. Offering appears in table with all information
```

---

## ✅ Benefits

### 1. Data Integrity

- Offerings can only be created for subjects in the curriculum
- No orphaned or invalid subjects
- Consistent subject codes and names

### 2. Error Prevention

- Can't accidentally create offerings for non-existent subjects
- Can't typo subject codes or names
- Validation happens automatically

### 3. User-Friendly

- Dropdown selection instead of manual typing
- Auto-fill reduces data entry
- Clear visual flow with cascading dropdowns

### 4. Curriculum-Driven

- Curriculum is the single source of truth
- Changes to curriculum automatically reflect in offerings
- Maintains proper academic hierarchy

### 5. Efficient

- Faster data entry
- Less chance of errors
- Clear what subjects can be offered per term

---

## 🔍 Example Scenarios

### Scenario 1: Creating a New Offering

**Goal:** Create offering for CS101 in BSCS Year 1, 1st Semester

**Steps:**

1. Click "➕ Add Course Offering"
2. Select **Program:** BSCS
3. Select **Academic Year:** 2025-2026
4. Select **Year Level:** Year 1
5. Select **Term:** 1st Semester
6. **Subject dropdown shows:** All Year 1, 1st Sem subjects for BSCS
7. Select **Subject:** CS101 - Introduction to Computing (3 units)
8. **Auto-fills:**
   - Subject Code: CS101
   - Subject Name: Introduction to Computing
   - Units: 3 unit(s)
   - Prerequisites: None
9. Select **Faculty:** Prof. Juan Dela Cruz
10. Enter **Schedule:** MWF 8:00-9:00 AM
11. Enter **Room:** Room 301
12. Enter **Capacity:** 40
13. Select **Status:** Available
14. Click "💾 Save Offering"
15. ✅ Offering created!

### Scenario 2: No Subjects Available

**Goal:** Try to create offering for BSCS Year 4, Summer

**Steps:**

1. Click "➕ Add Course Offering"
2. Select **Program:** BSCS
3. Select **Academic Year:** 2025-2026
4. Select **Year Level:** Year 4
5. Select **Term:** Summer
6. **Subject dropdown shows:** "No subjects found for this combination"
7. **Notification appears:** "⚠️ No subjects in curriculum for this program, year, and term"
8. **Action needed:** Either:
   - Add subjects to Default Curriculum for BSCS Year 4 Summer first
   - OR select different combination

### Scenario 3: Editing Existing Offering

**Goal:** Edit faculty assignment for existing CS101 offering

**Steps:**

1. Click "✏️ Edit" on CS101 offering row
2. Modal opens with **all fields pre-filled:**
   - Program: BSCS
   - Academic Year: 2025-2026
   - Year Level: Year 1
   - Term: 1st Semester
   - Subject: CS101 - Introduction to Computing (3 units)
   - Subject Code: CS101 (auto-filled)
   - Subject Name: Introduction to Computing (auto-filled)
   - Units: 3 unit(s) (auto-filled)
   - Prerequisites: None (auto-filled)
   - Faculty: Prof. Juan Dela Cruz ← **Can change this**
   - Schedule: MWF 8:00-9:00 AM ← **Can change this**
   - Room: Room 301 ← **Can change this**
   - Capacity: 40 ← **Can change this**
   - Enrolled: 30 ← **Can change this**
   - Status: Available ← **Can change this**
3. Change **Faculty** to: Prof. Maria Santos
4. Click "💾 Save Offering"
5. ✅ Offering updated!

---

## 📊 Table Display

### Updated Course Offerings Table

| Column            | Description                | Source             |
| ----------------- | -------------------------- | ------------------ |
| ID                | Offering ID                | Auto-generated     |
| Program           | BSCS, BSIT, etc.           | User selection     |
| **Year Level**    | **NEW: Year 1-4**          | **User selection** |
| Term              | 2025-2026 1st Semester     | User selection     |
| Subject           | CS101 - Intro to Computing | From curriculum    |
| Faculty           | Prof. Juan Dela Cruz       | User input         |
| Schedule          | MWF 8:00-9:00 AM           | User input         |
| Room              | Room 301                   | User input         |
| Enrolled/Capacity | 30/40                      | User input         |
| Status            | Available/Full/Closed      | User input         |
| Actions           | Edit/Delete buttons        | UI                 |

---

## 🚀 Future Enhancements

### Potential Improvements

1. **Multiple Sections**

   - Allow creating multiple sections of same subject
   - E.g., CS101 Section A, CS101 Section B

2. **Conflict Detection**

   - Check for schedule conflicts (faculty/room)
   - Warn if overlapping times

3. **Capacity Warnings**

   - Alert when approaching capacity
   - Suggest opening new section

4. **Prerequisite Validation**

   - Check if students meet prerequisites before enrolling
   - Show prerequisite chain

5. **Bulk Creation**

   - Create offerings for entire term at once
   - Based on previous term's offerings

6. **Faculty Workload**
   - Calculate total teaching hours per faculty
   - Warn if overloaded

---

## ❓ FAQ

**Q: What if I select a program/year/term with no subjects in curriculum?**  
A: The subject dropdown will show "No subjects found for this combination" and a notification will appear. You need to add subjects to the Default Curriculum first.

**Q: Can I manually type a subject that's not in the curriculum?**  
A: No. This is intentional to ensure data integrity. All offerings must be based on curriculum subjects.

**Q: What if I want to offer a subject not in the standard curriculum?**  
A: Add it to the Default Curriculum first, then create the offering.

**Q: Can I edit the subject after creating an offering?**  
A: Yes, when editing, you can select a different subject from the available subjects for that program/year/term.

**Q: What happens if I change the curriculum after creating offerings?**  
A: Existing offerings remain unchanged. The dependency is checked only at creation time.

**Q: Why are subject code, name, units, and prerequisites read-only?**  
A: These come directly from the curriculum and shouldn't be modified to maintain consistency.

---

## 🎓 Summary

### Key Points

✅ **Dependency Established:** Course Offerings → Default Curriculum  
✅ **Cascading Dropdowns:** Program → Year → Term → Subject  
✅ **Auto-Fill:** Subject details filled automatically  
✅ **Data Integrity:** Can only create offerings for curriculum subjects  
✅ **User-Friendly:** Clear flow, less typing, fewer errors  
✅ **Validation:** No invalid subjects possible

### What This Solves

❌ **Before:** Free-form input, no validation, possible errors  
✅ **After:** Structured selection, automatic validation, data integrity

---

**This feature ensures that Course Offerings are always properly linked to the Default Curriculum, maintaining academic accuracy and data consistency! 🎉**

---

**Last Updated:** October 10, 2025  
**Feature Version:** 1.2
