# Curriculum Versioning/Effectivity Guide

## 🎯 Problem Statement

**Tagalog:**

> "Pano ung kapag nag bago ang curriculum this year dapat di ma apektuhan ung curriculum previously"

**English:**

> "How to ensure that when the curriculum changes this year, the previous curriculum is not affected"

---

## 📚 The Challenge

### Real-World Scenario

**Year 2023:**

- Maria enrolls in BSCS
- Curriculum requires: CS101, MATH101, ENG101

**Year 2024:**

- School updates BSCS curriculum
- NEW curriculum requires: CS100 (replaces CS101), MATH100, ENG102

**The Problem:**

- ❌ Maria is a 2nd year now - which subjects should she follow?
- ❌ Should she take CS101 (her original curriculum) or CS100 (new curriculum)?
- ❌ What if CS101 is no longer offered?

### Why This Matters

1. **Student Protection:** Students shouldn't be forced to follow new requirements mid-program
2. **Academic Integrity:** Each cohort follows their enrolled curriculum version
3. **Planning:** Different year levels may have different requirements
4. **Compliance:** CHED/accreditation may require curriculum versioning

---

## ✅ Solution: Curriculum Effectivity System

### Core Concept

Each curriculum has an **Effectivity Year** or **Curriculum Version**.

```
┌─────────────────────────────────────────────┐
│ BSCS Curriculum - Effectivity 2023         │
│ (For students enrolled 2023-2024 onwards)  │
├─────────────────────────────────────────────┤
│ Year 1, 1st Sem: CS101, MATH101...         │
│ Year 1, 2nd Sem: CS102, MATH102...         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ BSCS Curriculum - Effectivity 2024 (NEW!)  │
│ (For students enrolled 2024-2025 onwards)  │
├─────────────────────────────────────────────┤
│ Year 1, 1st Sem: CS100, MATH100...         │
│ Year 1, 2nd Sem: CS105, MATH105...         │
└─────────────────────────────────────────────┘
```

### How It Works

1. **Add Effectivity Year field** to curriculum
2. **Students are tagged** with their curriculum effectivity year (based on enrollment)
3. **System shows appropriate curriculum** based on student's effectivity year
4. **Both curricula coexist** - old students follow old, new students follow new

---

## 🔧 Implementation Guide

### Step 1: Add Effectivity Year Field to Curriculum

#### Database Schema Update

**Current Structure:**

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
    status: 'active'
}
```

**Updated Structure:**

```javascript
{
    id: 1,
    program: 'BSCS',
    effectivityYear: '2023',  // NEW FIELD!
    year: 1,
    term: '1st Semester',
    subjectCode: 'CS101',
    subjectName: 'Introduction to Computing',
    units: 3,
    prerequisites: 'None',
    status: 'active'
}
```

### Step 2: Update Curriculum Form

**Add Effectivity Year dropdown in the form:**

```html
<div class="form-group">
  <label for="curriculum-effectivity">Curriculum Effectivity Year *</label>
  <select id="curriculum-effectivity" required>
    <option value="">Select Effectivity Year</option>
    <option value="2020">2020-2021</option>
    <option value="2021">2021-2022</option>
    <option value="2022">2022-2023</option>
    <option value="2023">2023-2024</option>
    <option value="2024">2024-2025</option>
    <option value="2025">2025-2026</option>
  </select>
  <small>For students enrolled in this academic year onwards</small>
</div>
```

### Step 3: Update Display/Filtering

**Add Effectivity Filter to Views:**

```html
<!-- Add filter dropdown -->
<div class="form-group">
  <label>View Curriculum for:</label>
  <select id="filter-effectivity" onchange="filterByEffectivity()">
    <option value="all">All Effectivity Years</option>
    <option value="2023">2023-2024 Curriculum</option>
    <option value="2024">2024-2025 Curriculum (Current)</option>
    <option value="2025">2025-2026 Curriculum (Upcoming)</option>
  </select>
</div>
```

**JavaScript Filtering:**

```javascript
function filterByEffectivity() {
  const effectivity = document.getElementById("filter-effectivity").value;

  let filteredData = curriculumData;

  if (effectivity !== "all") {
    filteredData = curriculumData.filter(
      (c) => c.effectivityYear === effectivity
    );
  }

  renderCurriculumTable(filteredData);
}
```

### Step 4: Update Program Roadmap

**Filter roadmap by effectivity:**

```javascript
function renderProgramRoadmap() {
  const selectedProgram = document.getElementById("roadmap-program").value;
  const selectedEffectivity = document.getElementById(
    "roadmap-effectivity"
  ).value;

  // Filter by program AND effectivity
  const programCurriculum = curriculumData.filter(
    (c) =>
      c.program === selectedProgram &&
      c.effectivityYear === selectedEffectivity &&
      c.status === "active"
  );

  // Render roadmap...
}
```

---

## 📊 UI Changes Needed

### 1. Curriculum Table - Add Effectivity Column

**Before:**
| ID | Program | Year/Term | Subject | Units | Prerequisites | Status | Actions |
|----|---------|-----------|---------|-------|---------------|--------|---------|

**After:**
| ID | Program | **Effectivity** | Year/Term | Subject | Units | Prerequisites | Status | Actions |
|----|---------|----------------|-----------|---------|-------|---------------|--------|---------|
| 1 | BSCS | **2023-2024** | Year 1 - 1st Sem | CS101 | 3 | None | Active | Edit/Delete |
| 2 | BSCS | **2024-2025** | Year 1 - 1st Sem | CS100 | 3 | None | Active | Edit/Delete |

### 2. Program Roadmap - Add Effectivity Selector

```html
<div class="action-bar">
  <div class="form-group">
    <label>Select Program:</label>
    <select id="roadmap-program">
      <option value="BSCS">BSCS</option>
      <option value="BSIT">BSIT</option>
    </select>
  </div>

  <!-- NEW: Effectivity Selector -->
  <div class="form-group">
    <label>Curriculum Version:</label>
    <select id="roadmap-effectivity">
      <option value="2023">2023-2024 (Old)</option>
      <option value="2024">2024-2025 (Current)</option>
      <option value="2025">2025-2026 (Upcoming)</option>
    </select>
  </div>
</div>
```

### 3. Visual Indicators

**Add badges to show curriculum status:**

```html
<span class="badge badge-old">Old Curriculum (2023)</span>
<span class="badge badge-current">Current Curriculum (2024)</span>
<span class="badge badge-upcoming">Upcoming Curriculum (2025)</span>
```

---

## 🎓 Student Enrollment Connection

### How Students Are Linked to Curriculum

**Student Record:**

```javascript
{
    studentId: '2023-12345',
    name: 'Maria Santos',
    program: 'BSCS',
    enrollmentYear: 2023,  // Year enrolled
    curriculumEffectivity: '2023',  // Locked to 2023 curriculum
    currentYear: 2,  // Now 2nd year
    status: 'active'
}
```

**System Logic:**

1. Maria enrolled in 2023
2. System assigns her `curriculumEffectivity: '2023'`
3. When viewing subjects, system filters: `program='BSCS' AND effectivityYear='2023'`
4. Maria always sees 2023 curriculum, even if it's now 2024

**New Student (2024):**

```javascript
{
    studentId: '2024-67890',
    name: 'Juan Cruz',
    program: 'BSCS',
    enrollmentYear: 2024,
    curriculumEffectivity: '2024',  // Gets NEW curriculum
    currentYear: 1,
    status: 'active'
}
```

---

## 🔄 Workflow Examples

### Scenario 1: Creating New Curriculum Version

**Steps:**

1. **Copy existing curriculum:**
   - Click "Copy Curriculum" button
   - System duplicates all BSCS 2023 records
2. **Update effectivity:**
   - Change effectivity from 2023 to 2024
3. **Make changes:**
   - Update subject codes (CS101 → CS100)
   - Add new subjects
   - Remove obsolete subjects
4. **Save:**
   - Both curricula now exist
   - Old students: 2023 curriculum
   - New students: 2024 curriculum

### Scenario 2: Student Viewing Their Curriculum

**Maria (2023 enrollee) logs in:**

```
System checks:
- Student program: BSCS
- Student curriculumEffectivity: 2023

System displays:
- BSCS 2023 Curriculum
- CS101, MATH101, etc.
- (Not the 2024 version)
```

**Juan (2024 enrollee) logs in:**

```
System checks:
- Student program: BSCS
- Student curriculumEffectivity: 2024

System displays:
- BSCS 2024 Curriculum
- CS100, MATH100, etc.
- (Not the 2023 version)
```

### Scenario 3: Course Offerings

**Creating offerings considers effectivity:**

```
2024-2025 School Year:

Need to offer BOTH:
✅ CS101 (for 2023 curriculum students - 2nd years and above)
✅ CS100 (for 2024 curriculum students - 1st years)

System tracks which offering is for which curriculum version.
```

---

## 💡 Advanced Features

### 1. Curriculum Comparison

**Show differences between versions:**

```html
<button onclick="compareCurricula('2023', '2024')">
  Compare 2023 vs 2024 Curriculum
</button>
```

**Comparison View:**

```
Changes from 2023 to 2024:

Added:
+ CS100 - New Programming Course
+ MATH100 - Advanced Mathematics

Removed:
- CS101 - Introduction to Computing
- MATH101 - Basic Calculus

Modified:
~ ENG101 → ENG102 (units changed 3 → 4)
```

### 2. Curriculum Copy Function

**Bulk copy for new version:**

```javascript
function copyCurriculumVersion(fromYear, toYear) {
  // Get all records from source year
  const sourceCurriculum = curriculumData.filter(
    (c) => c.effectivityYear === fromYear
  );

  // Duplicate with new effectivity year
  sourceCurriculum.forEach((subject) => {
    const newSubject = {
      ...subject,
      id: generateNewId(),
      effectivityYear: toYear,
    };
    curriculumData.push(newSubject);
  });

  showNotification(
    `Curriculum copied from ${fromYear} to ${toYear}!`,
    "success"
  );
}
```

### 3. Transition/Migration Rules

**For students switching curriculum versions:**

```javascript
// Curriculum equivalency mapping
const curriculumMapping = {
  2023: {
    CS101: "CS100", // CS101 in 2023 = CS100 in 2024
    MATH101: "MATH100",
  },
};

// When student shifts curriculum version
function migrateStudentCurriculum(studentId, fromYear, toYear) {
  // Check completed subjects
  // Map to equivalent subjects in new curriculum
  // Mark as credited
}
```

### 4. Sunset/Archive Old Curricula

**After students graduate:**

```javascript
function archiveCurriculum(effectivityYear) {
  // Check if any students still on this curriculum
  const activeStudents = students.filter(
    (s) => s.curriculumEffectivity === effectivityYear && s.status === "active"
  );

  if (activeStudents.length === 0) {
    // Safe to archive - no active students
    curriculumData
      .filter((c) => c.effectivityYear === effectivityYear)
      .forEach((c) => (c.status = "archived"));
  }
}
```

---

## 📋 Implementation Checklist

### Phase 1: Basic Versioning

- [ ] Add `effectivityYear` field to curriculum database
- [ ] Update curriculum form to include effectivity dropdown
- [ ] Add effectivity column to curriculum table
- [ ] Update save/edit functions to handle effectivity
- [ ] Add effectivity filter to views

### Phase 2: Display Updates

- [ ] Add effectivity selector to Program Roadmap
- [ ] Update filtering logic throughout system
- [ ] Add visual badges for curriculum status (old/current/upcoming)
- [ ] Update search to filter by effectivity

### Phase 3: Student Integration

- [ ] Add `curriculumEffectivity` field to student records
- [ ] Auto-assign effectivity on enrollment
- [ ] Filter curriculum views based on student's effectivity
- [ ] Update enrollment system to use correct curriculum version

### Phase 4: Course Offerings

- [ ] Link offerings to curriculum effectivity
- [ ] Allow multiple offerings for same subject (different versions)
- [ ] Show which curriculum version each offering serves

### Phase 5: Advanced Features

- [ ] Curriculum comparison tool
- [ ] Bulk copy function for new versions
- [ ] Curriculum transition/migration tools
- [ ] Archive old curricula when no longer needed

---

## 🎯 Best Practices

### 1. Naming Convention

Use clear naming for effectivity years:

```
✅ Good:
- "2023-2024"
- "2024-2025"

❌ Avoid:
- "v1", "v2" (not clear)
- "Old", "New" (ambiguous)
```

### 2. Default Behavior

Always show the **CURRENT** effectivity by default:

```javascript
// Default to current school year
const currentYear = new Date().getFullYear();
document.getElementById("filter-effectivity").value = currentYear;
```

### 3. Clear Communication

Add help text explaining effectivity:

```
💡 Effectivity Year: The school year when this curriculum
   takes effect. Students follow the curriculum version they
   enrolled under.
```

### 4. Data Integrity

Prevent accidental deletion:

```javascript
function deleteCurriculum(id) {
  const curriculum = curriculumData.find((c) => c.id === id);

  // Check if students are using this curriculum
  const hasStudents = students.some(
    (s) => s.curriculumEffectivity === curriculum.effectivityYear
  );

  if (hasStudents) {
    alert("Cannot delete! Students are enrolled under this curriculum.");
    return;
  }

  // Safe to delete
  // ...
}
```

---

## 📊 Example Data Structure

### Complete Example

```javascript
const curriculumData = [
  // 2023 Curriculum
  {
    id: 1,
    program: "BSCS",
    effectivityYear: "2023",
    year: 1,
    term: "1st Semester",
    subjectCode: "CS101",
    subjectName: "Introduction to Computing",
    units: 3,
    prerequisites: "None",
    status: "active",
  },
  {
    id: 2,
    program: "BSCS",
    effectivityYear: "2023",
    year: 1,
    term: "1st Semester",
    subjectCode: "MATH101",
    subjectName: "Calculus I",
    units: 3,
    prerequisites: "None",
    status: "active",
  },

  // 2024 Curriculum (NEW VERSION)
  {
    id: 101,
    program: "BSCS",
    effectivityYear: "2024", // NEW!
    year: 1,
    term: "1st Semester",
    subjectCode: "CS100", // Changed from CS101
    subjectName: "Fundamentals of Computing",
    units: 3,
    prerequisites: "None",
    status: "active",
  },
  {
    id: 102,
    program: "BSCS",
    effectivityYear: "2024", // NEW!
    year: 1,
    term: "1st Semester",
    subjectCode: "MATH100", // Changed from MATH101
    subjectName: "Advanced Calculus",
    units: 4, // Units increased!
    prerequisites: "None",
    status: "active",
  },
];
```

---

## 🎉 Benefits of Curriculum Versioning

### For Students

✅ **Stability:** Follow same curriculum throughout their program  
✅ **Clarity:** Know exactly what subjects to take  
✅ **Protection:** Not affected by mid-program changes

### For School

✅ **Flexibility:** Can update curriculum without disrupting current students  
✅ **Compliance:** Meets regulatory requirements  
✅ **Planning:** Clear view of which versions are active

### For System

✅ **Data Integrity:** Clean separation between versions  
✅ **Traceability:** Track which students follow which curriculum  
✅ **Historical Record:** Keep complete history of curriculum changes

---

## 🚀 Quick Implementation Code

### Minimal Working Implementation

**1. Update Curriculum Data:**

```javascript
// Add effectivityYear to all existing records
curriculumData.forEach((c) => {
  if (!c.effectivityYear) {
    c.effectivityYear = "2024"; // Default to current year
  }
});
```

**2. Add Filter:**

```html
<select id="filter-effectivity" onchange="filterByEffectivity()">
  <option value="2023">2023-2024</option>
  <option value="2024" selected>2024-2025 (Current)</option>
</select>
```

**3. Filter Function:**

```javascript
function filterByEffectivity() {
  const year = document.getElementById("filter-effectivity").value;
  const filtered = curriculumData.filter((c) => c.effectivityYear === year);
  renderCurriculumTable(filtered);
}
```

---

## 📚 Summary

### The Solution in Simple Terms

**Tagalog:**

```
Bawat curriculum may "Effectivity Year"
- 2023 Curriculum - para sa students na nag-enroll 2023
- 2024 Curriculum - para sa students na nag-enroll 2024

Kahit nag-change ang curriculum ngayon (2024),
ang 2023 students ay sumusunod pa rin sa 2023 curriculum nila.

Hindi sila affected ng changes!
```

**English:**

```
Each curriculum has an "Effectivity Year"
- 2023 Curriculum - for students who enrolled in 2023
- 2024 Curriculum - for students who enrolled in 2024

Even if the curriculum changes now (2024),
2023 students still follow their 2023 curriculum.

They are not affected by the changes!
```

---

**This ensures curriculum changes don't disrupt existing students! 🎓**

---

**Last Updated:** October 10, 2025  
**Recommended for Implementation:** High Priority  
**Complexity:** Medium  
**Impact:** Very High (Critical for academic integrity)
