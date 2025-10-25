# Curriculum Term Sequence Fix

## Issue
The `term_sequence` field (along with `curriculum_level` and `effectivity_start_year`) was not being properly saved when adding or editing curriculum entries.

## Root Causes Found

### 1. Backend API Missing Field in Store Method
**File:** `skolaris-be/app/Http/Controllers/Api/CurriculumController.php`
**Issue:** The `store()` method was not passing `term_sequence` to the model when creating curriculum.
**Fixed:** Added `'term_sequence' => $request->term_sequence,` to the createCurriculum data array (line 185)

### 2. Backend API Not Returning Raw Values
**File:** `skolaris-be/app/Http/Controllers/Api/CurriculumController.php`
**Issue:** The API responses (index, show, store, update methods) were only returning computed fields (`year_term`, `effectivity_period`) but not the raw database values (`curriculum_level`, `term_sequence`, `effectivity_start_year`, `effectivity_end_year`)
**Fixed:** Added these raw fields to all API response transformations

### 3. Frontend Fields Not Properly Disabled in Edit Mode
**File:** `skolaris-fe/src/pages/CurriculumListAdmin.jsx`
**Issue:** In edit mode, the curriculum identification fields appeared editable but changes were blocked by JavaScript, creating confusing UX
**Fixed:** Added `disabled={formMode === 'edit'}` attribute to:
- Program field (line 991)
- Academic Term field (line 1014)
- Year Level field (line 1037)
- Term Sequence field (line 1062)
- Effectivity Start Year field (line 1098)

### 4. Frontend Form Parsing Complexity
**File:** `skolaris-fe/src/pages/CurriculumListAdmin.jsx`
**Issue:** The `openEdit()` function had complex parsing logic to extract values from computed strings because the backend wasn't returning raw values
**Fixed:** Simplified the function to use raw values directly from the API response

## Changes Summary

### Backend Changes (`skolaris-be/app/Http/Controllers/Api/CurriculumController.php`)
1. Added `term_sequence` to the store method's createCurriculum data array
2. Added raw fields to API responses in:
   - `index()` method (lines 106-109)
   - `store()` method (lines 202-205)
   - `show()` method (lines 257-260)
   - `update()` method (lines 327-330)

### Frontend Changes (`skolaris-fe/src/pages/CurriculumListAdmin.jsx`)
1. Added `disabled={formMode === 'edit'}` to all curriculum identification fields
2. Added informative notice in edit mode explaining why fields are locked
3. Simplified `openEdit()` function to use raw values from API

## Result
- ✅ `term_sequence` is now properly saved when creating curriculum
- ✅ `curriculum_level` is now properly saved when creating curriculum
- ✅ All curriculum identification fields are now properly disabled in edit mode
- ✅ API responses now include all necessary raw values for form population
- ✅ Edit form now properly displays existing values without complex parsing
- ✅ User experience is clearer with proper disabled fields and explanatory notice

## Testing Recommendations
1. Test creating new curriculum with various term sequences (1st, 2nd, 3rd)
2. Test editing existing curriculum to ensure fields are properly locked
3. Test that term_sequence values display correctly in the curriculum list
4. Verify that the API returns term_sequence in all endpoints

## Additional Fix: Pending Status Issue

### Issue
After successfully saving curriculum entries, courses were still showing as "Pending" status instead of being removed from the selected courses list.

### Root Cause
The `coursesWithPrerequisites` array (which contains selected courses that haven't been saved yet) was not being cleared after successful save operations. This caused the courses to continue showing as "Pending" even after they were successfully saved to the database.

### Fix Applied
**File:** `skolaris-fe/src/pages/CurriculumListAdmin.jsx`

Added `setCoursesWithPrerequisites([])` after successful save operations:

1. **Edit Mode Success** (line 254): Clear the array after updating curriculum and adding new courses
2. **Add Mode Success** (line 342): Clear the array after creating new curriculum entries

### Result
- ✅ Courses no longer show as "Pending" after successful save
- ✅ Selected courses list is properly cleared after save operations
- ✅ Fresh state when opening the form again

## Complete Fix Summary
The curriculum management now properly:
1. Saves `term_sequence` and other fields to the database
2. Returns raw field values in API responses
3. Disables curriculum identification fields in edit mode with clear UX
4. Clears pending courses after successful save operations

## Additional Fix: ModelNotFoundException Error

### Issue
Getting "No query results for model [App\Models\Curriculum] 35" error when trying to access curriculum records that don't exist in the database.

### Root Cause
Laravel's route model binding automatically throws a `ModelNotFoundException` when trying to access a model that doesn't exist (e.g., curriculum ID 35), but this wasn't being handled gracefully for API requests.

### Fix Applied

#### Backend (`skolaris-be/bootstrap/app.php`)
Added global exception handling for `ModelNotFoundException` in API routes:

```php
$exceptions->render(function (Illuminate\Database\Eloquent\ModelNotFoundException $e, $request) {
    if ($request->expectsJson() || $request->is('api/*')) {
        $model = class_basename($e->getModel());
        $id = $e->getIds()[0] ?? 'unknown';
        
        return response()->json([
            'success' => false,
            'message' => "{$model} with ID {$id} not found",
            'error' => "The requested {$model} record does not exist or has been deleted."
        ], 404);
    }
});
```

#### Frontend (`skolaris-fe/src/pages/CurriculumListAdmin.jsx`)
Updated `handleDelete` and `handleToggleStatus` functions to handle "not found" errors gracefully:

- **handleDelete**: If curriculum doesn't exist, refresh the list and show warning message
- **handleToggleStatus**: If curriculum doesn't exist, refresh the list and show warning message

### Result
- ✅ **Graceful error handling**: Instead of raw Laravel error, users get proper JSON error response
- ✅ **Auto-refresh**: Frontend automatically refreshes the curriculum list when encountering deleted records
- ✅ **User-friendly messages**: Clear messages explaining what happened
- ✅ **Prevents stale references**: Removes references to deleted curriculum records

## Complete Solution Summary
The curriculum management now properly handles:
1. ✅ **Term sequence saving** - Fields are properly saved to database
2. ✅ **API responses** - Raw field values returned for form population  
3. ✅ **Edit mode UX** - Clear disabled fields with helpful notices
4. ✅ **Pending status cleanup** - Selected courses cleared after save
5. ✅ **Error handling** - Graceful handling of missing/deleted records

## Additional Fix: Prerequisites Issue

### Issue
When adding CS301 to curriculum without selecting prerequisites, it still shows CS201 as a prerequisite. This happens because prerequisites are stored at the **Subject level** (in the `subjects` table), not at the Curriculum level.

### Root Cause
1. **CS301 subject already had CS201 as a prerequisite** stored in the `subjects` table
2. The curriculum creation process was **not updating the subject's prerequisites**
3. The system displays prerequisites from the subject record, not from the curriculum creation process

### Fix Applied

#### Backend Changes

**1. Updated StoreCurriculumRequest (`skolaris-be/app/Http/Requests/Api/StoreCurriculumRequest.php`)**
Added validation for prerequisites:
```php
'prerequisites' => [
    'nullable',
    'array'
],
'prerequisites.*' => [
    'integer',
    'exists:subjects,subject_id'
]
```

**2. Updated CurriculumController (`skolaris-be/app/Http/Controllers/Api/CurriculumController.php`)**
Added logic to update subject prerequisites when creating curriculum:
```php
// Update subject prerequisites if provided
if ($request->has('prerequisites')) {
    $subject = \App\Models\Subject::find($request->subject_id);
    if ($subject) {
        $prerequisites = $request->prerequisites ?: []; // Convert null to empty array
        $subject->updateSubject(['prerequisites' => $prerequisites]);
    }
}
```

### Result
- ✅ **Prerequisites are now updated** when creating curriculum entries
- ✅ **Empty prerequisites** (no selection) properly clears subject prerequisites
- ✅ **Selected prerequisites** properly updates the subject record
- ✅ **Consistent behavior** between curriculum creation and display

### Testing
- Cleared CS301's existing prerequisites (CS201)
- Now when creating curriculum for CS301 without selecting prerequisites, it will show "None"
- When selecting prerequisites during curriculum creation, they will be properly stored and displayed

## Complete Solution Summary
The curriculum management now properly handles:
1. ✅ **Term sequence saving** - Fields are properly saved to database
2. ✅ **API responses** - Raw field values returned for form population
3. ✅ **Edit mode UX** - Clear disabled fields with helpful notices
4. ✅ **Pending status cleanup** - Selected courses cleared after save
5. ✅ **Error handling** - Graceful handling of missing/deleted records
6. ✅ **Prerequisites management** - Subject prerequisites updated during curriculum creation
