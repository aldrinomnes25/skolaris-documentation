# Postman Collection Updates - Curriculum API

**Date:** October 21, 2025  
**Related Commit:** `d769eca`

## 📌 Overview

This document outlines all Postman collection updates required for the new curriculum prerequisites feature and enhanced API responses.

---

## 🔄 Endpoints to Update

### 1. **GET /api/curricula** (List All Curricula)

**Collection Path:** `SKOLARIS API > Curriculum Management > List Curricula`

#### Changes:

- ✅ Response now includes additional fields

#### Updated Response Body:

```json
{
  "success": true,
  "message": "Curricula retrieved successfully",
  "data": [
    {
      "curriculum_id": 1,
      "effectivity_period": "2024-2025",
      "effectivity_start_year": 2024, // NEW
      "effectivity_end_year": 2025, // NEW
      "curriculum_level": 1, // NEW
      "term_sequence": 1, // NEW
      "program_abbreviation": "BSIT",
      "year_term": "1st Year - 1st Semester",
      "subject_with_code": "Introduction to Computing (CS101)",
      "units": "3.0",
      "prerequisites_text": "MATH101, ENG101",
      "prerequisites": [5, 8], // NEW
      "is_active": true,
      "is_ongoing": false,
      "notes": null
    }
  ]
}
```

#### Tests to Update:

```javascript
pm.test("Response has new curriculum fields", function () {
  var data = pm.response.json().data[0];
  pm.expect(data).to.have.property("effectivity_start_year");
  pm.expect(data).to.have.property("effectivity_end_year");
  pm.expect(data).to.have.property("curriculum_level");
  pm.expect(data).to.have.property("term_sequence");
  pm.expect(data).to.have.property("prerequisites");
  pm.expect(data.prerequisites).to.be.an("array");
});
```

---

### 2. **POST /api/curricula** (Create Curriculum)

**Collection Path:** `SKOLARIS API > Curriculum Management > Create Curriculum`

#### Changes:

- ✅ Added `term_sequence` field to request body
- ⚠️ Changed `status` to `is_active`
- ✅ Added `prerequisites` array to request body

#### Updated Request Body:

```json
{
  "program_id": 1,
  "subject_id": 10,
  "academic_term_id": 1,
  "curriculum_level": 2,
  "term_sequence": 1, // NEW - Required
  "effectivity_start_year": 2024,
  "effectivity_end_year": 2025,
  "is_ongoing": false,
  "is_active": true, // CHANGED from "status"
  "prerequisites": [5, 8, 12], // NEW - Optional array of subject IDs
  "notes": "Updated curriculum for 2024"
}
```

#### Request Body Examples:

**With Prerequisites:**

```json
{
  "program_id": 1,
  "subject_id": 15,
  "academic_term_id": 2,
  "curriculum_level": 2,
  "term_sequence": 2,
  "effectivity_start_year": 2024,
  "effectivity_end_year": 2025,
  "is_ongoing": false,
  "is_active": true,
  "prerequisites": [10, 12],
  "notes": "Advanced programming course"
}
```

**Without Prerequisites:**

```json
{
  "program_id": 1,
  "subject_id": 5,
  "academic_term_id": 1,
  "curriculum_level": 1,
  "term_sequence": 1,
  "effectivity_start_year": 2024,
  "effectivity_end_year": 2025,
  "is_ongoing": false,
  "is_active": true,
  "prerequisites": [],
  "notes": "Foundation course with no prerequisites"
}
```

#### Updated Response Body:

```json
{
  "success": true,
  "message": "Curriculum created successfully",
  "data": {
    "curriculum_id": 25,
    "effectivity_period": "2024-2025",
    "effectivity_start_year": 2024, // NEW
    "effectivity_end_year": 2025, // NEW
    "curriculum_level": 2, // NEW
    "term_sequence": 1, // NEW
    "program_abbreviation": "BSIT",
    "year_term": "2nd Year - 1st Semester",
    "subject_with_code": "Data Structures (CS201)",
    "units": "3.0",
    "prerequisites_text": "CS101, MATH101, ENG101",
    "prerequisites": [5, 8, 12], // NEW
    "is_active": true,
    "is_ongoing": false,
    "notes": "Updated curriculum for 2024"
  }
}
```

#### Tests to Update:

```javascript
pm.test("Curriculum created with prerequisites", function () {
  var data = pm.response.json().data;
  pm.expect(data).to.have.property("prerequisites");
  pm.expect(data.prerequisites).to.be.an("array");
  pm.expect(data).to.have.property("term_sequence");
});

pm.test("Response includes all new fields", function () {
  var data = pm.response.json().data;
  pm.expect(data).to.have.property("effectivity_start_year");
  pm.expect(data).to.have.property("effectivity_end_year");
  pm.expect(data).to.have.property("curriculum_level");
});
```

---

### 3. **GET /api/curricula/{id}** (Get Single Curriculum)

**Collection Path:** `SKOLARIS API > Curriculum Management > Get Curriculum`

#### Changes:

- ✅ Response now includes additional fields

#### Updated Response Body:

```json
{
  "success": true,
  "message": "Curriculum retrieved successfully",
  "data": {
    "curriculum_id": 1,
    "effectivity_period": "2024-2025",
    "effectivity_start_year": 2024, // NEW
    "effectivity_end_year": 2025, // NEW
    "curriculum_level": 1, // NEW
    "term_sequence": 1, // NEW
    "program_abbreviation": "BSIT",
    "year_term": "1st Year - 1st Semester",
    "subject_with_code": "Introduction to Computing (CS101)",
    "units": "3.0",
    "prerequisites_text": "None",
    "prerequisites": [], // NEW
    "is_active": true,
    "is_ongoing": false,
    "notes": null
  }
}
```

#### Error Response (New Format):

```json
{
  "success": false,
  "message": "Curriculum with ID 999 not found",
  "error": "The requested Curriculum record does not exist or has been deleted."
}
```

#### Tests to Update:

```javascript
pm.test("Response structure is correct", function () {
  var data = pm.response.json().data;
  pm.expect(data).to.have.property("effectivity_start_year");
  pm.expect(data).to.have.property("effectivity_end_year");
  pm.expect(data).to.have.property("curriculum_level");
  pm.expect(data).to.have.property("term_sequence");
  pm.expect(data).to.have.property("prerequisites");
});

// Add new test for 404 error
pm.test("404 error has proper structure", function () {
  if (pm.response.code === 404) {
    var json = pm.response.json();
    pm.expect(json).to.have.property("success", false);
    pm.expect(json).to.have.property("message");
    pm.expect(json).to.have.property("error");
  }
});
```

---

### 4. **PUT /api/curricula/{id}** (Update Curriculum)

**Collection Path:** `SKOLARIS API > Curriculum Management > Update Curriculum`

#### Changes:

- ✅ Can now update `prerequisites` array
- ⚠️ Changed `status` to `is_active` (if used)

#### Updated Request Body:

```json
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
  "prerequisites": [5, 8], // NEW - Can update prerequisites
  "notes": "Removed CS201 as prerequisite"
}
```

#### Request Body Examples:

**Update Only Prerequisites:**

```json
{
  "prerequisites": [5, 8, 12],
  "notes": "Added ENG101 as prerequisite"
}
```

**Remove All Prerequisites:**

```json
{
  "prerequisites": [],
  "notes": "Removed all prerequisites"
}
```

#### Updated Response Body:

```json
{
  "success": true,
  "message": "Curriculum updated successfully",
  "data": {
    "curriculum_id": 10,
    "effectivity_period": "2024-2025",
    "effectivity_start_year": 2024, // NEW
    "effectivity_end_year": 2025, // NEW
    "curriculum_level": 2, // NEW
    "term_sequence": 1, // NEW
    "program_abbreviation": "BSIT",
    "year_term": "2nd Year - 1st Semester",
    "subject_with_code": "Data Structures (CS201)",
    "units": "3.0",
    "prerequisites_text": "CS101, MATH101",
    "prerequisites": [5, 8], // NEW
    "is_active": true,
    "is_ongoing": false,
    "notes": "Removed CS201 as prerequisite"
  }
}
```

#### Tests to Update:

```javascript
pm.test("Prerequisites updated successfully", function () {
  var data = pm.response.json().data;
  pm.expect(data).to.have.property("prerequisites");
  pm.expect(data.prerequisites).to.be.an("array");
});
```

---

## 📝 Validation Error Responses

### Invalid Prerequisites (Subject ID doesn't exist)

**Request:**

```json
{
  "program_id": 1,
  "subject_id": 10,
  "prerequisites": [999, 1000] // Non-existent subject IDs
}
```

**Response (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "prerequisites.0": ["The selected prerequisites.0 is invalid."],
    "prerequisites.1": ["The selected prerequisites.1 is invalid."]
  }
}
```

### Invalid Prerequisites Type

**Request:**

```json
{
  "prerequisites": "CS101, MATH101" // Should be array, not string
}
```

**Response (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "prerequisites": ["The prerequisites field must be an array."]
  }
}
```

---

## 🔧 Quick Update Checklist

### For Each Endpoint:

- [ ] **List Curricula (GET /api/curricula)**
  - [ ] Update response example to include new fields
  - [ ] Add tests for new fields
- [ ] **Create Curriculum (POST /api/curricula)**
  - [ ] Add `term_sequence` to request body
  - [ ] Change `status` to `is_active`
  - [ ] Add `prerequisites` array to request body
  - [ ] Update response example
  - [ ] Update tests
- [ ] **Get Curriculum (GET /api/curricula/{id})**
  - [ ] Update response example to include new fields
  - [ ] Add tests for new fields
  - [ ] Add test for new 404 error format
- [ ] **Update Curriculum (PUT /api/curricula/{id})**
  - [ ] Add `prerequisites` to request body
  - [ ] Change `status` to `is_active` (if used)
  - [ ] Update response example
  - [ ] Update tests

---

## 📊 Environment Variables

No new environment variables required for these changes.

---

## 🧪 Testing Scenarios

### Scenario 1: Create Curriculum with Prerequisites

```
POST /api/curricula
Body: Include prerequisites array with valid subject IDs
Expected: 201 Created with prerequisites in response
```

### Scenario 2: Create Curriculum without Prerequisites

```
POST /api/curricula
Body: Empty prerequisites array or omit field
Expected: 201 Created with empty prerequisites array
```

### Scenario 3: Update Prerequisites

```
PUT /api/curricula/10
Body: New prerequisites array
Expected: 200 OK with updated prerequisites
```

### Scenario 4: Invalid Prerequisites

```
POST /api/curricula
Body: Include non-existent subject IDs in prerequisites
Expected: 422 Validation Error
```

### Scenario 5: Get Non-Existent Curriculum

```
GET /api/curricula/999999
Expected: 404 with new error format
```

---

## 📱 Sample Postman Collection JSON

Update your collection with this structure:

```json
{
  "name": "Create Curriculum",
  "request": {
    "method": "POST",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{token}}"
      },
      {
        "key": "Accept",
        "value": "application/json"
      }
    ],
    "body": {
      "mode": "raw",
      "raw": "{\n  \"program_id\": 1,\n  \"subject_id\": 10,\n  \"academic_term_id\": 1,\n  \"curriculum_level\": 2,\n  \"term_sequence\": 1,\n  \"effectivity_start_year\": 2024,\n  \"effectivity_end_year\": 2025,\n  \"is_ongoing\": false,\n  \"is_active\": true,\n  \"prerequisites\": [5, 8, 12],\n  \"notes\": \"Updated curriculum\"\n}",
      "options": {
        "raw": {
          "language": "json"
        }
      }
    },
    "url": {
      "raw": "{{base_url}}/api/curricula",
      "host": ["{{base_url}}"],
      "path": ["api", "curricula"]
    }
  }
}
```

---

## 💡 Tips for Testing

1. **Get Valid Subject IDs First:**

   ```
   GET /api/subjects
   ```

   Use the returned subject IDs for prerequisites testing

2. **Test Prerequisites Display:**

   - Create curriculum with prerequisites
   - Verify `prerequisites_text` shows correct subject codes
   - Verify `prerequisites` array matches input

3. **Test Edge Cases:**

   - Empty prerequisites array
   - Single prerequisite
   - Multiple prerequisites
   - Invalid subject IDs
   - Non-array prerequisites value

4. **Verify All Fields:**
   - Check all new fields are present in responses
   - Verify data types (arrays, integers, booleans)
   - Test null/empty values

---

## 📧 Support

If you encounter any issues updating the Postman collection, contact the development team.

**Last Updated:** October 21, 2025  
**Version:** 2.0
