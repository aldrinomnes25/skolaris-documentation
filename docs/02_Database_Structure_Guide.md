# 🗄️ Database Structure & SQL Scripts - User Guide

## Overview

The Database Structure section contains the complete database schema, entity relationships, and ready-to-use SQL scripts for the SKOLARIS Student Information System.

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
