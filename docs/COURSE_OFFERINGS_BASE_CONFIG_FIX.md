# Course Offerings Base Configuration Fix

## Issue

The Base Configuration section in the Create Course Offerings form was not functioning properly. Specifically:

- Programs dropdown was not updating when Campus was selected
- Academic Terms dropdown was not updating when Campus was selected
- The cascade of dropdowns (Campus → Program → Year Level → Semester) was broken

## Root Cause

The component was using unfiltered `initialPrograms` and `initialAcademicTerms` from the parent component (CourseOfferingsListAdmin) instead of using the hook's filtered `hookPrograms` and `hookAcademicTerms`.

The `useCourseOfferingConfig` hook properly filters programs and academic terms based on:

1. Selected campus
2. Curriculum availability (only programs with curriculum are shown)

But the component was prioritizing the parent's unfiltered data over the hook's filtered data.

## Solution

Modified the logic in `CourseOfferingFormAdmin.jsx` to:

1. **Always prioritize hook's filtered data** - Use `hookPrograms` and `hookAcademicTerms` when available
2. **Use initial data only as fallback** - Use `initialPrograms` and `initialAcademicTerms` only before the hook has loaded campus-filtered data

### Code Change

```javascript
// Before:
const programs = initialPrograms.length > 0 ? initialPrograms : hookPrograms;
const academicTerms =
  initialAcademicTerms.length > 0 ? initialAcademicTerms : hookAcademicTerms;

// After:
const programs =
  hookPrograms.length > 0
    ? hookPrograms
    : initialPrograms.length > 0
    ? initialPrograms
    : [];
const academicTerms =
  hookAcademicTerms.length > 0
    ? hookAcademicTerms
    : initialAcademicTerms.length > 0
    ? initialAcademicTerms
    : [];
```

## How It Works Now

1. **User selects a campus** → Hook loads programs filtered by that campus
2. **Programs dropdown updates** → Shows only programs for the selected campus that have curriculum
3. **User selects a program** → Hook loads curriculum info to show available year levels and semesters
4. **Cascade continues** → Year Level → Semester → Schedule Type

## Testing

- ✅ Create new course offering → Select campus → Programs dropdown updates
- ✅ Programs are filtered by campus
- ✅ Programs are filtered by curriculum availability
- ✅ Academic Terms are filtered by campus
- ✅ Cascade: Campus → Program → Year Level → Semester → Schedule Type

## Files Modified

- `src/pages/CourseOfferingFormAdmin.jsx` (lines 38-42)

## Date

January 2025
