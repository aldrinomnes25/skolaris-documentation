# 🔍 Database Documentation vs Backend Implementation - Discrepancy Report

**Date**: January 10, 2025  
**Status**: Critical - Major Differences Found  
**Action Required**: Update documentation to match actual backend implementation

---

## 📊 Executive Summary

After comparing the documentation in `index.html` and `docs/02_Database_Structure_Guide.md` with the actual backend database migrations in `/Users/aldrincruzomnes/SKOLARIS/skolaris-be/database/migrations/`, **significant discrepancies were found**. The documentation describes tables and relationships that **DO NOT EXIST** in the backend code.

### Critical Issues Summary:

- **3 Major Tables Missing**: `academic_terms`, `default_curriculum`, `course_offerings` documented but NOT in backend
- **Structural Differences**: Key foreign key relationships differ between docs and backend
- **Field Mismatches**: Several tables have different field names and types
- **49 Tables Documented vs ~48 Tables in Backend**: Count discrepancy

---

## 🚨 CRITICAL: Missing Tables in Backend

These tables are extensively documented but **DO NOT EXIST** in the actual backend:

### 1. ❌ `academic_terms` Table - MISSING

**Documentation Claims:**

- Centralized term management table
- Fields: `term_id`, `term_code`, `school_year`, `term_type`, `term_start_date`, `term_end_date`, `is_current`
- Used to manage semesters, trimesters, summer terms

**Backend Reality:**

- ❌ **NO MIGRATION FILE EXISTS**
- ❌ Table is NOT created in backend
- Impact: All documentation showing `academic_terms` connections is **INCORRECT**

### 2. ❌ `default_curriculum` Table - MISSING

**Documentation Claims:**

- Template curriculum table per program
- Fields: `default_curriculum_id`, `program_id`, `subject_id`, `year_level`, `semester`, `term_type`, `subject_type`, `prerequisites`, `co_requisites`
- Separate from student-specific `curriculum` table

**Backend Reality:**

- ❌ **NO MIGRATION FILE EXISTS**
- ❌ Table is NOT created in backend
- Only `curriculum` table exists (singular, not separate default vs student-specific)
- Impact: Entire curriculum management architecture documented is **INCORRECT**

### 3. ❌ `course_offerings` Table - MISSING

**Documentation Claims:**

- Bridge table connecting programs, terms, and subjects
- Fields: `offering_id`, `program_id`, `term_id`, `subject_id`, `faculty_id`, `max_slots`, `enrolled_count`
- Critical for term-based course scheduling

**Backend Reality:**

- ❌ **NO MIGRATION FILE EXISTS**
- ❌ Table is NOT created in backend
- Impact: Course offerings management system documented is **INCORRECT**

### 4. ❌ `enrollments` Table - MISSING (Partially)

**Documentation Claims:**

- Student course enrollment tracking

**Backend Reality:**

- ❌ No dedicated `enrollments` table
- ✅ Has `student_sections` table instead (different structure)
- Partial functionality but different implementation

---

## ⚠️ Major Structural Differences

### 1. 🏛️ Programs Table - MISSING `college_id`

**Documentation Shows:**

```sql
programs:
  - program_id (PK)
  - campus_id (FK)
  - college_id (FK)  ← DOCUMENTED
  - program_code
  - program_name
```

**Backend Reality:**

```sql
programs:
  - program_id (PK)
  - campus_id (FK)
  - college_id ← ❌ DOES NOT EXIST
  - program_code
  - program_name
```

**Impact:**

- Documentation shows hierarchy: `CAMPUSES → COLLEGES → PROGRAMS`
- Backend reality: `CAMPUSES → PROGRAMS` (direct link, no colleges in between)
- **All ERD diagrams showing colleges → programs relationship are INCORRECT**

---

### 2. 🏛️ Colleges Table - Different Structure

**Documentation Shows:**

```sql
colleges:
  - college_id (PK)
  - campus_id (FK)
  - college_code
  - college_name
  - dean_name (VARCHAR)  ← Text field
  - dean_contact (VARCHAR)
```

**Backend Reality:**

```sql
colleges:
  - college_id (PK)
  - campus_id (FK)
  - college_code
  - college_name
  - head_employee_id (FK) ← Foreign key to employees
  - description
  - is_active
```

**Differences:**

- ❌ `dean_name` and `dean_contact` do NOT exist
- ✅ Uses `head_employee_id` as FK to `employees` table instead
- ✅ Has additional `description` and `is_active` fields

---

### 3. 👥 Users Table - Different Fields

**Documentation Shows:**

```sql
users:
  - user_id (PK)
  - campus_id (FK)
  - email
  - phone
  - password_hash
  - full_name
  - user_type
  - student_id (TEXT)      ← Documented as field in users
  - employee_number (TEXT) ← Documented as field in users
```

**Backend Reality:**

```sql
users:
  - user_id (PK)
  - campus_id (FK)
  - email
  - phone
  - password_hash
  - full_name
  - user_type
  ❌ NO student_id field
  ❌ NO employee_number field
```

**Separate Tables Exist:**

```sql
students:
  - student_id (PK)
  - user_id (FK)
  - student_number ← This is in students table, not users

employees:
  - employee_id (PK)
  - user_id (FK)
  - employee_number ← This is in employees table, not users
```

---

### 4. 📝 Subjects Table - Different Enum Values

**Documentation Shows:**

```sql
subjects:
  - type ENUM('lecture', 'laboratory', 'practicum')
```

**Backend Reality:**

```sql
subjects:
  - type ENUM('lecture', 'laboratory', 'lecture_lab', 'practicum', 'thesis')
```

**Differences:**

- ✅ Has additional `lecture_lab` option
- ✅ Has additional `thesis` option

---

### 5. ⏰ Class Schedules Table - Room Field Type

**Documentation Shows:**

```sql
class_schedules:
  - schedule_id (PK)
  - section_id (FK)
  - subject_id (FK)
  - room_id (FK) ← Foreign key to rooms table
  - day
  - start_time
  - end_time
```

**Backend Reality:**

```sql
class_schedules:
  - schedule_id (PK)
  - section_id (FK)
  - subject_id (FK)
  - room VARCHAR(20) ← Simple string field, NOT a foreign key
  - day
  - start_time
  - end_time
  - employee_id (FK)
```

**Differences:**

- ❌ `room_id` as FK does NOT exist
- ✅ `room` is just a string field
- ✅ Has `employee_id` FK (not shown in docs)

---

### 6. 📊 Grades Table - Different Structure

**Documentation Shows:**

```sql
grades / student_grades:
  - grade_id (PK)
  - student_id (FK)
  - subject_id (FK) ← Links to subjects
  - prelim (grade)
  - midterm (grade)
  - final (grade)
  - final_grade
  - status
```

**Backend Reality:**

```sql
grades:
  - grade_id (PK)
  - student_id (FK)
  - schedule_id (FK) ← Links to class_schedules, NOT subjects
  - school_year
  - semester
  - midterm_grade
  - final_grade
  - remarks_grade ← Additional field
  - status
  ❌ NO prelim_grade field
```

**Differences:**

- Links to `schedule_id` instead of `subject_id`
- No `prelim` grade field
- Has `remarks_grade` instead

---

## 📋 Complete Table Inventory Comparison

### Tables in Documentation but NOT in Backend:

1. ❌ `academic_terms`
2. ❌ `default_curriculum`
3. ❌ `course_offerings`
4. ❌ `enrollments` (has `student_sections` instead)
5. ❌ `transactions` (mentioned in docs, not in migrations)

### Tables in Backend but NOT Documented:

1. ✅ `student_personal_information`
2. ✅ `student_educational_background`
3. ✅ `student_family_information`
4. ✅ `student_addresses`
5. ✅ `student_contact_information`
6. ✅ `student_sections` (replaces enrollments)
7. ✅ `student_assessments`
8. ✅ `assessment_details`
9. ✅ `fee_structures`
10. ✅ `payment_installments`
11. ✅ `employee_load` (faculty load)
12. ✅ `assignments`
13. ✅ `books`
14. ✅ `book_borrows`
15. ✅ `attendance_records`
16. ✅ `grade_components`
17. ✅ `student_grade_components`
18. ✅ `scholarships`
19. ✅ `health_requirements`
20. ✅ `student_health_status`
21. ✅ `clearance_requirements`
22. ✅ `student_clearances`
23. ✅ `graduation_applications`
24. ✅ `transcripts`
25. ✅ `rooms`
26. ✅ `user_sessions`
27. ✅ `auth_logs`
28. ✅ `system_modules`
29. ✅ `role_module_access`
30. ✅ `sessions` (Laravel default)

---

## 🎯 Key Relationship Discrepancies

### Academic Hierarchy (Documented):

```
CAMPUSES → COLLEGES → PROGRAMS → ACADEMIC_TERMS → SUBJECTS
```

### Academic Hierarchy (Backend Reality):

```
CAMPUSES → PROGRAMS → SUBJECTS
(colleges exist but programs don't link to them)
(academic_terms doesn't exist)
```

---

## 📝 Recommendations

### Immediate Actions Required:

1. **Update ERD Diagrams**

   - Remove `academic_terms` from all diagrams
   - Remove `default_curriculum` from all diagrams
   - Remove `course_offerings` from all diagrams
   - Fix programs table to show NO `college_id`
   - Fix colleges → programs relationship (broken)

2. **Update Documentation Files**

   - `/docs/02_Database_Structure_Guide.md`
   - `/index.html` database section (lines 3168-5000+)
   - All curriculum management documentation
   - All academic hierarchy documentation

3. **Clarify Academic Structure**

   - Document actual relationship between colleges and programs
   - If colleges are isolated from programs, explain why
   - Document how academic terms are actually managed (using school_year/semester fields)

4. **Add Missing Tables Documentation**

   - Document 30+ tables that exist in backend but aren't in docs
   - Create comprehensive student information tables documentation
   - Document all support tables (assessments, clearances, etc.)

5. **Verify Implementation Strategy**
   - Decide if missing tables should be ADDED to backend
   - OR if documentation should be UPDATED to match backend
   - Coordinate with development team on intended design

---

## 🔄 Next Steps

**OPTION A: Update Backend to Match Documentation**

- Create migrations for `academic_terms`, `default_curriculum`, `course_offerings`
- Add `college_id` to programs table
- Implement documented academic hierarchy
- Estimated effort: 3-5 days development + testing

**OPTION B: Update Documentation to Match Backend** ⭐ **RECOMMENDED**

- Remove references to missing tables
- Update all ERD diagrams
- Document actual implementation
- Add documentation for undocumented tables
- Estimated effort: 1-2 days documentation work

---

## 📞 Questions for Development Team

1. **Academic Terms**: How are semesters/trimesters currently managed without `academic_terms` table?
2. **Default Curriculum**: How is program curriculum templating handled without this table?
3. **Colleges → Programs**: Is the missing `college_id` in programs intentional?
4. **Course Offerings**: How are term-based course offerings managed?

---

**Report Generated**: January 10, 2025  
**Comparison Source**:

- Documentation: `/Users/aldrincruzomnes/Documentation/skolaris-documentation/`
- Backend Code: `/Users/aldrincruzomnes/SKOLARIS/skolaris-be/database/migrations/`

**Prepared for**: SKOLARIS Development Team  
**Priority**: 🔴 CRITICAL - Requires immediate attention
