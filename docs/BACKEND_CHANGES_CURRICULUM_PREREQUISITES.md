# Backend Changes: Curriculum Prerequisites Implementation

**Date:** October 21, 2025  
**Commit:** `d769eca`  
**Branch:** master

## 📋 Overview

Implemented curriculum-level prerequisites management system and enhanced curriculum API responses with additional metadata fields. This change moves prerequisites from subject-level to curriculum-specific, allowing different programs to have different prerequisites for the same subject.

---

## 🚀 Key Changes

### 1. **Database Changes**

#### New Migration: Add Prerequisites to Curricula

- **File:** `database/migrations/2025_10_20_204923_add_prerequisites_to_default_curricula_table.php`
- Added `prerequisites` JSON field to `default_curricula` table
- Stores curriculum-specific prerequisites as array of subject IDs
- Located after `is_active` column

#### Migration: Clear Subject-Level Prerequisites

- **File:** `database/migrations/2025_10_20_205949_clear_subject_level_prerequisites.php`
- Clears all subject-level prerequisites
- Ensures only curriculum-specific prerequisites are used
- Prevents confusion between subject and curriculum prerequisites

### 2. **Model Changes**

#### Curriculum Model (`app/Models/Curriculum.php`)

**Added Fields:**

- `prerequisites` - Added to fillable array and casted as JSON array

**Updated Logic:**

- `getPrerequisitesTextAttribute()` now prioritizes curriculum-specific prerequisites
- Falls back to subject-level prerequisites only if no curriculum prerequisites exist
- Returns formatted string of prerequisite subject codes

```php
// Example:
// If curriculum has prerequisites: [1, 5, 8]
// Returns: "CS101, MATH101, ENG101"
```

### 3. **Controller Changes**

#### CurriculumController (`app/Http/Controllers/Api/CurriculumController.php`)

**Enhanced API Responses - Added Fields:**

- `effectivity_start_year` - Start year of curriculum effectivity
- `effectivity_end_year` - End year of curriculum effectivity
- `curriculum_level` - Academic level (e.g., 1st Year, 2nd Year)
- `term_sequence` - Term order within the academic year
- `prerequisites` - Array of prerequisite subject IDs

**Updated Methods:**

- ✅ `index()` - List all curricula
- ✅ `store()` - Create new curriculum
- ✅ `show()` - Get single curriculum
- ✅ `update()` - Update curriculum

**Store Method Changes:**

- Now accepts `term_sequence` field
- Changed `status` parameter to `is_active` for consistency
- Stores `prerequisites` array (defaults to empty array if not provided)

### 4. **Request Validation Changes**

#### StoreCurriculumRequest (`app/Http/Requests/Api/StoreCurriculumRequest.php`)

**New Validation Rules:**

```php
'prerequisites' => ['nullable', 'array'],
'prerequisites.*' => ['integer', 'exists:subjects,subject_id']
```

#### UpdateCurriculumRequest (`app/Http/Requests/Api/UpdateCurriculumRequest.php`)

**New Validation Rules:**

```php
'prerequisites' => ['nullable', 'array'],
'prerequisites.*' => ['integer', 'exists:subjects,subject_id']
```

### 5. **Error Handling**

#### Bootstrap App (`bootstrap/app.php`)

**Added ModelNotFoundException Handler:**

- Returns structured JSON response for API routes
- Provides clear error messages for missing resources
- Returns 404 status code with model name and ID

**Response Format:**

```json
{
  "success": false,
  "message": "Curriculum with ID 123 not found",
  "error": "The requested Curriculum record does not exist or has been deleted."
}
```

---

## 📊 API Response Changes

### Before vs After Comparison

#### Before:

```json
{
  "curriculum_id": 1,
  "effectivity_period": "2024-2025",
  "program_abbreviation": "BSIT",
  "year_term": "1st Year - 1st Semester",
  "subject_with_code": "Introduction to Computing (CS101)",
  "units": "3.0",
  "prerequisites_text": "None",
  "is_active": true,
  "is_ongoing": false,
  "notes": null
}
```

#### After:

```json
{
  "curriculum_id": 1,
  "effectivity_period": "2024-2025",
  "effectivity_start_year": 2024,
  "effectivity_end_year": 2025,
  "curriculum_level": 1,
  "term_sequence": 1,
  "program_abbreviation": "BSIT",
  "year_term": "1st Year - 1st Semester",
  "subject_with_code": "Introduction to Computing (CS101)",
  "units": "3.0",
  "prerequisites_text": "MATH101, ENG101",
  "prerequisites": [5, 8],
  "is_active": true,
  "is_ongoing": false,
  "notes": null
}
```

---

## 🔄 Migration Instructions

### For Development/Staging

```bash
# Navigate to backend directory
cd /path/to/skolaris-be

# Run migrations
php artisan migrate

# Verify migrations
php artisan migrate:status
```

### For Production

```bash
# Backup database first!
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql

# Pull latest changes
git pull origin master

# Run migrations
php artisan migrate --force

# Verify
php artisan migrate:status
```

---

## 🧪 Testing Checklist

- [ ] Create curriculum with prerequisites array
- [ ] Update curriculum prerequisites
- [ ] Verify prerequisites_text displays correct subject codes
- [ ] Test curriculum without prerequisites (should show "None")
- [ ] Verify all new fields are returned in API responses
- [ ] Test error handling for invalid subject IDs in prerequisites
- [ ] Verify ModelNotFoundException returns proper JSON response

---

## 💡 Usage Examples

### Creating Curriculum with Prerequisites

```json
POST /api/curricula

{
  "program_id": 1,
  "subject_id": 10,
  "academic_term_id": 1,
  "curriculum_level": 2,
  "term_sequence": 1,
  "effectivity_start_year": 2024,
  "effectivity_end_year": 2025,
  "is_ongoing": false,
  "is_active": true,
  "prerequisites": [5, 8, 12],
  "notes": "Updated curriculum for 2024"
}
```

### Updating Prerequisites

```json
PUT /api/curricula/10

{
  "prerequisites": [5, 8],
  "notes": "Removed CS201 as prerequisite"
}
```

---

## ⚠️ Breaking Changes

### 1. Prerequisites Storage

- **Before:** Prerequisites stored at subject level
- **After:** Prerequisites stored at curriculum level
- **Impact:** Each program can now have different prerequisites for the same subject

### 2. API Response Structure

- **Added Fields:** `effectivity_start_year`, `effectivity_end_year`, `curriculum_level`, `term_sequence`, `prerequisites`
- **Impact:** Frontend must handle these new fields

### 3. Store Endpoint Parameter Change

- **Before:** `status` parameter
- **After:** `is_active` parameter
- **Impact:** API calls using `status` will fail validation

---

## 📝 Notes for Team

1. **Prerequisites Array:**

   - Contains subject IDs, not subject codes
   - Can be empty array `[]` for subjects with no prerequisites
   - Validated against existing subjects in database

2. **Backwards Compatibility:**

   - Old curricula without prerequisites will show "None"
   - System falls back to subject-level prerequisites if curriculum prerequisites are empty

3. **Frontend Integration:**

   - Update forms to accept prerequisites selection
   - Display new metadata fields appropriately
   - Handle prerequisites as array in state management

4. **Data Migration:**
   - Subject-level prerequisites cleared by migration
   - Need to manually set curriculum-specific prerequisites for existing curricula if needed

---

## 🔗 Related Files

- `app/Http/Controllers/Api/CurriculumController.php`
- `app/Http/Requests/Api/StoreCurriculumRequest.php`
- `app/Http/Requests/Api/UpdateCurriculumRequest.php`
- `app/Models/Curriculum.php`
- `bootstrap/app.php`
- `database/migrations/2025_10_20_204923_add_prerequisites_to_default_curricula_table.php`
- `database/migrations/2025_10_20_205949_clear_subject_level_prerequisites.php`

---

## 📧 Questions?

Contact the development team if you have any questions about these changes.

**Implemented by:** Backend Team  
**Review Status:** ✅ Committed to master
