# 🔗 COURSE OFFERINGS - Programs → Academic Terms → Subjects Connection

**Date:** January 2025  
**Status:** ✅ Complete  
**Author:** SKOLARIS Development Team

---

## 🎯 Purpose

The **COURSE_OFFERINGS** table creates the critical connection between:

- **PROGRAMS** (What degree program)
- **ACADEMIC_TERMS** (When it's offered)
- **SUBJECTS** (What course/subject)

This represents **actual course offerings** with faculty assignments and enrollment management.

---

## 🆚 Key Difference

### **DEFAULT_CURRICULUM vs COURSE_OFFERINGS**

| Aspect           | DEFAULT_CURRICULUM   | COURSE_OFFERINGS        |
| ---------------- | -------------------- | ----------------------- |
| **Purpose**      | Template / Plan      | Actual Offering         |
| **Scope**        | Program-wide         | Term-specific           |
| **Content**      | What SHOULD be taken | What IS being offered   |
| **Faculty**      | Not assigned         | Assigned                |
| **Slots**        | Not tracked          | Tracked (max/enrolled)  |
| **Availability** | Always active        | Can be enabled/disabled |
| **Updates**      | Rarely changes       | Changes per term        |

---

## 📊 Database Table Structure

```sql
CREATE TABLE course_offerings (
    offering_id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    term_id INT NOT NULL,
    subject_id INT NOT NULL,
    year_level INT NOT NULL CHECK (year_level BETWEEN 1 AND 6),
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 3),
    subject_type ENUM('Core', 'Major', 'Minor', 'Elective', 'GE', 'PE', 'NSTP') NOT NULL DEFAULT 'Core',
    max_slots INT DEFAULT 40,
    enrolled_count INT DEFAULT 0,
    faculty_id BIGINT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES academic_terms(term_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE SET NULL,
    UNIQUE KEY uk_course_offering (program_id, term_id, subject_id, year_level, semester),
    INDEX idx_offering_program (program_id),
    INDEX idx_offering_term (term_id),
    INDEX idx_offering_subject (subject_id),
    INDEX idx_offering_faculty (faculty_id),
    INDEX idx_offering_available (is_available)
);
```

---

## 🔗 Relationships

### **Complete Connection Flow:**

```
📚 PROGRAMS
    ↓ (program_id)
🔗 COURSE_OFFERINGS (Junction Table)
    ↓ (term_id)
📅 ACADEMIC_TERMS
    ↓ (subject_id)
📝 SUBJECTS
    ↓ (faculty_id)
👨‍🏫 FACULTY
```

### **Relationship Details:**

1. **PROGRAMS → COURSE_OFFERINGS** (One-to-Many)

   - Each program has multiple offerings across terms
   - `program_id` foreign key

2. **ACADEMIC_TERMS → COURSE_OFFERINGS** (One-to-Many)

   - Each term has multiple offerings
   - `term_id` foreign key

3. **SUBJECTS → COURSE_OFFERINGS** (One-to-Many)

   - Each subject can be offered multiple times
   - `subject_id` foreign key

4. **FACULTY → COURSE_OFFERINGS** (One-to-Many)
   - Each faculty teaches multiple offerings
   - `faculty_id` foreign key (nullable)

---

## 📋 Sample Data

### **Example 1: BSCS - 1st Semester 2025-2026**

```sql
-- Program: BS Computer Science (program_id = 1)
-- Term: 2025-2026 1st Semester (term_id = 1)

INSERT INTO course_offerings
(program_id, term_id, subject_id, year_level, semester, subject_type, max_slots, faculty_id, is_available)
VALUES
-- 1st Year, 1st Semester offerings
(1, 1, 1, 1, 1, 'Core', 40, 101, TRUE),      -- CS101 with Prof. Juan
(1, 1, 2, 1, 1, 'Core', 40, 102, TRUE),      -- MATH101 with Prof. Maria
(1, 1, 3, 1, 1, 'GE', 40, 103, TRUE),        -- ENG101 with Prof. Pedro
(1, 1, 4, 1, 1, 'PE', 50, 104, TRUE),        -- PE101 with Coach Anna
(1, 1, 5, 1, 1, 'NSTP', 40, 105, TRUE);      -- NSTP101 with Dr. Santos
```

### **Example 2: Query Course Offerings**

```sql
-- Get all offerings for BSCS in current term
SELECT
    p.program_name,
    at.term_code,
    s.subject_code,
    s.subject_name,
    f.full_name AS faculty,
    co.max_slots,
    co.enrolled_count,
    (co.max_slots - co.enrolled_count) AS available_slots,
    co.is_available
FROM course_offerings co
JOIN programs p ON co.program_id = p.program_id
JOIN academic_terms at ON co.term_id = at.term_id
JOIN subjects s ON co.subject_id = s.subject_id
LEFT JOIN faculty f ON co.faculty_id = f.faculty_id
WHERE p.program_code = 'BSCS'
  AND at.is_current = TRUE
  AND co.is_available = TRUE
ORDER BY co.year_level, co.semester, s.subject_code;
```

**Result:**

| Program | Term         | Subject                      | Faculty              | Max | Enrolled | Available | Status    |
| ------- | ------------ | ---------------------------- | -------------------- | --- | -------- | --------- | --------- |
| BSCS    | 2025-2026 1S | CS101 - Intro to Computing   | Prof. Juan Dela Cruz | 40  | 35       | 5         | Available |
| BSCS    | 2025-2026 1S | MATH101 - Calculus I         | Prof. Maria Santos   | 40  | 38       | 2         | Available |
| BSCS    | 2025-2026 1S | ENG101 - English I           | Prof. Pedro Reyes    | 40  | 40       | 0         | Full      |
| BSCS    | 2025-2026 1S | PE101 - Physical Education 1 | Coach Anna Cruz      | 50  | 45       | 5         | Available |
| BSCS    | 2025-2026 1S | NSTP101 - NSTP 1             | Dr. Juan Santos      | 40  | 35       | 5         | Available |

---

## 🎯 Use Cases

### **1. Student Enrollment**

```sql
-- Check if a subject is available for enrollment
SELECT
    co.offering_id,
    s.subject_name,
    f.full_name AS faculty,
    co.max_slots,
    co.enrolled_count,
    (co.max_slots - co.enrolled_count) AS slots_available
FROM course_offerings co
JOIN subjects s ON co.subject_id = s.subject_id
LEFT JOIN faculty f ON co.faculty_id = f.faculty_id
WHERE co.program_id = 1
  AND co.term_id = 1
  AND co.subject_id = 1
  AND co.is_available = TRUE
  AND (co.max_slots - co.enrolled_count) > 0;
```

### **2. Faculty Load Management**

```sql
-- Get faculty teaching load for current term
SELECT
    f.full_name,
    f.employee_number,
    COUNT(co.offering_id) AS subjects_teaching,
    SUM(s.units) AS total_units,
    SUM(co.enrolled_count) AS total_students
FROM faculty f
JOIN course_offerings co ON f.faculty_id = co.faculty_id
JOIN subjects s ON co.subject_id = s.subject_id
JOIN academic_terms at ON co.term_id = at.term_id
WHERE at.is_current = TRUE
  AND co.is_active = TRUE
GROUP BY f.faculty_id
ORDER BY total_units DESC;
```

### **3. Program Offerings Report**

```sql
-- Get all offerings per program for a specific term
SELECT
    p.program_name,
    co.year_level,
    co.semester,
    COUNT(co.offering_id) AS subjects_offered,
    SUM(co.max_slots) AS total_capacity,
    SUM(co.enrolled_count) AS total_enrolled,
    ROUND((SUM(co.enrolled_count) / SUM(co.max_slots)) * 100, 2) AS utilization_rate
FROM programs p
JOIN course_offerings co ON p.program_id = co.program_id
WHERE co.term_id = 1
  AND co.is_active = TRUE
GROUP BY p.program_id, co.year_level, co.semester
ORDER BY p.program_name, co.year_level, co.semester;
```

---

## 🔄 Workflow: From Template to Actual Offering

### **Step 1: Define DEFAULT_CURRICULUM (Once per Program)**

```sql
-- Admin defines the template curriculum for BSCS
INSERT INTO default_curriculum (program_id, subject_id, year_level, semester, term_type, subject_type)
VALUES (1, 1, 1, 1, '1st Semester', 'Core');  -- CS101 should be in 1st year, 1st sem
```

### **Step 2: Create COURSE_OFFERINGS (Per Term)**

```sql
-- At the start of 2025-2026 1st Semester, create actual offerings
INSERT INTO course_offerings (program_id, term_id, subject_id, year_level, semester, subject_type, faculty_id)
SELECT
    dc.program_id,
    1 AS term_id,  -- Current term
    dc.subject_id,
    dc.year_level,
    dc.semester,
    dc.subject_type,
    NULL AS faculty_id  -- To be assigned later
FROM default_curriculum dc
WHERE dc.program_id = 1
  AND dc.semester = 1
  AND dc.is_active = TRUE;
```

### **Step 3: Assign Faculty**

```sql
-- Assign faculty to offerings
UPDATE course_offerings
SET faculty_id = 101
WHERE offering_id = 1;  -- Assign Prof. Juan to CS101
```

### **Step 4: Open for Enrollment**

```sql
-- Enable enrollment
UPDATE course_offerings
SET is_available = TRUE
WHERE term_id = 1 AND program_id = 1;
```

---

## 📊 Reports & Analytics

### **1. Enrollment Statistics**

```sql
-- Enrollment rate per subject
SELECT
    s.subject_code,
    s.subject_name,
    co.max_slots,
    co.enrolled_count,
    ROUND((co.enrolled_count / co.max_slots) * 100, 2) AS fill_rate,
    CASE
        WHEN (co.max_slots - co.enrolled_count) = 0 THEN 'FULL'
        WHEN (co.max_slots - co.enrolled_count) <= 5 THEN 'NEARLY FULL'
        ELSE 'AVAILABLE'
    END AS status
FROM course_offerings co
JOIN subjects s ON co.subject_id = s.subject_id
WHERE co.term_id = 1
ORDER BY fill_rate DESC;
```

### **2. Faculty Workload**

```sql
-- Faculty teaching load distribution
SELECT
    f.full_name,
    d.department_name,
    COUNT(DISTINCT co.subject_id) AS unique_subjects,
    SUM(co.enrolled_count) AS total_students,
    SUM(s.units) AS total_units
FROM faculty f
JOIN departments d ON f.department_id = d.department_id
LEFT JOIN course_offerings co ON f.faculty_id = co.faculty_id
LEFT JOIN subjects s ON co.subject_id = s.subject_id
WHERE co.term_id = 1
GROUP BY f.faculty_id
HAVING total_units IS NOT NULL
ORDER BY total_units DESC;
```

---

## ✅ Benefits

### **1. Flexible Scheduling**

- Different faculty can teach same subject in different terms
- Adjust offerings based on demand

### **2. Capacity Management**

- Track enrollment vs. capacity in real-time
- Prevent over-enrollment
- Identify under-utilized offerings

### **3. Faculty Assignment**

- Assign and reassign faculty as needed
- Track teaching loads per term
- Balance workload distribution

### **4. Term-Specific Control**

- Enable/disable offerings per term
- Manage availability dynamically
- Handle special circumstances (faculty leave, room unavailable)

---

## 🎓 Complete Academic Flow

```
1. DEFAULT_CURRICULUM (Template)
   ↓
2. COURSE_OFFERINGS (Actual term-specific offerings)
   ↓
3. ENROLLMENTS (Student enrollment records)
   ↓
4. CLASS_SCHEDULES (Time and room assignments)
   ↓
5. STUDENT_GRADES (Assessment results)
```

---

## 📝 Summary

The **COURSE_OFFERINGS** table successfully connects:

✅ **PROGRAMS** → What degree program offers the course  
✅ **ACADEMIC_TERMS** → When the course is offered  
✅ **SUBJECTS** → What course/subject is being taught  
✅ **FACULTY** → Who teaches the course

This creates a complete, flexible, and manageable academic course offering system!

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Status:** ✅ Implemented and Documented

---

_The PROGRAMS → ACADEMIC_TERMS → SUBJECTS connection is now complete!_ 🔗
