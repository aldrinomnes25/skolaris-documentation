# How to Assign Multiple Roles to a User

## Quick Answer: YES! ✅

Your SKOLARIS system **fully supports multiple roles per user**. Here's how to use it:

---

## 🎯 Step-by-Step Guide

### **Method 1: Via Role Management (Current UI)**

1. **Assign First Role:**

   - Go to **Role Management** page
   - Find the role you want to assign (e.g., "Faculty")
   - Click the **Assign Users** button (blue icon)
   - Search for the user
   - Check the checkbox next to their name
   - Click **Update Assignments**
   - ✅ User now has "Faculty" role

2. **Assign Second Role:**

   - Find another role (e.g., "Registrar")
   - Click **Assign Users** button
   - Search for the **same user**
   - Check the checkbox
   - Click **Update Assignments**
   - ✅ User now has BOTH "Faculty" AND "Registrar" roles!

3. **Verify:**
   - Go back to first role ("Faculty")
   - Click **Assign Users**
   - User will appear in "Already Assigned" section with blue background
   - Go to second role ("Registrar")
   - User will also appear as assigned there!

---

## 📊 How It Appears in the UI

### **Role: Faculty**

```
┌─────────────────────────────────────────────┐
│ Assign Users to Role: Faculty               │
├─────────────────────────────────────────────┤
│ [Search box]                                │
│                                             │
│ ╔═══════════════════════════════════════╗ │
│ ║ ALREADY ASSIGNED (5)                  ║ │
│ ╚═══════════════════════════════════════╝ │
│ ┌──────────────────────────────────────┐  │
│ │ • John Doe                  [Assigned]│  │
│ │   john@icct.edu.ph         [Remove] │  │
│ │   Faculty • Active                   │  │
│ └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### **Role: Registrar**

```
┌─────────────────────────────────────────────┐
│ Assign Users to Role: Registrar             │
├─────────────────────────────────────────────┤
│ [Search box]                                │
│                                             │
│ ╔═══════════════════════════════════════╗ │
│ ║ ALREADY ASSIGNED (3)                  ║ │
│ ╚═══════════════════════════════════════╝ │
│ ┌──────────────────────────────────────┐  │
│ │ • John Doe                  [Assigned]│  │
│ │   john@icct.edu.ph         [Remove] │  │
│ │   Faculty • Active                   │  │
│ └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**Same user appears in BOTH roles!** ✅

---

## 🔍 Real-World Scenarios

### **Scenario 1: Department Head who also teaches**

```
User: Dr. Maria Santos
Roles Assigned:
- Department Head (Level 3)
- Faculty (Level 4)

Access:
✅ Can manage department
✅ Can view faculty schedules
✅ Can manage subjects and grades
✅ Can view student records
```

### **Scenario 2: Campus Admin who also handles registrar duties**

```
User: Mr. Juan Cruz
Roles Assigned:
- Campus Admin (Level 2)
- Registrar (Level 3)

Access:
✅ Can manage entire campus
✅ Can approve enrollments
✅ Can generate reports
✅ Can manage academic terms
```

### **Scenario 3: Student working as Library Assistant**

```
User: Anna Reyes
Roles Assigned:
- Student (Level 5)
- Library Assistant (Level 4)

Access:
✅ Can view own grades
✅ Can enroll in subjects
✅ Can manage library books
✅ Can process book returns
```

---

## 💡 How Permissions Work with Multiple Roles

### **Rule: Combined Permissions (Union)**

When a user has multiple roles, they get **ALL permissions** from **ALL roles**:

```
Faculty Role Permissions:
- View Students
- Manage Grades
- View Subjects

Registrar Role Permissions:
- Manage Enrollments
- Generate Reports
- View Academic Records

User with BOTH roles gets:
✅ View Students
✅ Manage Grades
✅ View Subjects
✅ Manage Enrollments
✅ Generate Reports
✅ View Academic Records
```

**It's an OR operation, not AND!**

---

## 🎨 UI Navigation Priority

When user has multiple roles, **highest-level role** determines navigation:

```javascript
User Roles: ["Campus Admin" (Level 2), "Faculty" (Level 4)]

Navigation shown: Campus Admin navigation (Level 2 wins!)
But user also has Faculty permissions available.
```

Priority Order:

1. Super Admin (Level 1) - **Highest**
2. Campus Admin (Level 2)
3. Department Head (Level 3)
4. Faculty (Level 4)
5. Student (Level 5) - **Lowest**

---

## 🛠️ Technical Details

### **Database Structure**

```
users table:
- user_id (PK)
- full_name
- email
- ...

roles table:
- role_id (PK)
- role_name
- role_level
- ...

user_roles table (Junction):
- user_role_id (PK)
- user_id (FK)
- role_id (FK)
- assigned_at
- is_active
- UNIQUE(user_id, role_id) ← Prevents duplicates
```

### **Example Data**

```sql
-- User: John Doe (user_id = 123)

-- Multiple entries in user_roles:
INSERT INTO user_roles VALUES
(1, 123, 5, '2025-01-15 10:00:00', true), -- Faculty
(2, 123, 7, '2025-02-20 14:30:00', true); -- Registrar

-- One user, two roles! ✅
```

---

## 🚨 Important Notes

### ✅ What WORKS:

- ✅ One user can have **unlimited** roles
- ✅ Each role assignment is **independent**
- ✅ Can **add/remove** roles individually
- ✅ **No limit** on number of roles per user
- ✅ Permissions are **combined** (union)
- ✅ Can **enable/disable** specific role assignments

### ⚠️ What to AVOID:

- ❌ Don't assign same role twice (prevented by database)
- ❌ Don't remove all roles from a user (they need at least one)
- ❌ Be careful with conflicting roles (e.g., Student + Faculty)
- ❌ Don't forget to check `is_active` status

---

## 🔐 Security Implications

### **Access Level:**

```
If user has ANY of these roles:
- Super Admin
- Campus Admin

They get the HIGHEST access level!

This is CORRECT behavior for security:
✅ Grant access if user has ANY qualifying role
❌ Don't require ALL roles
```

### **Permission Checking:**

```javascript
// Correct ✅
if (user?.roles?.includes("Campus Admin")) {
  // Grant campus admin access
}

// Also correct ✅
if (
  user?.roles?.some((role) => ["Super Admin", "Campus Admin"].includes(role))
) {
  // Grant admin access
}

// WRONG ❌
if (user?.roles?.length === 1 && user?.roles[0] === "Campus Admin") {
  // This fails if user has multiple roles!
}
```

---

## 📈 Viewing User's Current Roles

### **Frontend (Current Implementation):**

```javascript
// In components
{
  user?.roles?.map((role) => (
    <span key={role} className="badge">
      {role}
    </span>
  ));
}

// Example output:
// [Faculty] [Registrar]
```

### **Backend API:**

```bash
GET /api/v1/users/123

Response:
{
    "user_id": 123,
    "full_name": "John Doe",
    "email": "john@icct.edu.ph",
    "roles": [
        {
            "role_id": 5,
            "role_name": "Faculty",
            "role_level": 4,
            "assigned_at": "2025-01-15 10:00:00",
            "is_active": true
        },
        {
            "role_id": 7,
            "role_name": "Registrar",
            "role_level": 3,
            "assigned_at": "2025-02-20 14:30:00",
            "is_active": true
        }
    ]
}
```

---

## 🎯 Summary

**Your SKOLARIS system FULLY SUPPORTS multiple roles per user!** 🎉

### **Key Takeaways:**

1. ✅ Users can have **multiple roles** simultaneously
2. ✅ Assign roles **independently** through Role Management
3. ✅ Each role keeps its own assignment record
4. ✅ Permissions are **combined** from all roles
5. ✅ **Highest role level** determines navigation
6. ✅ No code changes needed - **already working!**

### **To assign multiple roles:**

- Go to Role Management
- Assign first role to user
- Assign second role to same user
- ✅ Done! User now has both roles!

---

## 🚀 Optional Enhancements

If you want to make it even better, consider:

1. **Show all user roles as badges in user list**
2. **Add "Primary Role" selector for users with multiple roles**
3. **Display role count next to username**
4. **Allow bulk role assignment (multiple roles at once)**
5. **Add role switching UI (for users to switch context)**

Let me know if you want any of these! 🚀

