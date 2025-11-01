# 🚀 Deployment Instructions: Prerequisites Feature

## For Other Developers

### 1. Pull Latest Code
```bash
git pull origin main
```

### 2. Run Migration
```bash
cd skolaris-be
php artisan migrate
```

**Expected Output:**
```
INFO  Running migrations.
2025_10_20_204923_add_prerequisites_to_default_curricula_table ... DONE
```

### 3. Verify Migration
```bash
php artisan migrate:status
```

Look for:
```
2025_10_20_204923_add_prerequisites_to_default_curricula_table ..... [X] Ran
```

---

## What Gets Updated Automatically

### Backend Changes ✅
When they pull the code, they get:

1. **Migration File** (`database/migrations/2025_10_20_204923_add_prerequisites_to_default_curricula_table.php`)
   - Adds `prerequisites` column to `default_curricula` table

2. **Model** (`app/Models/Curriculum.php`)
   - ✅ `prerequisites` in `$fillable`
   - ✅ `prerequisites` => `'array'` in `$casts`
   - ✅ Updated `getPrerequisitesTextAttribute()` method

3. **Controller** (`app/Http/Controllers/Api/CurriculumController.php`)
   - ✅ Stores prerequisites in `store()` method
   - ✅ Returns prerequisites in all API responses

4. **Validation** (`app/Http/Requests/Api/UpdateCurriculumRequest.php`)
   - ✅ Prerequisites validation rules

### Frontend Changes ✅
No changes needed! Frontend already:
- ✅ Sends `prerequisites` data
- ✅ Displays `prerequisites_text` from API

---

## Database Changes

### New Column Added
```sql
ALTER TABLE `default_curricula` 
ADD COLUMN `prerequisites` JSON NULL 
AFTER `is_active`
COMMENT 'Curriculum-specific prerequisites as JSON array of subject IDs';
```

### Column Structure
```
default_curricula table:
├── curriculum_id
├── program_id
├── subject_id
├── academic_term_id
├── term_sequence
├── curriculum_level
├── effectivity_start_year
├── effectivity_end_year
├── is_ongoing
├── is_active
├── prerequisites ⬅️ NEW
├── notes
├── created_by
├── updated_by
└── timestamps
```

---

## Rollback (If Needed)

If there's an issue, they can rollback:

```bash
php artisan migrate:rollback --step=1
```

This will remove the `prerequisites` column.

---

## Testing After Migration

### Test 1: Check Database
```bash
php artisan tinker
```

```php
// Check if column exists
Schema::hasColumn('default_curricula', 'prerequisites'); // Should return true

// Check existing data
$curriculum = App\Models\Curriculum::first();
$curriculum->prerequisites; // Should return null or array
```

### Test 2: API Test
Create a curriculum with prerequisites:

```bash
POST /api/curricula
{
  "program_id": 1,
  "subject_id": 5,
  "academic_term_id": 1,
  "curriculum_level": 1,
  "term_sequence": 1,
  "effectivity_start_year": 2024,
  "prerequisites": [1, 2],  // ⬅️ NEW
  "notes": "Test"
}
```

Response should include:
```json
{
  "success": true,
  "data": {
    "prerequisites": [1, 2],  // ⬅️ Should be returned
    "prerequisites_text": "CS101, CS102"
  }
}
```

---

## Files That Need to Be Committed

### Backend Files ✅
```
skolaris-be/
├── database/migrations/
│   └── 2025_10_20_204923_add_prerequisites_to_default_curricula_table.php  ⬅️ NEW
├── app/Models/
│   └── Curriculum.php  ⬅️ MODIFIED
├── app/Http/Controllers/Api/
│   └── CurriculumController.php  ⬅️ MODIFIED
└── app/Http/Requests/Api/
    └── UpdateCurriculumRequest.php  ⬅️ MODIFIED
```

### Documentation Files ✅
```
skolaris-documentation/
├── PREREQUISITES_CURRICULUM_FIX.md  ⬅️ NEW
└── DEPLOYMENT_INSTRUCTIONS.md  ⬅️ NEW (this file)
```

---

## Compatibility

### ✅ Backward Compatible
- Old curricula without `prerequisites` will show subject-level prerequisites
- No breaking changes to existing functionality
- Frontend already supports prerequisites

### ✅ Forward Compatible
- New curricula will use curriculum-specific prerequisites
- Properly validates prerequisite subject IDs
- JSON field allows flexible prerequisite storage

---

## Production Deployment Checklist

- [ ] Pull latest code
- [ ] Backup database
- [ ] Run `php artisan migrate`
- [ ] Verify migration status
- [ ] Test API endpoints
- [ ] Check frontend functionality
- [ ] Verify existing data still works
- [ ] Test new curriculum creation with prerequisites

---

## Support

If they encounter issues:

1. **Migration fails:** Check database permissions
2. **Column already exists:** Run `php artisan migrate:status` to verify
3. **API errors:** Check if model and controller files are updated
4. **Validation errors:** Verify request validation files are updated

---

**Summary:** Just `git pull` + `php artisan migrate` = Everything works! ✅
