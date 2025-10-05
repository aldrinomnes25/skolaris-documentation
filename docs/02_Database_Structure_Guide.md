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

### **Core Tables Structure**

The database is organized into logical groups:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Tables   │    │  Academic Tables│    │  System Tables  │
│                 │    │                 │    │                 │
│ • users         │    │ • students      │    │ • campuses      │
│ • roles         │    │ • courses       │    │ • settings      │
│ • permissions   │    │ • subjects      │    │ • logs          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Financial Tables│    │  Medical Tables │    │  Audit Tables   │
│                 │    │                 │    │                 │
│ • payments      │    │ • medical_records│   │ • audit_logs    │
│ • fees          │    │ • clinic_visits │    │ • user_activity │
│ • transactions  │    │ • health_status │    │ • system_logs   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Key Table Categories**

#### **1. User Management Tables**

- `users`: User accounts and authentication
- `roles`: User roles and permissions
- `permissions`: System permissions
- `user_roles`: Role assignments

#### **2. Academic Tables**

- `students`: Student information
- `courses`: Course catalog
- `subjects`: Subject details
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

#### **3. Sample Courses**

```sql
-- Insert sample courses
INSERT INTO courses (code, name, description, credits) VALUES
('CS101', 'Introduction to Computer Science', 'Basic CS concepts', 3),
('IT201', 'Database Management', 'Database design and implementation', 3);
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

#### **2. Academic Relationships**

```
students (1) ──── (many) enrollments
courses (1) ──── (many) enrollments
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
