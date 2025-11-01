# Course Offering Section Fix - Multiple Sections Support

**Date:** October 26, 2025  
**Status:** ✅ **COMPLETE**  
**Author:** SKOLARIS Development Team

---

## 🎯 Problem

The system was preventing creation of multiple course offerings with different sections for the same program, term, subject, year level, and semester. Users were getting this error when trying to create a course offering with a different section:

```json
{
  "success": false,
  "message": "Course offering already exists for this program, term, subject, year level, and semester combination"
}
```

**User feedback:** "pwde naman to . with diffrendt section." (This should be possible with a different section.)

---

## ✅ Solution

Updated the database unique constraint and backend validation logic to include the `section` field when checking for duplicates. This allows multiple sections to exist for the same course offering.

---

## 🔧 Changes Made

### 1. Database Migration

**File:** `database/migrations/2025_10_26_144129_update_course_offerings_unique_constraint_to_include_section.php`

**Changes:**

- Dropped the old unique constraint: `uk_course_offering`
  - Old: `(program_id, term_id, subject_id, year_level, semester)`
- Added new unique constraint: `uk_course_offering_with_section`
  - New: `(program_id, term_id, subject_id, year_level, semester, section)`

**Result:** Multiple sections can now exist for the same course offering combination.

---

### 2. Backend Controller Updates

**File:** `app/Http/Controllers/Api/CourseOfferingController.php`

#### Store Method (Create)

- Added validation for new fields:
  - `modality`: Required, must be one of (TC, OL, LF, AL, ELG, ELD)
  - `section`: Required, max 50 characters
  - `schedule_day`: Optional, day of week
  - `schedule_time_start`, `schedule_time_end`: Optional, time format
  - `room`: Optional, max 50 characters
  - `lecture_units`, `lab_units`: Optional, numeric 0-99.9
- Updated duplicate check to include `section` field
- Improved error message to mention section

#### Update Method

- Added validation for new fields (same as store)
- Added duplicate check when updating to prevent conflicts
- Uses existing values if new values not provided

---

## 📊 Technical Details

### Before

```php
// Old unique constraint
$table->unique(['program_id', 'term_id', 'subject_id', 'year_level', 'semester'], 'uk_course_offering');

// Old duplicate check
$existingOffering = CourseOffering::where([
    'program_id' => $request->program_id,
    'term_id' => $request->term_id,
    'subject_id' => $request->subject_id,
    'year_level' => $request->year_level,
    'semester' => $request->semester,
])->first();
```

### After

```php
// New unique constraint
$table->unique(['program_id', 'term_id', 'subject_id', 'year_level', 'semester', 'section'], 'uk_course_offering_with_section');

// New duplicate check (including section)
$query = CourseOffering::where([
    'program_id' => $request->program_id,
    'term_id' => $request->term_id,
    'subject_id' => $request->subject_id,
    'year_level' => $request->year_level,
    'semester' => $request->semester,
]);

if ($request->filled('section')) {
    $query->where('section', $request->section);
}

$existingOffering = $query->first();
```

---

## 🎉 Benefits

✅ **Multiple Sections Support**: Users can now create multiple sections for the same course offering  
✅ **Data Integrity**: Unique constraint prevents true duplicates  
✅ **Better Validation**: Added proper validation for modality, section, schedule, and units  
✅ **Better UX**: Clear error messages that include section information  
✅ **Backward Compatible**: Existing course offerings continue to work

---

## 🧪 Testing

### Test Case 1: Create Multiple Sections

```
Expected Result: ✅ Success
Action: Create two course offerings with:
- Same: program_id, term_id, subject_id, year_level, semester
- Different: section (e.g., "LFCA111A001" and "LFCA111B001")
```

### Test Case 2: Duplicate Section

```
Expected Result: ❌ Error (409 Conflict)
Action: Create a course offering with the same combination including the same section
Error: "Course offering already exists for this program, term, subject, year level, semester, and section combination"
```

### Test Case 3: Update Section

```
Expected Result: ✅ Success
Action: Update a course offering's section to a unique value
```

### Test Case 4: Update to Existing Section

```
Expected Result: ❌ Error (409 Conflict)
Action: Update a course offering's section to match another existing course offering
```

---

## 📝 Migration Commands

The following command has already been executed:

```bash
php artisan migrate
```

**Output:**

```
INFO  Running migrations.
2025_10_26_144129_update_course_offerings_unique_constraint_to_include_section  6.72ms DONE
```

---

## 🔄 Rollback (If Needed)

To rollback this change:

```bash
php artisan migrate:rollback
```

This will:

1. Drop the new unique constraint: `uk_course_offering_with_section`
2. Restore the old unique constraint: `uk_course_offering`

**Note:** Rolling back may cause issues if multiple sections exist in the database.

---

## 📌 Notes

- The `section` field must be provided and cannot be null
- The section is auto-generated by the frontend based on modality, program, and subject
- Each section must be unique within the same program/term/subject/year/semester combination
- The frontend form already supports section input (auto-generated, but can be manually overridden)

---

## ✅ Status

- ✅ Migration created and executed
- ✅ Backend validation updated
- ✅ Duplicate check includes section
- ✅ No linting errors
- ✅ Ready for production

---

**Related Files:**

- `/Users/aldrincruzomnes/SKOLARIS/skolaris-be/database/migrations/2025_10_26_144129_update_course_offerings_unique_constraint_to_include_section.php`
- `/Users/aldrincruzomnes/SKOLARIS/skolaris-be/app/Http/Controllers/Api/CourseOfferingController.php`
- `/Users/aldrincruzomnes/SKOLARIS/skolaris-be/app/Models/CourseOffering.php`
- `/Users/aldrincruzomnes/SKOLARIS/skolaris-fe/src/pages/CourseOfferingFormAdmin.jsx`
