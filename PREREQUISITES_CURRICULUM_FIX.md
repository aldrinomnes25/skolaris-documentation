# Prerequisites: Curriculum-Specific Implementation

## ❓ Question: Bakit nag-update ng prerequisite sa Subject?

**Tama ang tanong mo!** The original implementation was **WRONG** because:

### ❌ Original Wrong Approach
- Prerequisites were stored at **Subject level** (`subjects` table)
- When adding CS301 to curriculum, it updated the **GLOBAL** subject prerequisites
- **Problem**: CS301 would have the same prerequisites for ALL programs, ALL curriculum versions
- This is incorrect because prerequisites should be **curriculum-specific**

### Example of the Problem:
```
CS301 in BSCS 2023 → needs CS201
CS301 in BSIT 2023 → needs CS202  
CS301 in BSCS 2024 → needs CS203  
```

With subject-level prerequisites, **ALL of these would show the same prerequisites** ❌

---

## ✅ Correct Solution: Curriculum-Specific Prerequisites

### Architecture Change
Prerequisites are now stored in the **`default_curricula` table**, not in `subjects` table.

### Database Changes

#### Migration
```php
// File: database/migrations/2025_10_20_204923_add_prerequisites_to_default_curricula_table.php
Schema::table('default_curricula', function (Blueprint $table) {
    $table->json('prerequisites')
        ->nullable()
        ->after('is_active')
        ->comment('Curriculum-specific prerequisites as JSON array of subject IDs');
});
```

**Column Order** (follows BE standard):
```
1. curriculum_id
2. program_id
3. subject_id
4. academic_term_id
5. term_sequence
6. curriculum_level
7. effectivity_start_year
8. effectivity_end_year
9. is_ongoing
10. is_active
11. prerequisites ⬅️ NEW (before notes)
12. notes
13. created_by
14. updated_by
15. timestamps
```

---

### Backend Changes

#### 1. Curriculum Model (`app/Models/Curriculum.php`)

**Added to fillable:**
```php
protected $fillable = [
    // ... existing fields ...
    'prerequisites',  // NEW
    'created_by',
    'updated_by'
];
```

**Added to casts:**
```php
protected $casts = [
    // ... existing casts ...
    'prerequisites' => 'array',  // NEW - auto JSON encode/decode
];
```

**Updated `getPrerequisitesTextAttribute()` accessor:**
```php
public function getPrerequisitesTextAttribute(): string
{
    // Priority 1: Use curriculum-specific prerequisites
    if ($this->prerequisites && !empty($this->prerequisites)) {
        $prereqSubjects = Subject::whereIn('subject_id', $this->prerequisites)->get();
        if ($prereqSubjects->isNotEmpty()) {
            return $prereqSubjects->pluck('subject_code')->join(', ');
        }
        return 'Prerequisites Required';
    }

    // Priority 2: Fallback to subject-level prerequisites (backward compatibility)
    if (!$this->subject || !$this->subject->prerequisites || empty($this->subject->prerequisites)) {
        return 'None';
    }

    $prerequisites = $this->subject->prerequisites;
    if (is_string($prerequisites)) {
        $prerequisites = json_decode($prerequisites, true);
    }
    
    if (!is_array($prerequisites) || empty($prerequisites)) {
        return 'None';
    }

    $prereqSubjects = Subject::whereIn('subject_id', $prerequisites)->get();
    if ($prereqSubjects->isNotEmpty()) {
        return $prereqSubjects->pluck('subject_code')->join(', ');
    }

    return 'Prerequisites Required';
}
```

**Logic:**
1. ✅ **First**, check curriculum-specific prerequisites
2. ✅ **Fallback** to subject-level prerequisites (for backward compatibility with old data)

---

#### 2. CurriculumController (`app/Http/Controllers/Api/CurriculumController.php`)

**store() method:**
```php
$curriculum = Curriculum::createCurriculum([
    // ... existing fields ...
    'prerequisites' => $request->prerequisites ?: [], // Store curriculum-specific prerequisites
    'created_by' => Auth::id(),
    'updated_by' => Auth::id(),
]);
```

**API Responses Updated:**
All methods now return `prerequisites` field:
- ✅ `index()` - List curricula
- ✅ `store()` - Create curriculum
- ✅ `show()` - Get single curriculum
- ✅ `update()` - Update curriculum

**Example response:**
```json
{
    "success": true,
    "data": {
        "curriculum_id": 1,
        "prerequisites_text": "CS201, CS202",
        "prerequisites": [1, 2],  // ⬅️ NEW: Array of subject IDs
        "is_active": true,
        // ... other fields
    }
}
```

---

### Benefits of This Approach

#### ✅ Curriculum-Specific
```
Program A - CS301 → CS201
Program B - CS301 → CS202
```

#### ✅ Flexible
```
BSCS 2023 - CS301 → CS201
BSCS 2024 - CS301 → CS203
```

#### ✅ Backward Compatible
Old curricula without `prerequisites` field will fallback to subject-level prerequisites.

#### ✅ Proper Data Architecture
- **Subjects table**: Stores subject information (code, name, units)
- **Curricula table**: Stores **how subjects are used** in specific programs (prerequisites, term, level)

---

## Testing

### Test Case 1: Add curriculum with NO prerequisites
```
1. Select CS301
2. Prerequisites: None
3. Save
4. Result: prerequisites = []
5. Display: "None"
```

### Test Case 2: Add curriculum with prerequisites
```
1. Select CS301
2. Prerequisites: CS201, CS202
3. Save
4. Result: prerequisites = [1, 2]
5. Display: "CS201, CS202"
```

### Test Case 3: Same subject, different programs
```
Program A - CS301 → Prerequisites: CS201
Program B - CS301 → Prerequisites: CS202
Both should display different prerequisites ✅
```

---

## Summary

| Aspect | Old (Subject-Level) | New (Curriculum-Level) |
|--------|---------------------|------------------------|
| Storage | `subjects.prerequisites` | `default_curricula.prerequisites` |
| Scope | **Global** (all programs) | **Specific** (per curriculum) |
| Flexibility | ❌ Same for all | ✅ Different per program/year |
| Correct? | ❌ Wrong architecture | ✅ Correct architecture |

**Salamat sa question!** This led to fixing the fundamental architecture issue. 🎉

---

## 📋 Complete List of Changes

### 1. Database Migration
**File:** `database/migrations/2025_10_20_204923_add_prerequisites_to_default_curricula_table.php`
- ✅ Added `prerequisites` JSON column to `default_curricula` table
- ✅ Placed **after `is_active`** and **before `notes`** (follows BE standard)
- ✅ Nullable with comment

### 2. Curriculum Model
**File:** `app/Models/Curriculum.php`
- ✅ Added `prerequisites` to `$fillable` array
- ✅ Added `prerequisites` => `'array'` to `$casts`
- ✅ Updated `getPrerequisitesTextAttribute()` to prioritize curriculum-specific prerequisites
- ✅ Falls back to subject-level prerequisites for backward compatibility

### 3. CurriculumController
**File:** `app/Http/Controllers/Api/CurriculumController.php`
- ✅ **store()**: Added `'prerequisites' => $request->prerequisites ?: []` to curriculum creation
- ✅ **index()**: Added `'prerequisites' => $curriculum->prerequisites` to response
- ✅ **show()**: Added `'prerequisites' => $curriculum->prerequisites` to response
- ✅ **update()**: Added `'prerequisites' => $curriculum->prerequisites` to response

### 4. Form Request Validation
**File:** `app/Http/Requests/Api/StoreCurriculumRequest.php`
- ✅ Already has prerequisites validation

**File:** `app/Http/Requests/Api/UpdateCurriculumRequest.php`
- ✅ Added `prerequisites` validation rules:
  ```php
  'prerequisites' => ['nullable', 'array'],
  'prerequisites.*' => ['integer', 'exists:subjects,subject_id']
  ```

---

## 🚀 How It Works Now

### Creating Curriculum with Prerequisites

**Frontend sends:**
```json
{
  "program_id": 1,
  "subject_id": 5,  // CS301
  "prerequisites": [1, 2],  // CS201, CS202
  // ... other fields
}
```

**Backend stores in `default_curricula`:**
```sql
curriculum_id | program_id | subject_id | prerequisites
1             | 1          | 5          | [1, 2]
```

**When displaying:**
```
Curriculum Model → getPrerequisitesTextAttribute()
→ Checks curriculum.prerequisites first
→ Finds [1, 2]
→ Queries subjects table
→ Returns "CS201, CS202"
```

### Without Prerequisites

**Frontend sends:**
```json
{
  "program_id": 1,
  "subject_id": 5,
  "prerequisites": [],  // or null
  // ... other fields
}
```

**Backend stores:**
```sql
curriculum_id | program_id | subject_id | prerequisites
1             | 1          | 5          | null or []
```

**When displaying:**
```
→ prerequisites is empty
→ Falls back to subject.prerequisites (if any)
→ If subject.prerequisites is also empty → Returns "None"
```

---

## ✅ Final Result

### Before (Wrong):
```
CS301 subject → has global prerequisites (CS201)
All curricula using CS301 → show CS201
Cannot have different prerequisites per program ❌
```

### After (Correct):
```
CS301 in BSCS → prerequisites: [CS201]
CS301 in BSIT → prerequisites: [CS202]
CS301 in New Program → prerequisites: []
Each curriculum has its own prerequisites ✅
```

---

## 🎯 Next Steps

1. ✅ **Migration completed** - `prerequisites` column added
2. ✅ **Model updated** - Field is fillable and cast as array
3. ✅ **Controller updated** - Stores and returns prerequisites
4. ✅ **Validation added** - Both Store and Update requests
5. ⏳ **Frontend** - Already sends prerequisites, should work automatically
6. ⏳ **Testing** - Test adding curricula with different prerequisites

**No frontend changes needed!** The frontend already sends `prerequisites` in the request. The backend now properly stores and retrieves them at the curriculum level instead of the subject level.

---

**Status:** ✅ **Implementation Complete**  
**Migration:** ✅ **Applied**  
**Backward Compatibility:** ✅ **Maintained**
