# Course Offering Form - Campus Filtering Feature

## Date: 2025-01-27

## ✅ New Feature Added: Campus-Based Filtering

Added campus selection to the Add/Edit Course Offering form to filter Programs and Faculty based on the selected campus.

---

## 🎯 What Was Added

### 1. Campus Selection Field

- Added a campus dropdown at the top of the form
- Required field (\*)
- Beautiful card UI with Building icon
- Shows helper text: "Please select a campus to filter programs and faculty"

### 2. Cascading Filtering

When a campus is selected:

- **Programs dropdown** → Shows only programs from that campus
- **Faculty dropdown** → Shows only faculty from that campus
- Both dropdowns are disabled until campus is selected
- Clears dependent fields (program, faculty, subject) when campus changes

### 3. User Experience Improvements

- Form now shows clear dependency relationships
- Helpful error messages guide users through the form
- Visual feedback with disabled states

---

## 📝 Files Modified

### Frontend Changes:

**File:** `skolaris-fe/src/pages/CourseOfferingFormAdmin.jsx`

#### Added State:

```javascript
const [campuses, setCampuses] = useState([]);
const [formData, setFormData] = useState({
  campus_id: "", // ✅ NEW
  program_id: "",
  term_id: "",
  subject_id: "",
  faculty_id: "",
  year_level: "",
  semester: "",
  subject_type: "Core",
  max_slots: 40,
  is_available: true,
  is_active: true,
});
```

#### Added Load Functions:

```javascript
// Load campuses on component mount
const loadCampuses = async () => {
  const res = await campusService.getCampuses();
  // ... handles response
};

// Load programs filtered by campus
const loadPrograms = async () => {
  const params = formData.campus_id ? { campus_id: formData.campus_id } : {};
  const programsRes = await programService.getPrograms(params);
  // ... handles response
};

// Load faculty filtered by campus
const loadFaculty = async () => {
  const params = formData.campus_id ? { campus_id: formData.campus_id } : {};
  const facultyRes = await facultyService.getFaculty(params);
  // ... handles response
};
```

#### Added useEffect Hooks:

```javascript
// Load programs and faculty when campus changes
useEffect(() => {
  if (formData.campus_id) {
    // Reset dependent fields
    setFormData((prev) => ({
      ...prev,
      program_id: "",
      faculty_id: "",
      subject_id: "",
    }));

    loadPrograms();
    loadFaculty();
  }
}, [formData.campus_id]);
```

#### Updated Form UI:

```jsx
{
  /* Campus Selection - First */
}
<Card className="p-6">
  <div className="space-y-4">
    <div className="flex items-center space-x-2">
      <Building className="w-5 h-5 text-teal-500" />
      <h3 className="text-lg font-semibold">Campus Selection</h3>
    </div>

    <div>
      <Label htmlFor="campus_id">Campus *</Label>
      <Select
        id="campus_id"
        value={formData.campus_id}
        onChange={(e) => handleInputChange("campus_id", e.target.value)}
        placeholder="Select campus"
      >
        <option value="">Choose a campus</option>
        {campuses?.map((campus) => (
          <option key={campus.campus_id} value={campus.campus_id}>
            {campus.campus_name}
          </option>
        )) || []}
      </Select>
      {!formData.campus_id ? (
        <p className="text-sm text-gray-500 mt-1">
          Please select a campus to filter programs and faculty
        </p>
      ) : null}
    </div>
  </div>
</Card>;
```

#### Updated Program Dropdown:

```jsx
<Select
  id="program_id"
  value={formData.program_id}
  onChange={(e) => handleInputChange("program_id", e.target.value)}
  placeholder="Select program"
  disabled={!formData.campus_id} // ✅ Disabled until campus selected
>
  ...
</Select>;
{
  !formData.campus_id ? (
    <p className="text-sm text-gray-500 mt-1">Please select a campus first</p>
  ) : programs.length === 0 ? (
    <p className="text-sm text-yellow-600 mt-1">
      No programs available for this campus
    </p>
  ) : null;
}
```

#### Updated Faculty Dropdown:

```jsx
<Select
  id="faculty_id"
  value={formData.faculty_id}
  onChange={(e) => handleInputChange("faculty_id", e.target.value)}
  placeholder="Select faculty (optional)"
  disabled={!formData.campus_id} // ✅ Disabled until campus selected
>
  ...
</Select>;
{
  !formData.campus_id ? (
    <p className="text-sm text-gray-500 mt-1">Please select a campus first</p>
  ) : null;
}
```

#### Updated Validation:

```javascript
if (
  !formData.campus_id ||
  !formData.program_id ||
  !formData.term_id ||
  !formData.subject_id ||
  !formData.year_level ||
  !formData.semester
) {
  setError(
    "Please fill in all required fields (Campus, Program, Term, Subject, Year Level, and Semester)"
  );
  return;
}
```

---

## 🔄 Form Flow

### Before:

```
1. Select Program (from all programs)
2. Select Term
3. Select Year Level & Semester
4. Select Subject
5. Select Faculty (from all faculty)
...
```

### After:

```
1. Select Campus *               ← ✅ NEW
2. Select Program (filtered by campus)
3. Select Term
4. Select Year Level & Semester
5. Select Subject
6. Select Faculty (filtered by campus)
...
```

---

## 🎯 Benefits

### 1. **Better Data Organization**

- Course offerings are now properly associated with a campus
- Programs and faculty are filtered to relevant ones only
- Prevents mismatched campus assignments

### 2. **Improved User Experience**

- Reduces confusion by showing only relevant options
- Clear visual hierarchy and dependencies
- Helpful guidance messages

### 3. **Data Integrity**

- Prevents cross-campus assignments
- Ensures offerings are created for the correct campus
- Backend already supports campus filtering

---

## 🔧 Technical Details

### Backend Support

The backend already supported campus filtering:

- **ProgramController**: Filters programs by `campus_id` (line 31-33)
- **EmployeeController**: Uses `CampusFiltering` trait for automatic filtering

### Frontend Integration

- Uses existing `campusService.getCampuses()` for loading campuses
- Uses existing `programService.getPrograms({ campus_id })` for filtered programs
- Uses existing `facultyService.getFaculty({ campus_id })` for filtered faculty

### Form State Management

- Added `campus_id` to formData state
- Added `campuses` state array
- Updated all dependent useEffect hooks
- Clears dependent fields when campus changes

---

## ✅ Testing Checklist

- [x] Campus dropdown loads all campuses
- [x] Selecting campus filters programs
- [x] Selecting campus filters faculty
- [x] Program dropdown disabled until campus selected
- [x] Faculty dropdown disabled until campus selected
- [x] Dependent fields reset when campus changes
- [x] Form validation includes campus_id
- [x] Edit mode loads campus from existing offering
- [x] No linter errors

---

## 📝 Summary

Successfully added campus-based filtering to the Course Offering form. Users must now:

1. Select a campus first
2. Then select from campus-filtered programs
3. Then select from campus-filtered faculty

This ensures all course offerings are properly associated with the correct campus and prevents mismatched assignments.
