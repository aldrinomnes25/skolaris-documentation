# 🗄️ Database Structure & SQL Scripts - User Guide

## Overview

The Database Structure section contains the complete database schema, entity relationships, and ready-to-use SQL scripts for the SKOLARIS Student Information System.

## ⚠️ Implementation Status

> **Important Note**: This documentation describes both **currently implemented** tables and **planned features**. Please note the following:
>
> - ✅ **IMPLEMENTED**: Tables that exist in the current backend (`skolaris-be/database/migrations`)
> - 🔜 **PLANNED**: Tables and features planned for future implementation
>
> ### Planned Features (Not Yet Implemented):
>
> - `academic_terms` table - Centralized term management system
> - `default_curriculum` table - Template curriculum per program
> - `course_offerings` table - Course offerings bridge table
>
> ### Current Implementation Notes:
>
> - `programs` table does not yet have `college_id` foreign key (planned for future)
> - `colleges` table uses `head_employee_id` (FK) instead of `dean_name` text field
> - `users` table does not store `student_id` or `employee_number` (these are in separate `students` and `employees` tables)
> - `class_schedules` uses `room` as VARCHAR field, not `room_id` foreign key
> - `grades` table links to `schedule_id`, not `subject_id` directly
>
> For a complete list of currently implemented tables, see the **Currently Implemented Backend Tables** section below.

---

## 🎯 What You'll Find Here

### **Database Schema**

- Complete database design with 40+ tables
- Entity relationship diagrams
- Data validation rules and constraints
- Multi-campus data management structure

### **SQL Scripts**

- Ready-to-use database creation scripts
- Sample data insertion scripts
- Migration and update scripts
- Backup and recovery procedures

---

## 📋 How to Use This Section

### **Step 1: Understand the Database Design**

1. Review the entity relationship diagram
2. Understand table relationships and dependencies
3. Check data types and constraints
4. Review multi-campus data structure

### **Step 2: Set Up the Database**

1. Use the provided SQL scripts to create the database
2. Run sample data scripts for testing
3. Configure database settings for your environment
4. Set up backup and recovery procedures

### **Step 3: Reference During Development**

1. Use table structures for API development
2. Reference relationships for data queries
3. Check constraints for data validation
4. Use as documentation for database operations

---

## 🗄️ Database Architecture

### **Academic Hierarchy Structure**

The SKOLARIS database follows a clear academic hierarchy:

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

### **Core Tables Structure**

The database is organized into logical groups:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Tables   │    │  Academic Tables│    │  System Tables  │
│                 │    │                 │    │                 │
│ • users         │    │ • campuses      │    │ • settings      │
│ • roles         │    │ • colleges      │    │ • logs          │
│ • permissions   │    │ • programs      │    │ • audit_logs    │
│                 │    │ • academic_terms│    │                 │
│                 │    │ • students      │    │                 │
│                 │    │ • default_curric│    │                 │
│                 │    │ • curriculum    │    │                 │
│                 │    │ • subjects      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Financial Tables│    │  Medical Tables │    │  Scheduling     │
│                 │    │                 │    │                 │
│ • payments      │    │ • medical_records│   │ • sections      │
│ • fees          │    │ • clinic_visits │    │ • schedules     │
│ • transactions  │    │ • health_status │    │ • enrollments   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Key Table Categories**

#### **1. User Management Tables**

- `users`: User accounts and authentication
- `roles`: User roles and permissions
- `permissions`: System permissions
- `user_roles`: Role assignments

#### **2. Academic Tables**

- `campuses`: Campus locations (8 ICCT campuses)
- `colleges`: Organizational units within campuses
- `programs`: Academic programs offered by colleges
- `academic_terms`: Centralized term management (semesters, trimesters)
- `students`: Student information
- `default_curriculum`: Template curriculum per program
- `curriculum`: Student-specific curriculum
- `subjects`: Subject/course catalog
- `enrollments`: Student course enrollments
- `grades`: Academic grades
- `schedules`: Class schedules

#### **3. Financial Tables**

- `payments`: Payment records
- `fees`: Fee structure
- `transactions`: Financial transactions
- `payment_methods`: Payment options

#### **4. Medical Tables**

- `medical_records`: Student health records
- `clinic_visits`: Clinic visit logs
- `health_status`: Health monitoring
- `medical_documents`: Health documents

#### **5. System Tables**

- `campuses`: Campus information
- `settings`: System configuration
- `logs`: System logs
- `audit_logs`: Audit trail

---

## 💾 SQL Scripts

### **Database Creation Scripts**

#### **1. Main Database Creation**

```sql
-- Create database
CREATE DATABASE skolaris_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use database
USE skolaris_db;

-- Create all tables
-- [Complete table creation scripts provided]
```

#### **2. Table Creation Order**

1. **System Tables**: campuses, settings, roles, permissions
2. **User Tables**: users, user_roles
3. **Academic Tables**: courses, subjects, students
4. **Enrollment Tables**: enrollments, schedules
5. **Financial Tables**: fees, payments, transactions
6. **Medical Tables**: medical_records, clinic_visits
7. **Audit Tables**: audit_logs, system_logs

### **Sample Data Scripts**

#### **1. Campus Data**

```sql
-- Insert campus information
INSERT INTO campuses (name, code, address, contact_info) VALUES
('ICCT Main Campus', 'MAIN', 'Main Campus Address', 'contact@icct.edu.ph'),
('ICCT Branch 1', 'BR1', 'Branch 1 Address', 'branch1@icct.edu.ph');
```

#### **2. User Roles**

```sql
-- Insert default roles
INSERT INTO roles (name, description) VALUES
('Super Admin', 'Full system access'),
('Campus Admin', 'Campus-level administration'),
('Faculty', 'Teaching staff'),
('Student', 'Student user');
```

#### **3. Sample Colleges**

```sql
-- Insert college information
INSERT INTO colleges (campus_id, college_code, college_name, dean_name, dean_contact) VALUES
(1, 'COE', 'College of Engineering', 'Dr. Juan Cruz', 'jcruz@icct.edu.ph'),
(1, 'COB', 'College of Business', 'Dr. Maria Santos', 'msantos@icct.edu.ph'),
(1, 'CAS', 'College of Arts and Sciences', 'Dr. Pedro Reyes', 'preyes@icct.edu.ph');
```

#### **4. Sample Academic Terms**

```sql
-- Insert academic terms
INSERT INTO academic_terms (term_code, school_year, term_type, term_start_date, term_end_date, is_current) VALUES
('2025-1S', '2025-2026', '1st Semester', '2025-08-01', '2025-12-15', TRUE),
('2025-2S', '2025-2026', '2nd Semester', '2026-01-05', '2026-05-20', FALSE),
('2025-SUM', '2025-2026', 'Summer', '2026-06-01', '2026-07-30', FALSE);
```

#### **5. Sample Programs**

```sql
-- Insert sample programs
INSERT INTO programs (campus_id, college_id, program_code, program_name, degree_type, duration_years, total_units) VALUES
(1, 1, 'BSCS', 'Bachelor of Science in Computer Science', 'bachelor', 4.0, 180),
(1, 1, 'BSIT', 'Bachelor of Science in Information Technology', 'bachelor', 4.0, 180),
(1, 2, 'BSBA', 'Bachelor of Science in Business Administration', 'bachelor', 4.0, 165);
```

#### **6. Sample Subjects**

```sql
-- Insert sample subjects
INSERT INTO subjects (subject_code, subject_name, units, type) VALUES
('CS101', 'Introduction to Computing', 3, 'lecture'),
('MATH101', 'Calculus I', 3, 'lecture'),
('ENG101', 'English I - Communication Skills', 3, 'lecture'),
('PE101', 'Physical Education 1', 2, 'lab'),
('NSTP101', 'National Service Training Program 1', 3, 'lab');
```

#### **7. Sample Default Curriculum**

```sql
-- Insert default curriculum for BS Computer Science
INSERT INTO default_curriculum
(program_id, subject_id, year_level, semester, term_type, subject_type, is_required)
VALUES
(1, 1, 1, 1, '1st Semester', 'Core', TRUE),
(1, 2, 1, 1, '1st Semester', 'Core', TRUE),
(1, 3, 1, 1, '1st Semester', 'GE', TRUE),
(1, 4, 1, 1, '1st Semester', 'PE', TRUE),
(1, 5, 1, 1, '1st Semester', 'NSTP', TRUE);
```

### **Migration Scripts**

#### **1. Database Updates**

```sql
-- Add new columns
ALTER TABLE students ADD COLUMN emergency_contact VARCHAR(255);

-- Modify existing columns
ALTER TABLE courses MODIFY COLUMN credits DECIMAL(3,1);

-- Add new tables
CREATE TABLE new_feature_table (
    id INT PRIMARY KEY AUTO_INCREMENT,
    -- column definitions
);
```

#### **2. Data Migration**

```sql
-- Migrate data between tables
INSERT INTO new_table (column1, column2)
SELECT old_column1, old_column2 FROM old_table;

-- Update existing data
UPDATE students SET status = 'active' WHERE status IS NULL;
```

---

## 🔧 Database Configuration

### **MySQL Configuration**

#### **1. Basic Settings**

```ini
[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
default-storage-engine=InnoDB
innodb-buffer-pool-size=1G
max-connections=200
```

#### **2. Performance Optimization**

```sql
-- Optimize tables
OPTIMIZE TABLE students, courses, enrollments;

-- Create indexes
CREATE INDEX idx_student_id ON enrollments(student_id);
CREATE INDEX idx_course_id ON enrollments(course_id);
CREATE INDEX idx_user_email ON users(email);
```

### **Backup and Recovery**

#### **1. Database Backup**

```bash
# Full database backup
mysqldump -u username -p skolaris_db > skolaris_backup.sql

# Specific table backup
mysqldump -u username -p skolaris_db students courses > academic_data.sql
```

#### **2. Database Recovery**

```bash
# Restore from backup
mysql -u username -p skolaris_db < skolaris_backup.sql

# Restore specific tables
mysql -u username -p skolaris_db < academic_data.sql
```

---

## 📊 Data Relationships

### **Key Relationships**

#### **1. User Relationships**

```
users (1) ──── (many) user_roles
roles (1) ──── (many) user_roles
users (1) ──── (1) students
users (1) ──── (1) faculty
```

#### **2. Academic Hierarchy Relationships**

```
campuses (1) ──── (many) colleges
colleges (1) ──── (many) programs
programs (1) ──── (many) students
programs (1) ──── (many) default_curriculum
academic_terms (1) ──── (many) enrollments
```

#### **3. Academic Operational Relationships**

```
students (1) ──── (many) enrollments
programs (1) ──── (many) curriculum
subjects (1) ──── (many) default_curriculum
subjects (1) ──── (many) curriculum
subjects (1) ──── (many) schedules
faculty (1) ──── (many) schedules
```

#### **3. Financial Relationships**

```
students (1) ──── (many) payments
fees (1) ──── (many) payments
payments (1) ──── (many) transactions
```

### **Foreign Key Constraints**

#### **1. Academic Constraints**

```sql
-- Enrollment constraints
ALTER TABLE enrollments
ADD CONSTRAINT fk_enrollment_student
FOREIGN KEY (student_id) REFERENCES students(id);

ALTER TABLE enrollments
ADD CONSTRAINT fk_enrollment_course
FOREIGN KEY (course_id) REFERENCES courses(id);
```

#### **2. User Constraints**

```sql
-- User role constraints
ALTER TABLE user_roles
ADD CONSTRAINT fk_user_role_user
FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE user_roles
ADD CONSTRAINT fk_user_role_role
FOREIGN KEY (role_id) REFERENCES roles(id);
```

---

## 🔒 Data Security

### **Access Control**

#### **1. User Permissions**

```sql
-- Create database user
CREATE USER 'skolaris_user'@'localhost' IDENTIFIED BY 'secure_password';

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON skolaris_db.* TO 'skolaris_user'@'localhost';

-- Revoke unnecessary permissions
REVOKE DROP, CREATE, ALTER ON skolaris_db.* FROM 'skolaris_user'@'localhost';
```

#### **2. Data Encryption**

```sql
-- Encrypt sensitive data
ALTER TABLE students
MODIFY COLUMN ssn VARBINARY(255);

-- Update with encrypted data
UPDATE students SET ssn = AES_ENCRYPT('123-45-6789', 'encryption_key');
```

### **Audit Trail**

#### **1. Audit Logging**

```sql
-- Create audit trigger
DELIMITER $$
CREATE TRIGGER audit_student_changes
AFTER UPDATE ON students
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (table_name, action, old_values, new_values, user_id, timestamp)
    VALUES ('students', 'UPDATE', OLD.id, NEW.id, @current_user_id, NOW());
END$$
DELIMITER ;
```

---

## 🎯 Best Practices

### **For Database Administrators**

1. **Regular Backups**: Schedule daily backups
2. **Performance Monitoring**: Monitor query performance
3. **Security Updates**: Keep database software updated
4. **Access Control**: Implement proper user permissions

### **For Developers**

1. **Use Indexes**: Create appropriate indexes for queries
2. **Optimize Queries**: Write efficient SQL queries
3. **Handle Errors**: Implement proper error handling
4. **Data Validation**: Validate data before database operations

### **For System Administrators**

1. **Monitor Resources**: Monitor database server resources
2. **Backup Strategy**: Implement comprehensive backup strategy
3. **Disaster Recovery**: Plan for disaster recovery scenarios
4. **Security Hardening**: Implement security best practices

---

## 🚨 Troubleshooting

### **Common Issues**

**Q: Database connection fails**

- Check MySQL service status
- Verify connection credentials
- Check firewall settings
- Ensure database exists

**Q: Foreign key constraint errors**

- Check referenced table data
- Verify foreign key relationships
- Check data types match
- Ensure referenced records exist

**Q: Performance issues**

- Check query execution plans
- Add appropriate indexes
- Optimize slow queries
- Monitor server resources

**Q: Data corruption**

- Restore from backup
- Check disk space
- Verify hardware integrity
- Run database repair tools

---

## 📈 Performance Optimization

### **Query Optimization**

```sql
-- Use EXPLAIN to analyze queries
EXPLAIN SELECT * FROM students WHERE campus_id = 1;

-- Add indexes for frequently queried columns
CREATE INDEX idx_student_campus ON students(campus_id);

-- Use LIMIT for large result sets
SELECT * FROM students LIMIT 100;
```

### **Database Maintenance**

```sql
-- Analyze table statistics
ANALYZE TABLE students, courses, enrollments;

-- Check table integrity
CHECK TABLE students, courses, enrollments;

-- Repair tables if needed
REPAIR TABLE students, courses, enrollments;
```

---

## 🔗 Related Sections

### **Next Steps After Database Structure**

1. **SQL Scripts**: Use the provided scripts to set up your database
2. **Development Tasks**: Reference table structures during development
3. **Progress Tracker**: Monitor database implementation progress
4. **Security Guide**: Implement database security measures

### **Cross-References**

- Development Tasks use the database schema
- Security Guide covers database security
- Progress Tracker monitors database implementation
- Implementation Roadmap includes database milestones

---

## ✅ Currently Implemented Backend Tables

This section lists all tables that are **currently implemented** in the backend Laravel application (`skolaris-be/database/migrations`).

### **Core System Tables** (10 tables)

| Table Name           | Purpose                    | Key Fields                                                                      |
| -------------------- | -------------------------- | ------------------------------------------------------------------------------- |
| `campuses`           | 8 ICCT physical locations  | `campus_id`, `campus_code`, `campus_name`, `address`, `phone`, `email`          |
| `users`              | Base user authentication   | `user_id`, `campus_id` (FK), `email`, `password_hash`, `full_name`, `user_type` |
| `roles`              | User roles & permissions   | `role_id`, `role_name`, `role_level`, `is_global`, `campus_id`                  |
| `permissions`        | Granular permission system | `permission_id`, `module`, `action`, `resource`                                 |
| `user_roles`         | User-role assignments      | `user_id` (FK), `role_id` (FK), `campus_id` (FK)                                |
| `role_permissions`   | Role-permission mapping    | `role_id` (FK), `permission_id` (FK)                                            |
| `system_modules`     | System module definitions  | `module_id`, `module_name`, `description`                                       |
| `role_module_access` | Module access control      | `role_id` (FK), `module_id` (FK)                                                |
| `audit_logs`         | System audit trail         | `log_id`, `table_name`, `action`, `user_id`, `timestamp`                        |
| `auth_logs`          | Authentication logging     | `log_id`, `user_id`, `action`, `ip_address`, `timestamp`                        |

### **Academic Management Tables** (13 tables)

| Table Name         | Purpose                              | Key Fields                                                                                                       | Notes                                                                |
| ------------------ | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `colleges`         | Organizational units (COE, COB, CAS) | `college_id`, `campus_id` (FK), `college_code`, `college_name`, `head_employee_id` (FK)                          | Uses `head_employee_id` FK instead of dean_name text                 |
| `programs`         | Degree programs (BSCS, BSIT, etc.)   | `program_id`, `campus_id` (FK), `program_code`, `program_name`, `degree_type`, `duration_years`                  | ⚠️ `college_id` field planned for future                             |
| `students`         | Student records                      | `student_id`, `user_id` (FK), `program_id` (FK), `student_number`, `year_level`, `status`, `gpa`                 |                                                                      |
| `subjects`         | Course catalog                       | `subject_id`, `subject_code`, `subject_name`, `units`, `type`, `prerequisites`                                   | `type` includes: lecture, laboratory, lecture_lab, practicum, thesis |
| `curriculum`       | Program curriculum mapping           | `curriculum_id`, `program_id` (FK), `subject_id` (FK), `year_level`, `semester`, `is_required`                   | Single curriculum table (no separate default_curriculum yet)         |
| `sections`         | Class sections                       | `section_id`, `program_id` (FK), `section_name`, `year_level`, `semester`, `max_students`                        |                                                                      |
| `class_schedules`  | Course scheduling                    | `schedule_id`, `section_id` (FK), `subject_id` (FK), `employee_id` (FK), `day`, `start_time`, `end_time`, `room` | `room` is VARCHAR, not FK                                            |
| `student_sections` | Student section enrollment           | `student_id` (FK), `section_id` (FK), `enrollment_date`, `status`                                                | Replaces generic enrollments table                                   |
| `grades`           | Student grades                       | `grade_id`, `student_id` (FK), `schedule_id` (FK), `midterm_grade`, `final_grade`, `remarks_grade`, `status`     | Links to schedule_id, not subject_id                                 |
| `transcripts`      | Academic transcripts                 | `transcript_id`, `student_id` (FK), `school_year`, `semester`, `gpa`, `total_units`                              |                                                                      |
| `rooms`            | Facility management                  | `room_id`, `campus_id` (FK), `room_number`, `building`, `capacity`, `type`                                       |                                                                      |
| `employees`        | Faculty and staff records            | `employee_id`, `user_id` (FK), `employee_number`, `status`, `college_id`, `hire_date`                            |                                                                      |
| `employee_load`    | Faculty teaching load                | `load_id`, `employee_id` (FK), `schedule_id` (FK), `units`, `load_type`, `status`                                |                                                                      |

### **Student Information Tables** (5 tables)

| Table Name                       | Purpose                                   |
| -------------------------------- | ----------------------------------------- |
| `student_personal_information`   | Personal details, birth info, citizenship |
| `student_educational_background` | Previous education records                |
| `student_family_information`     | Family members & guardians                |
| `student_addresses`              | Current and permanent addresses           |
| `student_contact_information`    | Phone numbers, email addresses            |

### **Financial Tables** (5 tables)

| Table Name             | Purpose                       | Key Fields                                                                                        |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------- |
| `student_assessments`  | Student financial assessments | `assessment_id`, `student_id` (FK), `school_year`, `semester`, `total_amount`, `balance`          |
| `assessment_details`   | Assessment line items         | `detail_id`, `assessment_id` (FK), `fee_type`, `amount`                                           |
| `fee_structures`       | Fee definitions               | `fee_id`, `program_id` (FK), `fee_type`, `amount`, `school_year`                                  |
| `payments`             | Payment records               | `payment_id`, `student_id` (FK), `assessment_id` (FK), `amount`, `payment_method`, `payment_date` |
| `payment_installments` | Installment plans             | `installment_id`, `assessment_id` (FK), `installment_number`, `due_date`, `amount`                |

### **Academic Support Tables** (7 tables)

| Table Name                 | Purpose                                            |
| -------------------------- | -------------------------------------------------- |
| `assignments`              | Course assignments                                 |
| `attendance_records`       | Class attendance tracking                          |
| `grade_components`         | Grade component definitions (quizzes, exams, etc.) |
| `student_grade_components` | Individual grade component scores                  |
| `scholarships`             | Scholarship programs                               |
| `graduation_applications`  | Graduation processing                              |
| `user_sessions`            | Active user sessions                               |

### **Health & Medical Tables** (3 tables)

| Table Name              | Purpose                   |
| ----------------------- | ------------------------- |
| `medical_records`       | Student health records    |
| `health_requirements`   | Required health documents |
| `student_health_status` | Health status tracking    |

### **Clearance System Tables** (2 tables)

| Table Name               | Purpose                           |
| ------------------------ | --------------------------------- |
| `clearance_requirements` | Clearance requirement definitions |
| `student_clearances`     | Student clearance tracking        |

### **Library System Tables** (2 tables)

| Table Name     | Purpose                |
| -------------- | ---------------------- |
| `books`        | Library book catalog   |
| `book_borrows` | Book borrowing records |

### **Total Count**: ~48 tables currently implemented

---

## 🔜 Planned Features (Not Yet Implemented)

The following tables and features are documented but not yet implemented in the backend:

### **1. academic_terms Table** 🔜

**Purpose**: Centralized term management for semesters, trimesters, and summer terms

**Planned Structure**:

```sql
CREATE TABLE academic_terms (
    term_id INT PRIMARY KEY AUTO_INCREMENT,
    term_code VARCHAR(20) UNIQUE,
    school_year VARCHAR(20),
    term_type ENUM('1st Semester', '2nd Semester', '3rd Semester', 'Summer'),
    term_start_date DATE,
    term_end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    enrollment_start_date DATE,
    enrollment_end_date DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Why Needed**: Currently, terms are managed using `school_year` and `semester` integer fields in various tables. A centralized `academic_terms` table would provide better term management and scheduling.

### **2. default_curriculum Table** 🔜

**Purpose**: Template curriculum per program (separate from student-specific curriculum)

**Planned Structure**:

```sql
CREATE TABLE default_curriculum (
    default_curriculum_id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT,
    subject_id INT,
    year_level INT,
    semester INT,
    term_type VARCHAR(50),
    subject_type ENUM('Core', 'Major', 'Minor', 'Elective', 'GE', 'PE', 'NSTP'),
    is_required BOOLEAN DEFAULT TRUE,
    prerequisites TEXT,
    co_requisites TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(program_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);
```

**Why Needed**: Currently, there's only one `curriculum` table. A separate `default_curriculum` table would serve as the master template that can be copied to individual student curricula.

### **3. course_offerings Table** 🔜

**Purpose**: Bridge table connecting programs, terms, and subjects with faculty and slot management

**Planned Structure**:

```sql
CREATE TABLE course_offerings (
    offering_id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT,
    term_id INT,
    subject_id INT,
    employee_id INT,
    max_slots INT DEFAULT 40,
    enrolled_count INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(program_id),
    FOREIGN KEY (term_id) REFERENCES academic_terms(term_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
```

**Why Needed**: Currently, course scheduling is managed through `class_schedules`. The `course_offerings` table would provide better management of what courses are offered each term with enrollment tracking.

### **4. Programs Table Enhancement** 🔜

**Planned Addition**: Add `college_id` foreign key to link programs directly to colleges

```sql
ALTER TABLE programs ADD COLUMN college_id INT;
ALTER TABLE programs ADD FOREIGN KEY (college_id) REFERENCES colleges(college_id);
```

**Current State**: Programs are linked to `campus_id` but not to `college_id`, breaking the CAMPUSES → COLLEGES → PROGRAMS hierarchy.

---

## 📞 Support & Help

### **Database Support**

- **Setup Issues**: Check the SQL scripts section
- **Performance Issues**: Review optimization guidelines
- **Security Questions**: See Security Guide
- **General Questions**: Contact the database administrator

### **Technical Resources**

- **MySQL Documentation**: Official MySQL documentation
- **Laravel Database**: Laravel database documentation
- **Performance Tuning**: Database performance guides
- **Security Best Practices**: Database security resources

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Status**: Active Development

---

_This guide provides comprehensive information about the Database Structure and SQL Scripts sections. For navigation help, see the [Main Navigation Guide](./00_MAIN_NAVIGATION_GUIDE.md)._
