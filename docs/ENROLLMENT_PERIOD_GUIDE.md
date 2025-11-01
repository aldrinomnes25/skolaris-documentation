# 📅 Enrollment Period Management Guide

**Date:** January 2025  
**Status:** ✅ Complete  
**Author:** SKOLARIS Development Team

---

## 🎯 Overview

**Enrollment Periods** control when students can enroll in courses. When an enrollment period is **open**, it automatically sets course offerings to be available for enrollment.

### Key Features:

- ✅ Automatic sync with Course Offerings (`is_available` status)
- ✅ Date-based enrollment control
- ✅ Multiple term systems support (Semester, Trimester, Short Courses)
- ✅ Current period management

---

## 🔄 Step 1: Reset Enrollment Periods Data

### Option A: Via Seeder (Recommended)

Run the seeder to reset and populate fresh data:

```bash
cd /Users/aldrincruzomnes/SKOLARIS/skolaris-be

# Reset and seed enrollment periods
php artisan db:seed --class=EnrollmentPeriodSeeder
```

**What this does:**

- Clears all existing enrollment periods
- Creates sample periods for:
  - **Semester System** (2 periods)
  - **Trimester System** (3 periods)
  - **Short Courses** (2 periods)
- Sets "1st Semester 2025" as current and open

### Option B: Via SQL (Manual)

```sql
-- Clear all enrollment periods
TRUNCATE TABLE enrollment_periods;

-- Or delete specific ones
DELETE FROM enrollment_periods WHERE academic_year = 2025;
```

---

## 📝 Step 2: Create New Enrollment Period

### Method 1: Via API (Postman/Frontend)

**Endpoint:** `POST /api/v1/enrollment-periods`

**Request Body:**

```json
{
  "academic_term_id": 1,
  "period_name": "1st Semester 2026",
  "academic_year": 2026,
  "term_sequence": 1,
  "enrollment_start_date": "2026-05-15",
  "enrollment_end_date": "2026-06-30",
  "classes_start_date": "2026-07-01",
  "classes_end_date": "2026-11-30",
  "is_current": false,
  "is_active": true,
  "enrollment_open": false,
  "notes": "First semester enrollment for AY 2026-2027"
}
```

**Field Explanations:**

| Field                   | Required | Description                              | Example                          |
| ----------------------- | -------- | ---------------------------------------- | -------------------------------- |
| `academic_term_id`      | ✅ Yes   | Reference to `academic_terms` table      | `1` = Semester, `2` = Trimester  |
| `period_name`           | ✅ Yes   | Display name                             | `"1st Semester 2026"`            |
| `academic_year`         | ✅ Yes   | Academic year (YYYY)                     | `2026`                           |
| `term_sequence`         | ✅ Yes   | Which term (1st, 2nd, 3rd)               | `1` = 1st, `2` = 2nd, `3` = 3rd  |
| `enrollment_start_date` | ✅ Yes   | When enrollment opens                    | `"2026-05-15"`                   |
| `enrollment_end_date`   | ✅ Yes   | When enrollment closes                   | `"2026-06-30"`                   |
| `classes_start_date`    | ✅ Yes   | When classes begin                       | `"2026-07-01"`                   |
| `classes_end_date`      | ✅ Yes   | When classes end                         | `"2026-11-30"`                   |
| `is_current`            | No       | Is this the current period?              | `true` or `false`                |
| `is_active`             | No       | Is this period active? (Default: `true`) | `true` or `false`                |
| `enrollment_open`       | No       | Is enrollment open? (Default: `false`)   | `true` or `false`                |
| `notes`                 | No       | Additional notes                         | `"First semester enrollment..."` |

### Method 2: Via Seeder

Edit `/database/seeders/EnrollmentPeriodSeeder.php` and add:

```php
[
    'academic_term_id' => 1, // 1=Semester, 2=Trimester, etc.
    'period_name' => '1st Semester 2026',
    'academic_year' => 2026,
    'term_sequence' => 1,
    'enrollment_start_date' => '2026-05-15',
    'enrollment_end_date' => '2026-06-30',
    'classes_start_date' => '2026-07-01',
    'classes_end_date' => '2026-11-30',
    'is_current' => true,  // Set as current
    'is_active' => true,
    'enrollment_open' => true,  // Open enrollment
    'notes' => 'First semester enrollment for AY 2026-2027',
    'created_at' => now(),
    'updated_at' => now(),
],
```

Then run: `php artisan db:seed --class=EnrollmentPeriodSeeder`

### Method 3: Via Database Direct Insert

```sql
INSERT INTO enrollment_periods (
    academic_term_id,
    period_name,
    academic_year,
    term_sequence,
    enrollment_start_date,
    enrollment_end_date,
    classes_start_date,
    classes_end_date,
    is_current,
    is_active,
    enrollment_open,
    notes,
    created_at,
    updated_at
) VALUES (
    1,                              -- academic_term_id (1=Semester)
    '1st Semester 2026',            -- period_name
    2026,                           -- academic_year
    1,                              -- term_sequence (1st term)
    '2026-05-15',                   -- enrollment_start_date
    '2026-06-30',                   -- enrollment_end_date
    '2026-07-01',                   -- classes_start_date
    '2026-11-30',                   -- classes_end_date
    TRUE,                           -- is_current
    TRUE,                           -- is_active
    TRUE,                           -- enrollment_open
    'First semester enrollment for AY 2026-2027',  -- notes
    NOW(),                          -- created_at
    NOW()                           -- updated_at
);
```

---

## 🔍 Step 3: Check Academic Terms Available

Before creating an enrollment period, check what academic terms exist:

**Endpoint:** `GET /api/v1/academic-terms`

Common terms:

- `academic_term_id: 1` = Semester
- `academic_term_id: 2` = Trimester
- `academic_term_id: 6` = Weeks (for short courses)
- `academic_term_id: 7` = Months (for short courses)

---

## ⚙️ Step 4: Managing Enrollment Periods

### Set as Current Period

**Endpoint:** `PUT /api/v1/enrollment-periods/{period_id}/set-as-current`

This will:

- Mark this period as current
- Unset all other periods as current
- **Does NOT** open enrollment automatically

### Open Enrollment

**Endpoint:** `POST /api/v1/enrollment-periods/{period_id}/open-enrollment`

This will:

- Set `enrollment_open = true`
- Set `is_current = true`
- **Automatically syncs** all course offerings with matching `term_id` to `is_available = true`

### Close Enrollment

**Endpoint:** `POST /api/v1/enrollment-periods/{period_id}/close-enrollment`

This will:

- Set `enrollment_open = false`
- **Automatically syncs** all course offerings with matching `term_id` to `is_available = false`

---

## 🔗 How It Connects to Course Offerings

### Automatic Sync Flow:

```
1. Enrollment Period opens
   ↓
2. System finds all Course Offerings with matching term_id
   ↓
3. Updates all active offerings: is_available = true
   ↓
4. Students can now enroll
```

### When Enrollment Closes:

```
1. Enrollment Period closes
   ↓
2. System finds all Course Offerings with matching term_id
   ↓
3. Updates all active offerings: is_available = false
   ↓
4. Students can no longer enroll (even if offering has slots)
```

### Enrollment Validation:

When a student tries to enroll, the system checks:

```php
CourseOffering->canEnroll() checks:
  1. ✅ Offering is active (is_active = true)
  2. ✅ Has available slots (not full)
  3. ✅ Enrollment period is open for this term
  4. ✅ Offering is available (is_available = true)
```

---

## 📊 Example: Creating Full Academic Year

### For Semester System (2 terms):

**1st Semester:**

```json
{
  "academic_term_id": 1,
  "period_name": "1st Semester 2026",
  "academic_year": 2026,
  "term_sequence": 1,
  "enrollment_start_date": "2026-05-15",
  "enrollment_end_date": "2026-06-30",
  "classes_start_date": "2026-07-01",
  "classes_end_date": "2026-11-30",
  "is_current": true,
  "enrollment_open": true
}
```

**2nd Semester:**

```json
{
  "academic_term_id": 1,
  "period_name": "2nd Semester 2026",
  "academic_year": 2026,
  "term_sequence": 2,
  "enrollment_start_date": "2026-11-15",
  "enrollment_end_date": "2026-12-31",
  "classes_start_date": "2027-01-05",
  "classes_end_date": "2027-05-31",
  "is_current": false,
  "enrollment_open": false
}
```

### For Trimester System (3 terms):

**1st Trimester:**

```json
{
  "academic_term_id": 2,
  "period_name": "1st Trimester 2026",
  "academic_year": 2026,
  "term_sequence": 1,
  "enrollment_start_date": "2026-05-01",
  "enrollment_end_date": "2026-05-31",
  "classes_start_date": "2026-06-01 thinner",
  "classes_end_date": "2026-09-30",
  "is_current": true,
  "enrollment_open": true
}
```

_(Repeat for 2nd and 3rd trimesters with `term_sequence: 2` and `3`)_

---

## ✅ Quick Checklist

When creating an enrollment period:

- [ ] ✅ Check available `academic_term_id` values
- [ ] ✅ Set proper dates (enrollment and classes)
- [ ] ✅ Set correct `term_sequence` (1, 2, or 3)
- [ ] ✅ Set `academic_year` correctly
- [ ] ✅ Choose meaningful `period_name`
- [ ] ✅ Set `is_current = true` if this should be the active period
- [ ] ✅ Set `enrollment_open = true` if enrollment should start now
- [ ] ✅ Verify dates don't overlap with existing periods
- [ ] ✅ Test by opening enrollment and checking course offerings update

---

## 🚨 Important Notes

1. **Unique Constraint**: Only ONE enrollment period per combination of:

   - `academic_year` + `academic_term_id` + `term_sequence`

2. **Current Period**: Only ONE period can have `is_current = true` at a time. Setting a new one as current automatically unsets others.

3. **Automatic Sync**: Opening/closing enrollment automatically updates ALL course offerings with matching `term_id`.

4. **Manual Override**: You can still manually set `is_available` on individual course offerings, but they will be overridden when enrollment period opens/closes.

5. **Date Validation**: Ensure:
   - `enrollment_start_date` < `enrollment_end_date`
   - `classes_start_date` < `classes_end_date`
   - `enrollment_end_date` typically comes before `classes_start_date`

---

## 🔧 Troubleshooting

### Issue: Course offerings not updating when enrollment opens

**Solution:**

- Check if `term_id` in course offerings matches `academic_term_id` in enrollment period
- Verify enrollment period was actually opened (check `enrollment_open = true`)
- Check if course offerings have `is_active = true` (only active offerings are synced)

### Issue: Can't create enrollment period (duplicate error)

**Solution:**

- Check if combination of `academic_year` + `academic_term_id` + `term_sequence` already exists
- Either update existing one or use different values

### Issue: Students can't enroll even though enrollment is open

**Solution:**

- Check if `enrollment_open = true`
- Verify `is_current = true`
- Check course offering `is_available = true`
- Verify course offering `is_active = true`
- Check if offering has available slots

---

## 📚 Related Documentation

- [Course Offerings Connection](./COURSE_OFFERINGS_CONNECTION.md)
- [Academic Terms Management](./docs/PROGRAMS_TERMS_SUBJECTS_CONNECTION_COMPLETE.md)

---

**Last Updated:** January 2025
