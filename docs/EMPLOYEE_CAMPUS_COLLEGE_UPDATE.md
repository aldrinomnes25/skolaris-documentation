# Employee Campus and College Assignment Update

## Summary

Updated the `CompleteEmployeeSeeder` to assign employees to their campus and colleges based on their roles within the ICCT College system.

## Changes Made

### 1. CompleteEmployeeSeeder.php

**Location:** `database/seeders/CompleteEmployeeSeeder.php`

**Key Updates:**

- Added campus_id assignment: Employees now get assigned to their campus based on their user's campus
- Added college_id assignment: Employees are assigned to colleges based on their role
- Added intelligent college assignment logic based on role:
  - **Academic roles** (Dean, Department Head, Faculty/Teacher) → Assigned to a random college within their campus
  - **Administrative roles** (Registrar, Accounting, Student Affairs, etc.) → Not assigned to a specific college (null)

**New Method Added:**

```php
private function assignCollegeForRole($user, $colleges)
```

This method intelligently assigns colleges based on the employee's role:

- Campus-level administrative roles get `null` for college_id
- Academic roles (Dean, Department Head, Faculty/Teacher) get assigned to a random college from their campus

**Features:**

- Groups colleges by campus for efficient lookup
- Validates that users have campuses assigned
- Validates that campuses have colleges before assigning
- Provides informative warnings when users are skipped

### 2. Employee Model Update

**Location:** `app/Models/Employee.php`

**Changes:**

- Added `position`, `department`, and `employment_status` to the fillable array
- These fields are already in the migration but were missing from the model

## Database Structure

### Employee Table Fields

- `campus_id` - Foreign key to campuses table
- `college_id` - Foreign key to colleges table (nullable)
- `position` - Employee position
- `department` - Department name
- `employment_status` - Employment status

### College Assignment Logic

**Colleges per Campus:**

- CCS - College of Computer Studies
- COE - College of Engineering
- CBA - College of Business Administration
- CED - College of Education
- CAS - College of Arts and Sciences

**Role Assignment:**

- **Dean** → Random college assignment
- **Department Head** → Random college assignment
- **Faculty/Teacher** → Random college assignment
- **Academic Coordinator** → No college (campus-level admin)
- **Registrar** → No college (campus-level admin)
- **Accounting** → No college (campus-level admin)
- **Student Affairs** → No college (campus-level admin)
- **Campus Coordinator** → No college (campus-level admin)
- **System Staff** → No college (campus-level admin)

## Usage

To apply this update:

```bash
# Run the seeder
php artisan db:seed --class=CompleteEmployeeSeeder
```

## Benefits

1. **Better Data Organization**: Employees are now properly linked to their campuses and colleges
2. **Role-Based Assignment**: Intelligent assignment based on whether the role is academic or administrative
3. **Data Integrity**: Validates campuses and colleges exist before assignment
4. **Flexibility**: Administrative staff can work across colleges without being tied to a specific one

## Notes

- Existing employees will be updated when the seeder runs (uses `updateOrCreate`)
- Academic roles get randomly assigned to colleges - this can be customized further if needed
- The seeder requires `CampusSeeder` and `CollegeSeeder` to run first
- All employees get assigned to their user's campus automatically
