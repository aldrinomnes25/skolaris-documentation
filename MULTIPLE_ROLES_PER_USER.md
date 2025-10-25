# Multiple Roles Per User - Current Implementation

## ✅ YES! Your structure SUPPORTS multiple roles per user!

---

## 📊 Database Structure

### **`user_roles` Table (Junction/Pivot Table)**

```sql
CREATE TABLE user_roles (
    user_role_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT FOREIGN KEY -> users.user_id,
    role_id BIGINT FOREIGN KEY -> roles.role_id,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    -- Prevents duplicate assignments (same user + same role)
    UNIQUE KEY uk_user_role_unique (user_id, role_id)
)
```

### **Key Features:**

✅ **Many-to-Many Relationship** - One user can have multiple roles  
✅ **Unique Constraint** - Prevents duplicate role assignments  
✅ **Active Status** - Can enable/disable specific role assignments  
✅ **Timestamp Tracking** - Tracks when role was assigned

---

## 💻 Backend Implementation

### **1. User Model - `belongsToMany` Relationship**

```php
// app/Models/User.php
public function roles(): BelongsToMany
{
    return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id')
                ->withPivot(['assigned_at', 'is_active'])
                ->withTimestamps();
}

public function hasRole(string $roleName): bool
{
    return $this->roles()->where('role_name', $roleName)->exists();
}

public function hasAnyRole(array $roleNames): bool
{
    return $this->roles()->whereIn('role_name', $roleNames)->exists();
}
```

### **2. Role Assignment - UserController**

```php
// app/Http/Controllers/Api/UserController.php
public function assignRole(AssignRoleRequest $request, User $user): JsonResponse
{
    $roleId = $request->validated()['role_id'];

    // Check if already has this role
    if ($user->roles()->where('roles.role_id', $roleId)->exists()) {
        return response()->json([
            'success' => false,
            'message' => 'User already has this role'
        ], 422);
    }

    // Assign new role (doesn't remove existing roles!)
    $user->roles()->attach($roleId, [
        'assigned_at' => now(),
        'is_active' => true,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Role assigned successfully'
    ]);
}
```

### **3. Role Removal**

```php
public function removeRole(Request $request, User $user): JsonResponse
{
    $roleId = $request->validated()['role_id'];

    // Remove only this specific role (keeps other roles)
    $user->roles()->detach($roleId);

    return response()->json([
        'success' => true,
        'message' => 'Role removed successfully'
    ]);
}
```

---

## 🎯 Frontend Implementation

### **1. AuthContext - Multiple Roles Support**

```javascript
// src/contexts/AuthContext.jsx
const contextValue = {
  user, // user.roles is an ARRAY of role names
  isAuthenticated,
  hasRole: (role) => user?.roles?.includes(role), // Checks if user has specific role
  hasAnyRole: (roles) => roles.some((role) => user?.roles?.includes(role)),
  hasAllRoles: (roles) => roles.every((role) => user?.roles?.includes(role)),
};
```

### **2. Sidebar Navigation - Multiple Role Check**

```javascript
// src/components/layout/Sidebar.jsx
if (
  user?.roles?.includes("Super Admin") ||
  user?.roles?.includes("Super Admin1")
) {
  navigationGroups = navigationConfig["Super Admin"].groups;
} else if (user?.roles?.includes("Campus Admin")) {
  navigationGroups = navigationConfig["Campus Admin"].groups;
} else if (user?.roles?.includes("Registrar")) {
  navigationGroups = navigationConfig.Registrar.groups;
}
```

### **3. Protected Routes - Role Checking**

```javascript
// src/components/ProtectedRoute.jsx
const hasAccess = requiredRoles.some((role) => user?.roles?.includes(role));
```

---

## 📋 Real-World Examples

### **Example 1: Super Admin + Campus Admin**

```javascript
user = {
  user_id: 1,
  full_name: "John Doe",
  email: "john@icct.edu.ph",
  roles: ["Super Admin", "Campus Admin"], // Multiple roles!
};

// Check roles
user?.roles?.includes("Super Admin"); // ✅ true
user?.roles?.includes("Campus Admin"); // ✅ true
user?.roles?.includes("Registrar"); // ❌ false
```

### **Example 2: Faculty + Registrar**

```javascript
user = {
  user_id: 2,
  full_name: "Jane Smith",
  email: "jane@icct.edu.ph",
  roles: ["Faculty", "Registrar"], // Multiple roles!
};

// Has access to both Faculty and Registrar features
```

### **Example 3: Student + Part-time Staff**

```javascript
user = {
  user_id: 3,
  full_name: "Bob Johnson",
  email: "bob@icct.edu.ph",
  roles: ["Student", "Library Assistant"], // Multiple roles!
};
```

---

## 🔐 Permission System

### **Highest Permission Wins**

When a user has multiple roles, they get the **combined permissions** of all their roles:

```javascript
User with roles: ["Campus Admin", "Faculty"]

Permissions:
- Campus Admin: Can manage campus-level data
- Faculty: Can manage subjects and grades

Result: User has BOTH sets of permissions! 🎯
```

### **Role Hierarchy**

```
Level 1: Super Admin (Highest - Full Access)
Level 2: Campus Admin
Level 3: Department Head
Level 4: Faculty
Level 5: Student (Lowest)
```

**If user has multiple roles, the HIGHEST level takes precedence for UI/Navigation.**

---

## ⚙️ How It Works in Your System

### **Assigning Multiple Roles:**

1. **Via Role Management UI:**

   - Go to Role Management
   - Click "Assign Users" for **first role** (e.g., "Faculty")
   - Search and select user
   - Click "Update Assignments"
   - Repeat for **second role** (e.g., "Registrar")
   - User now has BOTH roles! ✅

2. **Via API:**

```bash
# Assign first role
POST /api/v1/users/123/assign-role
{ "role_id": 5 }  # Faculty

# Assign second role (doesn't remove first!)
POST /api/v1/users/123/assign-role
{ "role_id": 7 }  # Registrar

# User now has both Faculty AND Registrar roles! ✅
```

### **Viewing User's Roles:**

```bash
GET /api/v1/users/123

Response:
{
    "user_id": 123,
    "full_name": "John Doe",
    "roles": [
        {
            "role_id": 5,
            "role_name": "Faculty",
            "assigned_at": "2025-01-15 10:00:00",
            "is_active": true
        },
        {
            "role_id": 7,
            "role_name": "Registrar",
            "assigned_at": "2025-02-20 14:30:00",
            "is_active": true
        }
    ]
}
```

---

## ✅ Current Status: FULLY SUPPORTED!

| Feature                  | Status         | Notes                          |
| ------------------------ | -------------- | ------------------------------ |
| Multiple roles per user  | ✅ Supported   | `user_roles` junction table    |
| Unique constraint        | ✅ Implemented | Prevents duplicate assignments |
| Active/Inactive roles    | ✅ Supported   | `is_active` column             |
| Role assignment tracking | ✅ Supported   | `assigned_at` timestamp        |
| Frontend role checking   | ✅ Implemented | `user?.roles?.includes()`      |
| Backend role checking    | ✅ Implemented | `hasRole()`, `hasAnyRole()`    |
| API endpoints            | ✅ Working     | Assign/remove roles            |
| UI for role assignment   | ✅ Working     | Role Management page           |

---

## 🎯 Common Use Cases

### **1. Department Head + Faculty**

```javascript
roles: ["Department Head", "Faculty"];
// Can manage department AND teach classes
```

### **2. Campus Admin + Registrar**

```javascript
roles: ["Campus Admin", "Registrar"];
// Can manage campus AND process enrollments
```

### **3. Student + Student Assistant**

```javascript
roles: ["Student", "Student Assistant"];
// Can attend classes AND help in office
```

### **4. Faculty + Researcher**

```javascript
roles: ["Faculty", "Researcher"];
// Can teach AND conduct research
```

---

## 🔧 Best Practices

### ✅ DO:

- Assign multiple roles when user has multiple responsibilities
- Use role hierarchy to determine primary navigation
- Check for specific permissions, not just roles
- Keep roles active/inactive for temporary assignments

### ❌ DON'T:

- Create too many granular roles (use permissions instead)
- Assign conflicting roles (e.g., Student + Faculty - unless valid)
- Remove all roles from a user (they need at least one)
- Forget to check `is_active` status

---

## 📌 Summary

**YES, your system FULLY supports multiple roles per user!** 🎉

- ✅ Database structure: `user_roles` junction table
- ✅ Backend: `belongsToMany` relationship
- ✅ Frontend: Array-based role checking
- ✅ API: Individual role assignment/removal
- ✅ UI: Role Management with user assignment

**A user can have as many roles as needed, and they get the combined permissions of all their roles!**

---

## 🚀 Next Steps (Optional Enhancements)

If you want to improve the multiple roles experience:

1. **Display All User Roles in UI**

   - Show badges for each role in user profile
   - Display role count in user list

2. **Role Priority System**

   - Set primary role for navigation
   - Let user switch between role contexts

3. **Role Conflicts Warning**

   - Warn when assigning potentially conflicting roles
   - Suggest role combinations

4. **Bulk Role Assignment**

   - Assign multiple roles to one user at once
   - Assign one role to multiple users (already supported!)

5. **Role History**
   - Track when roles were added/removed
   - Show role assignment audit trail

Let me know if you want any of these enhancements! 🚀

