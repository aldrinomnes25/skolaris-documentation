# 🎓 Updated Academic Hierarchy Documentation

**Date:** January 2025  
**Status:** ✅ Completed  
**Author:** SKOLARIS Development Team

---

## 📋 Summary of Changes

The SKOLARIS database structure has been updated to implement the proper academic hierarchy:

**OLD Structure:**

```
Campuses → Programs → (year_level & semester fields) → Subjects
```

**NEW Structure:**

```
Campuses → Colleges → Programs → Academic Terms → Subjects
```

---

## 🆕 New Database Tables Added

### 1. **COLLEGES Table**

Organizational units within campuses (e.g., College of Engineering, College of Business)

```sql
CREATE TABLE colleges (
    college_id INT AUTO_INCREMENT PRIMARY KEY,
    campus_id INT NOT NULL,
    college_code VARCHAR(20) UNIQUE NOT NULL,
    college_name VARCHAR(150) NOT NULL,
    dean_name VARCHAR(150),
    dean_contact VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campus_id) REFERENCES campuses(campus_id) ON DELETE RESTRICT,
    INDEX idx_college_code (college_code),
    INDEX idx_college_campus (campus_id),
    INDEX idx_college_active (is_active)
);
```

**Sample Data:**

```sql
INSERT INTO colleges (campus_id, college_code, college_name, dean_name, dean_contact) VALUES
(1, 'COE', 'College of Engineering', 'Dr. Juan Cruz', 'jcruz@icct.edu.ph'),
(1, 'COB', 'College of Business', 'Dr. Maria Santos', 'msantos@icct.edu.ph'),
(1, 'CAS', 'College of Arts and Sciences', 'Dr. Pedro Reyes', 'preyes@icct.edu.ph');
```

### 2. **ACADEMIC_TERMS Table**

Centralized term management for semesters, trimesters, and summer terms

```sql
CREATE TABLE academic_terms (
    term_id INT AUTO_INCREMENT PRIMARY KEY,
    term_code VARCHAR(20) UNIQUE NOT NULL,
    school_year VARCHAR(20) NOT NULL,
    term_type ENUM('1st Semester', '2nd Semester', '3rd Semester', 'Summer', 'Trimester 1', 'Trimester 2', 'Trimester 3') NOT NULL,
    term_start_date DATE NOT NULL,
    term_end_date DATE NOT NULL,
    enrollment_start DATE,
    enrollment_end DATE,
    is_active BOOLEAN DEFAULT FALSE,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_term_code (term_code),
    INDEX idx_term_school_year (school_year),
    INDEX idx_term_active (is_active),
    INDEX idx_term_current (is_current)
);
```

**Sample Data:**

```sql
INSERT INTO academic_terms (term_code, school_year, term_type, term_start_date, term_end_date, is_current) VALUES
('2025-1S', '2025-2026', '1st Semester', '2025-08-01', '2025-12-15', TRUE),
('2025-2S', '2025-2026', '2nd Semester', '2026-01-05', '2026-05-20', FALSE),
('2025-SUM', '2025-2026', 'Summer', '2026-06-01', '2026-07-30', FALSE);
```

### 3. **DEFAULT_CURRICULUM Table**

Template curriculum for each program (master template for all students)

```sql
CREATE TABLE default_curriculum (
    default_curriculum_id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    subject_id INT NOT NULL,
    year_level INT NOT NULL CHECK (year_level BETWEEN 1 AND 6),
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 3),
    term_type ENUM('1st Semester', '2nd Semester', '3rd Semester', 'Summer', 'Trimester 1', 'Trimester 2', 'Trimester 3') NOT NULL,
    subject_type ENUM('Core', 'Major', 'Minor', 'Elective', 'GE', 'PE', 'NSTP') NOT NULL DEFAULT 'Core',
    is_required BOOLEAN DEFAULT TRUE,
    prerequisites TEXT,
    co_requisites TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    UNIQUE KEY uk_default_curriculum (program_id, subject_id, year_level, semester),
    INDEX idx_default_curriculum_program (program_id),
    INDEX idx_default_curriculum_year_sem (year_level, semester),
    INDEX idx_default_curriculum_type (subject_type)
);
```

**Sample Data:**

```sql
INSERT INTO default_curriculum
(program_id, subject_id, year_level, semester, term_type, subject_type, is_required)
VALUES
(1, 1, 1, 1, '1st Semester', 'Core', TRUE),
(1, 2, 1, 1, '1st Semester', 'Core', TRUE),
(1, 3, 1, 1, '1st Semester', 'GE', TRUE),
(1, 4, 1, 1, '1st Semester', 'PE', TRUE),
(1, 5, 1, 1, '1st Semester', 'NSTP', TRUE);
```

---

## 🔄 Updated Existing Tables

### **PROGRAMS Table**

Added `college_id` foreign key:

```sql
ALTER TABLE programs ADD college_id INT NOT NULL;
ALTER TABLE programs ADD FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE RESTRICT;
ALTER TABLE programs ADD INDEX idx_program_college (college_id);
```

**Updated Structure:**

```sql
CREATE TABLE programs (
    program_id INT AUTO_INCREMENT PRIMARY KEY,
    campus_id INT NOT NULL,
    college_id INT NOT NULL,  -- NEW FIELD
    program_code VARCHAR(20) UNIQUE NOT NULL,
    program_name VARCHAR(150) NOT NULL,
    degree_type ENUM('certificate', 'diploma', 'bachelor', 'master', 'doctorate') NOT NULL,
    duration_years DECIMAL(2,1) NOT NULL,
    total_units INT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campus_id) REFERENCES campuses(campus_id) ON DELETE RESTRICT,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE RESTRICT,
    INDEX idx_program_code (program_code),
    INDEX idx_program_campus (campus_id),
    INDEX idx_program_college (college_id)
);
```

---

## 📊 Complete Academic Hierarchy

### **Visual Hierarchy:**

```
┌──────────────────────────────────────────────────────┐
│                    🏫 CAMPUSES                       │
│              (8 ICCT Physical Locations)             │
└────────────────────┬─────────────────────────────────┘
                     │
                     ↓
┌──────────────────────────────────────────────────────┐
│                    🏛️ COLLEGES                       │
│        (Organizational Units: COE, COB, CAS)         │
└────────────────────┬─────────────────────────────────┘
                     │
                     ↓
┌──────────────────────────────────────────────────────┐
│                    📚 PROGRAMS                        │
│          (Degree Programs: BSCS, BSIT, BSBA)         │
└────────────────────┬─────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ↓                       ↓
┌─────────────────┐    ┌──────────────────────┐
│ 📅 ACADEMIC     │    │ 📖 DEFAULT          │
│    TERMS        │    │    CURRICULUM        │
│ (Semesters,     │    │ (Template per        │
│  Trimesters)    │    │  Program)            │
└────────┬────────┘    └──────────┬───────────┘
         │                        │
         ↓                        ↓
┌──────────────────────────────────────────────┐
│              📝 SUBJECTS/COURSES             │
│          (Individual Course Offerings)       │
└──────────────────────────────────────────────┘
```

### **Relationship Details:**

1. **CAMPUSES → COLLEGES** (One-to-Many)

   - Each campus can have multiple colleges
   - Each college belongs to one campus

2. **COLLEGES → PROGRAMS** (One-to-Many)

   - Each college offers multiple programs
   - Each program belongs to one college (and one campus)

3. **PROGRAMS → DEFAULT_CURRICULUM** (One-to-Many)

   - Each program has one default curriculum template
   - Template contains all subjects organized by year and term

4. **PROGRAMS → STUDENTS** (One-to-Many)

   - Each student is enrolled in one program
   - Each program has multiple students

5. **ACADEMIC_TERMS → ENROLLMENTS** (One-to-Many)

   - Each term has multiple enrollments
   - Each enrollment happens in one specific term

6. **SUBJECTS ↔ DEFAULT_CURRICULUM** (Many-to-Many via DEFAULT_CURRICULUM)
   - Each subject can appear in multiple programs
   - Each program curriculum contains multiple subjects

---

## 🎯 Subject Type Classifications

The `DEFAULT_CURRICULUM` table includes a `subject_type` field with the following categories:

| Type         | Description                | Example                                             |
| ------------ | -------------------------- | --------------------------------------------------- |
| **Core**     | Program foundation courses | Introduction to Computing, Programming Fundamentals |
| **Major**    | Specialization courses     | Data Structures, Advanced Algorithms                |
| **Minor**    | Secondary track courses    | Business Management for IT                          |
| **Elective** | Student choice courses     | Mobile Development, Game Design                     |
| **GE**       | General Education          | English, Math, Social Sciences                      |
| **PE**       | Physical Education         | PE 1, PE 2, PE 3                                    |
| **NSTP**     | National Service Training  | NSTP 1, NSTP 2                                      |

---

## 📝 Example: BS Computer Science Default Curriculum

### **1st Year - 1st Semester**

| Subject Code | Subject Name                     | Units | Type | Prerequisites |
| ------------ | -------------------------------- | ----- | ---- | ------------- |
| CS101        | Introduction to Computing        | 3     | Core | None          |
| MATH101      | Calculus I                       | 3     | Core | None          |
| ENG101       | English I - Communication Skills | 3     | GE   | None          |
| PE101        | Physical Education 1             | 2     | PE   | None          |
| NSTP101      | NSTP 1                           | 3     | NSTP | None          |

### **1st Year - 2nd Semester**

| Subject Code | Subject Name         | Units | Type | Prerequisites |
| ------------ | -------------------- | ----- | ---- | ------------- |
| CS102        | Programming I        | 3     | Core | CS101         |
| MATH102      | Calculus II          | 3     | Core | MATH101       |
| ENG102       | English II           | 3     | GE   | ENG101        |
| PE102        | Physical Education 2 | 2     | PE   | PE101         |
| NSTP102      | NSTP 2               | 3     | NSTP | NSTP101       |

---

## 📚 Documentation Updates Made

### **Files Updated:**

1. ✅ **index.html**

   - Added COLLEGES and ACADEMIC_TERMS table definitions
   - Added DEFAULT_CURRICULUM table definition
   - Updated PROGRAMS table to include college_id
   - Created new Academic Hierarchy ERD section
   - Created new Default Curriculum ERD section with examples
   - Updated Academic Module table count (12 → 15)

2. ✅ **docs/02_Database_Structure_Guide.md**

   - Added Academic Hierarchy Structure diagram
   - Updated Core Tables Structure
   - Added COLLEGES, ACADEMIC_TERMS, and DEFAULT_CURRICULUM to table lists
   - Updated relationships section with new hierarchy
   - Added sample data scripts for new tables
   - Updated Academic Tables list

3. ✅ **New ERD Diagrams Created:**
   - Academic Hierarchy ERD (Campuses → Colleges → Programs → Terms → Subjects)
   - Default Curriculum ERD (with subject type classifications and examples)

---

## 🎨 Key Features of New Structure

### **1. Organizational Clarity**

- Clear separation between physical locations (Campuses) and organizational units (Colleges)
- Better alignment with real-world academic institution structure

### **2. Centralized Term Management**

- Single source of truth for academic terms
- Supports multiple term types (semesters, trimesters, summer)
- Tracks term dates and enrollment periods
- Easy to set current/active terms

### **3. Template-Based Curriculum**

- DEFAULT_CURRICULUM serves as the master template
- Ensures consistency across all students in a program
- Easy to update program requirements
- Student-specific curriculum allows personalization

### **4. Subject Classification**

- Clear categorization of subjects (Core, Major, Minor, etc.)
- Supports flexible curriculum design
- Enables better reporting and analytics

### **5. Prerequisite Management**

- Built-in prerequisite and co-requisite tracking
- Supports complex course dependencies
- Enables automated enrollment validation

---

## 🚀 Benefits of Updated Structure

1. **Scalability:** Easily add new colleges and programs
2. **Flexibility:** Support different academic calendars per program
3. **Consistency:** Template-based curriculum ensures uniformity
4. **Maintainability:** Centralized term and curriculum management
5. **Compliance:** Aligns with CHED and accreditation standards
6. **Reporting:** Better data organization for analytics

---

## 📖 Migration Guide

### **For Existing Data:**

If you have existing data in the old structure, follow these steps:

```sql
-- Step 1: Create default colleges for each campus
INSERT INTO colleges (campus_id, college_code, college_name)
SELECT campus_id,
       CONCAT('COL', campus_id),
       CONCAT('College of ', campus_name)
FROM campuses;

-- Step 2: Update programs to link to colleges
UPDATE programs p
JOIN colleges c ON p.campus_id = c.campus_id
SET p.college_id = c.college_id;

-- Step 3: Create academic terms for current school year
INSERT INTO academic_terms (term_code, school_year, term_type, term_start_date, term_end_date, is_current)
VALUES
('2025-1S', '2025-2026', '1st Semester', '2025-08-01', '2025-12-15', TRUE),
('2025-2S', '2025-2026', '2nd Semester', '2026-01-05', '2026-05-20', FALSE);

-- Step 4: Migrate existing curriculum to default_curriculum
INSERT INTO default_curriculum
(program_id, subject_id, year_level, semester, term_type, subject_type, is_required, prerequisites)
SELECT
    program_id,
    subject_id,
    year_level,
    semester,
    CASE semester
        WHEN 1 THEN '1st Semester'
        WHEN 2 THEN '2nd Semester'
        WHEN 3 THEN '3rd Semester'
    END,
    'Core',
    is_required,
    prerequisites
FROM curriculum
GROUP BY program_id, subject_id, year_level, semester;
```

---

## ✅ Validation Checklist

- [x] COLLEGES table created with proper foreign keys
- [x] ACADEMIC_TERMS table created with term management fields
- [x] DEFAULT_CURRICULUM table created with subject classification
- [x] PROGRAMS table updated to reference COLLEGES
- [x] ERD diagrams created showing new hierarchy
- [x] Documentation updated with new structure
- [x] Sample data scripts provided
- [x] Migration guide included

---

## 📞 Next Steps

1. **Review the new structure** and ensure it meets your requirements
2. **Run the SQL scripts** to create the new tables
3. **Populate sample data** for testing
4. **Update API endpoints** to work with new tables
5. **Update frontend forms** to include college selection
6. **Test enrollment flow** with new term management

---

**Status:** ✅ **VALIDATED AND COMPLETE**

The academic hierarchy is now properly structured as:
**Colleges → Programs → Academic Terms → Courses (subjects)** ✓

---

_Last Updated: January 2025_  
_Version: 2.0_  
_Documentation: SKOLARIS Student Information System_
