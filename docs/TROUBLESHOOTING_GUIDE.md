# Calendar Visibility Rules - Troubleshooting Guide

## 🔍 **HOW TO DEBUG THE ISSUES**

### **Step 1: Open Browser Console**

1. Press `F12` or right-click → Inspect
2. Go to **Console** tab
3. Clear console (trash icon)
4. Keep console open

---

## 🐛 **Issue 1: 422 Validation Error (Can't Create Rules)**

### **Steps to Diagnose:**

1. **Go to Calendar Visibility Rules page**
2. **Click "Add Rule" button**
3. **Fill in the form:**
   - Rule Name: `Students Only`
   - Description: `Visible only to students`
   - Select at least one role (e.g., "Student")
   - Check "Active"
4. **Click "Create Rule"**
5. **Check Console Output**

### **What to Look For in Console:**

```javascript
=== FORM SUBMISSION DEBUG ===
Form data being submitted: {
  "visibility_name": "Students Only",
  "description": "Visible only to students",
  "visible_to_role_ids": [1, 2, 3],  // ← Check if these are numbers
  "visible_to_program_ids": [],
  "visible_to_campus_ids": [],
  "is_active": true
}

Field types: {
  visibility_name: "string",
  description: "string",
  visible_to_role_ids: "array",      // ← Should be "array"
  visible_to_program_ids: "array",
  visible_to_campus_ids: "array",
  is_active: "boolean"
}

Array lengths: {
  roles: 1,        // ← Should be > 0
  programs: 0,
  campuses: 0
}

Creating visibility rule with data: { ... }

=== CREATE RULE ERROR ===
Status: 422
Full error response: {
  "success": false,
  "message": "Validation failed",
  "errors": {
    "field_name": ["specific error message"]  // ← LOOK HERE!
  }
}
```

### **Common Validation Errors & Fixes:**

#### **Error 1: "visible_to_role_ids must be an array of integers"**

**Cause:** Frontend sending strings instead of numbers

**Fix:** Check `EnhancedSelect` component - ensure it returns integers:

```javascript
// In EnhancedSelect.jsx, onChange should return:
onChange(selected.map((item) => parseInt(item.value))); // Convert to int
```

#### **Error 2: "visible_to_role_ids is required"**

**Cause:** Empty array not accepted

**Fix:** Backend validation might be too strict. Backend needs to allow empty arrays.

#### **Error 3: "description must be a string or null"**

**Cause:** Backend expects null for empty description, not empty string

**Fix in form:**

```javascript
const payload = {
  ...formData,
  description: formData.description || null, // Convert empty string to null
};
```

#### **Error 4: Field name mismatch**

**Cause:** Backend expects different field names

**Example:**

- Backend expects: `role_ids`
- Frontend sends: `visible_to_role_ids`

**Fix:** Update field names to match backend expectations.

### **Copy This Info:**

Once you see the console output, copy and share:

1. The "Form data being submitted" object
2. The "Full error response" object
3. The specific error messages

---

## 🐛 **Issue 2: Rules Not Appearing in List**

### **Steps to Diagnose:**

1. **Go to Calendar Visibility Rules page**
2. **Wait for page to load**
3. **Check Console Output**

### **What to Look For in Console:**

```javascript
=== FETCHING VISIBILITY RULES ===

Raw API response for getVisibilityRules: {
  "success": true,
  "message": "Rules retrieved successfully",
  "data": [...]  // ← Check structure here
}

API result structure: {
  success: true,
  hasData: true,
  dataType: "object",      // ← Should be "object"
  isArray: false,           // ← Check if true or false
  hasNestedData: true       // ← Check if data.data exists
}

Full result.data: {
  "success": true,
  "message": "...",
  "data": [
    {
      "calendar_visibility_id": 1,
      "visibility_name": "Students Only",
      ...
    }
  ]
}

✅ Data is nested in result.data.data
Extracted rules: [{ ... }]
Number of rules: 5        // ← Should match actual number
First rule (if exists): { calendar_visibility_id: 1, ... }
```

### **Common Data Structure Issues:**

#### **Case 1: Direct Array**

```javascript
// API returns:
{
  success: true,
  data: [rule1, rule2, rule3]  // ← Array directly in data
}

// Expected console: "✅ Data is direct array"
// Rule count should match
```

#### **Case 2: Nested Data**

```javascript
// API returns:
{
  success: true,
  data: {
    success: true,
    message: "...",
    data: [rule1, rule2, rule3]  // ← Array in data.data
  }
}

// Expected console: "✅ Data is nested in result.data.data"
// Rule count should match
```

#### **Case 3: Empty Array**

```javascript
// API returns:
{
  success: true,
  data: {
    data: []  // ← No rules!
  }
}

// Expected console: "Number of rules: 0"
// Issue: Rules exist in database but API returns empty
```

### **If Rules Count is 0:**

**Check 1: Database**

- Verify rules exist in database
- Run SQL: `SELECT * FROM academic_calendar_visibility;`

**Check 2: Backend API**

- Test endpoint directly: `GET http://localhost:8000/api/v1/academic-calendar-visibility`
- Check response structure

**Check 3: Filters**

- Check if status filter is set to "Active" but all rules are inactive
- Click "Clear" button to reset filters

### **If Rules Count > 0 but Not Visible:**

**Check 1: Rendering**

```javascript
// In console, check:
console.log("Filtered rules:", filteredRules);
console.log("Paginated rules:", paginatedRules);
```

**Check 2: Filtering Logic**

- Search box might have text
- Status filter might be excluding rules
- Pagination might be on wrong page

**Check 3: Card Rendering**

- Check browser console for React errors
- Look for red error messages

### **Copy This Info:**

Once you see the console output, copy and share:

1. The "Raw API response" object
2. The "API result structure" object
3. The "Number of rules" value
4. The "First rule (if exists)" object

---

## 📋 **Quick Checklist**

### **Before Troubleshooting:**

- [ ] Backend server is running (`http://localhost:8000`)
- [ ] Frontend server is running (`http://localhost:5174`)
- [ ] Browser console is open (F12)
- [ ] Console is cleared (trash icon)

### **For 422 Error:**

- [ ] Check "Form data being submitted"
- [ ] Verify field types (should be array, string, boolean)
- [ ] Check array contents (numbers vs strings)
- [ ] Look at "Full error response"
- [ ] Read specific validation error messages

### **For Missing Rules:**

- [ ] Check "Raw API response"
- [ ] Verify data structure (direct array vs nested)
- [ ] Check "Number of rules" (should be > 0)
- [ ] Verify filters are not hiding rules
- [ ] Check if search box is empty

---

## 🔧 **Quick Fixes**

### **Fix 1: Convert IDs to Integers**

In `EnhancedSelect.jsx` or `VisibilityRuleForm.jsx`:

```javascript
// Ensure IDs are converted to integers
const handleRoleChange = (selectedValues) => {
  const roleIds = selectedValues.map((v) => parseInt(v, 10));
  handleChange("visible_to_role_ids", roleIds);
};
```

### **Fix 2: Handle Null Description**

In `VisibilityRuleForm.jsx` submission:

```javascript
const payload = {
  visibility_name: formData.visibility_name,
  description: formData.description || null, // Convert empty to null
  visible_to_role_ids: formData.visible_to_role_ids,
  visible_to_program_ids: formData.visible_to_program_ids,
  visible_to_campus_ids: formData.visible_to_campus_ids,
  is_active: formData.is_active,
};
```

### **Fix 3: Handle Data Path**

Already implemented - tries multiple paths:

```javascript
// This code already exists
let rules = [];
if (Array.isArray(result.data)) {
  rules = result.data;
} else if (result.data?.data && Array.isArray(result.data.data)) {
  rules = result.data.data;
}
```

---

## 🎯 **Expected Console Output (Working)**

### **When Creating Rule (Success):**

```
=== FORM SUBMISSION DEBUG ===
Form data being submitted: {...}
Field types: {all correct types}
Array lengths: {roles: 1, ...}
Creating visibility rule with data: {...}

=== API RESPONSE ===
Result: {
  "success": true,
  "data": {...},
  "message": "Visibility rule created successfully"
}
```

### **When Fetching Rules (Success):**

```
=== FETCHING VISIBILITY RULES ===
Raw API response: {...}
API result structure: {success: true, hasData: true, ...}
✅ Data is nested in result.data.data
Extracted rules: [{...}, {...}]
Number of rules: 5
First rule (if exists): {calendar_visibility_id: 1, ...}
```

---

## 📞 **What to Share When Asking for Help**

**For 422 Error:**

```
Issue: Can't create visibility rule (422 error)

Console output:
1. Form data being submitted: [paste here]
2. Field types: [paste here]
3. Full error response: [paste here]
4. Validation errors: [paste here]
```

**For Missing Rules:**

```
Issue: Created rules don't appear in list

Console output:
1. Raw API response: [paste here]
2. API result structure: [paste here]
3. Number of rules: [paste here]
4. First rule: [paste here]

Additional info:
- Can see rule in Academic Calendar dropdown: Yes/No
- Any filters active: Yes/No
- Search box content: [empty/text]
```

---

## ✅ **Next Steps**

1. **Open the app in browser**
2. **Open browser console (F12)**
3. **Try to create a rule**
4. **Copy all console output**
5. **Try to view rules list**
6. **Copy all console output**
7. **Share the output**

The detailed logs will show us exactly what's happening! 🎯
