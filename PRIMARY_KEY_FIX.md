# 🔧 Primary Key Column Fix - students.id

## Error

```
SQLSTATE[HY000]: General error: 1 no such column: students.id
SQL: select * from "students" where "students"."id" = 1 limit 1
```

## Problem

Laravel was looking for a column named `id` in the `students` table, but the actual primary key column is `student_id`.

By default, Laravel Eloquent assumes the primary key column is named `id`. If your table uses a different column name, you must explicitly declare it in the model.

## Root Cause

### Missing Primary Key Declaration

**File**: `app/Models/Student.php`

The `Student` model was missing the `$primaryKey` property:

```php
class Student extends Model
{
    // ❌ Missing: protected $primaryKey = 'student_id';

    protected $fillable = [
        'user_id',
        'program_id',
        'student_number',
        ...
    ];
}
```

**Result**: Laravel assumed the primary key was `id`, causing queries to fail.

### Incorrect Column References

**File**: `app/Http/Controllers/Api/StudentController.php`

Multiple locations were using `->id` instead of the correct primary key:

1. Line 47: `$user->id` should be `$user->user_id`
2. Line 116: `$student->id` should be `$student->student_id`
3. Line 146: `$student->id` should be `$student->student_id`

## Solution

### 1. Added Primary Key Declaration

**File**: `app/Models/Student.php`

```php
class Student extends Model
{
    // ✅ Added: Declare the correct primary key
    protected $primaryKey = 'student_id';

    protected $fillable = [
        'user_id',
        'program_id',
        'student_number',
        'year_level',
        'status',
        ...
    ];
}
```

### 2. Fixed assignments() Method

**File**: `app/Models/Student.php` (Line 71)

```php
// Before ❌
$q->where('student_id', $this->id);

// After ✅
$q->where('student_id', $this->student_id);
```

### 3. Fixed StudentController References

**File**: `app/Http/Controllers/Api/StudentController.php`

#### Line 47 - store() method:

```php
// Before ❌
'user_id' => $user->id,

// After ✅
'user_id' => $user->user_id,
```

#### Line 116 - myGrades() method:

```php
// Before ❌
->where('student_id', $student->id)

// After ✅
->where('student_id', $student->student_id)
```

#### Line 146 - myAssignments() method:

```php
// Before ❌
$query->where('class_student.student_id', $student->id);

// After ✅
$query->where('class_student.student_id', $student->student_id);
```

## Database Schema

The `students` table has the following structure:

```sql
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,  -- ← Primary key column
    user_id INTEGER NOT NULL,
    program_id INTEGER,
    student_number VARCHAR,
    year_level INTEGER,
    status VARCHAR,
    admission_date DATE,
    expected_graduation DATE,
    gpa DECIMAL(3,2),
    total_units_earned INTEGER,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (program_id) REFERENCES programs(program_id)
);
```

**Key Point**: Primary key is `student_id`, not `id`!

## Related Models

These models also use custom primary keys:

### User Model

```php
protected $primaryKey = 'user_id';
```

### Employee Model

```php
protected $primaryKey = 'employee_id';
```

### Role Model

```php
protected $primaryKey = 'role_id';
```

### Program Model

```php
protected $primaryKey = 'program_id';
```

## Testing

After the fix, test these operations:

### 1. Fetch Student by ID

```php
$student = Student::find(1);  // ✅ Now works correctly
```

### 2. Create Student

```php
Student::create([
    'user_id' => $user->user_id,  // ✅ Correct reference
    'student_number' => 'STU000001',
    ...
]);
```

### 3. Get Student Grades

```php
Grade::where('student_id', $student->student_id)  // ✅ Correct
     ->get();
```

### 4. Get Student Assignments

```php
Assignment::whereHas('schoolClass.students', function ($query) use ($student) {
    $query->where('student_id', $student->student_id);  // ✅ Correct
});
```

## How to Prevent This

### Rule: Always Declare Custom Primary Keys

When your table uses a primary key column other than `id`, always declare it:

```php
class YourModel extends Model
{
    // If primary key is NOT 'id', declare it
    protected $primaryKey = 'your_primary_key_column';

    // If primary key is NOT auto-incrementing, also set:
    // public $incrementing = false;

    // If primary key is NOT an integer, also set:
    // protected $keyType = 'string';
}
```

### Examples:

```php
// Standard Laravel (default)
class Post extends Model
{
    // No declaration needed, Laravel assumes:
    // protected $primaryKey = 'id';
}

// Custom integer primary key
class Student extends Model
{
    protected $primaryKey = 'student_id';
}

// UUID primary key
class Order extends Model
{
    protected $primaryKey = 'order_uuid';
    public $incrementing = false;
    protected $keyType = 'string';
}
```

## Files Changed

### Backend:

1. ✅ `app/Models/Student.php` - Added `$primaryKey` declaration
2. ✅ `app/Models/Student.php` - Fixed `assignments()` method
3. ✅ `app/Http/Controllers/Api/StudentController.php` - Fixed 3 references

### Documentation:

1. ✅ `PRIMARY_KEY_FIX.md` (this file)

## Summary

✅ **Fixed**: Missing primary key declaration in Student model
✅ **Fixed**: Incorrect column references using `->id` instead of `->student_id`
✅ **Impact**: All student-related database queries now work correctly
✅ **Prevention**: Document custom primary key requirements

**Result**: Students can now be fetched, created, and queried without errors! 🎉

## Related Issues Fixed

This fix also resolves:

- Student creation errors
- Student detail page errors
- My Grades page errors
- My Assignments page errors
- Any query using `Student::find()` or similar methods
