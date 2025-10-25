# Role Management API - Request & Response Examples

## 🚀 Quick Start

This document provides real-world examples of API requests and responses for the Role Management system.

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Role Management](#role-management)
3. [Module Access](#module-access)
4. [User Assignment](#user-assignment)
5. [Permissions](#permissions)
6. [Statistics](#statistics)

---

## 🔐 Authentication

All requests require JWT authentication token in the header:

```http
Authorization: Bearer {your_jwt_token}
```

---

## 👥 Role Management

### 1. Get All Roles

**Request:**

```http
GET /api/role-management/roles
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "role_id": 1,
      "role_name": "Super Admin",
      "description": "System-wide administrator with full access to all features and campuses.",
      "role_level": 1,
      "is_global": true,
      "campus_id": null,
      "campus": null,
      "users_count": 3,
      "created_at": "2025-01-15 10:30:00",
      "updated_at": "2025-01-15 10:30:00"
    },
    {
      "role_id": 2,
      "role_name": "Campus Admin",
      "description": "Campus administrator managing all operations within their campus.",
      "role_level": 2,
      "is_global": false,
      "campus_id": 1,
      "campus": {
        "campus_id": 1,
        "campus_name": "Main Campus",
        "campus_code": "MC"
      },
      "users_count": 5,
      "created_at": "2025-01-15 10:30:01",
      "updated_at": "2025-01-15 10:30:01"
    }
  ],
  "message": "Roles retrieved successfully"
}
```

### 2. Get Roles with Filters

**Request:**

```http
GET /api/role-management/roles?campus_id=1&role_level=3&search=dept
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "role_id": 4,
      "role_name": "Department Head",
      "description": "Manages department operations, faculty, and curriculum.",
      "role_level": 3,
      "is_global": false,
      "campus_id": 1,
      "users_count": 8
    }
  ],
  "message": "Roles retrieved successfully"
}
```

### 3. Create New Role

**Request:**

```http
POST /api/role-management/roles
Content-Type: application/json

{
  "role_name": "Program Coordinator",
  "description": "Coordinates academic programs and student affairs",
  "role_level": 4,
  "is_global": false,
  "campus_id": 1
}
```

**Success Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "role_id": 9,
    "role_name": "Program Coordinator",
    "description": "Coordinates academic programs and student affairs",
    "role_level": 4,
    "is_global": false,
    "campus_id": 1,
    "campus": {
      "campus_id": 1,
      "campus_name": "Main Campus"
    },
    "created_at": "2025-01-20 14:25:30",
    "updated_at": "2025-01-20 14:25:30"
  },
  "message": "Role created successfully"
}
```

**Error Response (422 Validation Error):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "role_name": ["The role name has already been taken."],
    "campus_id": ["The campus id field is required when is global is false."]
  }
}
```

### 4. Update Role

**Request:**

```http
PUT /api/role-management/roles/9
Content-Type: application/json

{
  "role_name": "Senior Program Coordinator",
  "description": "Senior coordinator with extended responsibilities",
  "role_level": 3
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "role_id": 9,
    "role_name": "Senior Program Coordinator",
    "description": "Senior coordinator with extended responsibilities",
    "role_level": 3,
    "is_global": false,
    "campus_id": 1,
    "campus": {
      "campus_id": 1,
      "campus_name": "Main Campus"
    }
  },
  "message": "Role updated successfully"
}
```

### 5. Get Role Details

**Request:**

```http
GET /api/role-management/roles/1
```

**Response:**

```json
{
  "success": true,
  "data": {
    "role_id": 1,
    "role_name": "Super Admin",
    "description": "System-wide administrator with full access",
    "role_level": 1,
    "is_global": true,
    "campus_id": null,
    "campus": null,
    "permissions": [
      {
        "permission_id": 1,
        "module": "users",
        "action": "view",
        "resource": "all",
        "description": "View all users"
      },
      {
        "permission_id": 2,
        "module": "users",
        "action": "create",
        "resource": null,
        "description": "Create new users"
      }
    ],
    "module_access": [
      {
        "access_id": 1,
        "module_id": 1,
        "module": {
          "module_id": 1,
          "module_code": "USER_MGMT",
          "module_name": "User Management",
          "display_name": "User Management"
        },
        "can_view": true,
        "can_create": true,
        "can_edit": true,
        "can_delete": true,
        "can_export": true,
        "can_import": true
      }
    ],
    "active_users": [
      {
        "user_id": 1,
        "full_name": "Admin User",
        "email": "admin@skolaris.edu",
        "is_active": true,
        "assigned_at": "2025-01-15 10:00:00"
      }
    ],
    "statistics": {
      "total_users": 3,
      "active_users": 3,
      "inactive_users": 0,
      "permissions_count": 17,
      "modules_count": 10
    }
  },
  "message": "Role retrieved successfully"
}
```

### 6. Delete Role

**Request:**

```http
DELETE /api/role-management/roles/9
```

**Success Response:**

```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

**Error Response (Role has users):**

```json
{
  "success": false,
  "message": "Cannot delete role with active users. Please reassign users first."
}
```

---

## 🔧 Module Access

### 1. Set Module Access for Role

**Request:**

```http
POST /api/role-management/roles/5/module-access
Content-Type: application/json

{
  "module_id": 8,
  "can_view": true,
  "can_create": true,
  "can_edit": true,
  "can_delete": false,
  "can_export": true,
  "can_import": false
}
```

**Response:**

```json
{
  "success": true,
  "message": "Module access updated successfully"
}
```

### 2. Get All System Modules

**Request:**

```http
GET /api/role-management/modules
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "module_id": 1,
      "module_code": "USER_MGMT",
      "module_name": "User Management",
      "display_name": "User Management",
      "description": "Manage system users, accounts, and profiles",
      "icon": "users",
      "route_path": "/admin/users",
      "is_active": true,
      "sort_order": 1,
      "access_level": "admin_only",
      "parent_id": null
    },
    {
      "module_id": 2,
      "module_code": "ROLE_MGMT",
      "module_name": "Role Management",
      "display_name": "Role & Permission Management",
      "description": "Manage roles, permissions, and access control",
      "icon": "shield",
      "route_path": "/admin/roles",
      "is_active": true,
      "sort_order": 2,
      "access_level": "admin_only",
      "parent_id": null
    }
  ],
  "message": "System modules retrieved successfully"
}
```

---

## 👤 User Assignment

### 1. Assign Role to Users

**Request:**

```http
POST /api/role-management/roles/5/assign-users
Content-Type: application/json

{
  "user_ids": [10, 15, 20, 25]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "assignments": 4
  },
  "message": "Successfully assigned role to 4 users"
}
```

### 2. Get Users for Role Assignment

**Request:**

```http
GET /api/role-management/users?campus_id=1&search=john
```

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "user_id": 10,
        "full_name": "John Smith",
        "email": "john.smith@skolaris.edu",
        "campus_id": 1,
        "campus": {
          "campus_id": 1,
          "campus_name": "Main Campus"
        },
        "roles": [
          {
            "role_id": 5,
            "role_name": "Faculty"
          }
        ]
      }
    ],
    "current_page": 1,
    "per_page": 15,
    "total": 1
  },
  "message": "Users retrieved successfully"
}
```

---

## 🔑 Permissions

### 1. Get All Permissions

**Request:**

```http
GET /api/role-management/permissions
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "permission_id": 1,
      "module": "users",
      "action": "view",
      "resource": "all",
      "description": "View all users",
      "created_at": "2025-01-15 10:30:00"
    },
    {
      "permission_id": 2,
      "module": "users",
      "action": "create",
      "resource": null,
      "description": "Create new users",
      "created_at": "2025-01-15 10:30:00"
    },
    {
      "permission_id": 5,
      "module": "roles",
      "action": "view",
      "resource": "all",
      "description": "View all roles",
      "created_at": "2025-01-15 10:30:01"
    }
  ],
  "message": "Permissions retrieved successfully"
}
```

### 2. Assign Permissions to Role

**Request:**

```http
POST /api/role-management/roles/9/permissions
Content-Type: application/json

{
  "permissions": [1, 2, 5, 10, 14]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "assigned_count": 5
  },
  "message": "Successfully assigned 5 permissions to role"
}
```

---

## 📊 Statistics

### 1. Get Role Statistics

**Request:**

```http
GET /api/role-management/roles/statistics
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total_roles": 8,
    "global_roles": 1,
    "campus_roles": 7,
    "roles_by_level": [
      { "role_level": 1, "count": 1 },
      { "role_level": 2, "count": 1 },
      { "role_level": 3, "count": 2 },
      { "role_level": 4, "count": 3 },
      { "role_level": 5, "count": 1 }
    ],
    "roles_with_users": 6,
    "roles_without_users": 2
  },
  "message": "Role statistics retrieved successfully"
}
```

### 2. Get Role Hierarchy

**Request:**

```http
GET /api/role-management/roles/hierarchy
```

**Response:**

```json
{
  "success": true,
  "data": {
    "1": [
      {
        "role": {
          "role_id": 1,
          "role_name": "Super Admin",
          "role_level": 1,
          "is_global": true
        },
        "permissions_count": 17,
        "modules_count": 10,
        "users_count": 3
      }
    ],
    "2": [
      {
        "role": {
          "role_id": 2,
          "role_name": "Campus Admin",
          "role_level": 2,
          "is_global": false
        },
        "permissions_count": 12,
        "modules_count": 9,
        "users_count": 5
      }
    ],
    "3": [
      {
        "role": {
          "role_id": 3,
          "role_name": "Registrar",
          "role_level": 3,
          "is_global": false
        },
        "permissions_count": 6,
        "modules_count": 3,
        "users_count": 4
      },
      {
        "role": {
          "role_id": 4,
          "role_name": "Department Head",
          "role_level": 3,
          "is_global": false
        },
        "permissions_count": 8,
        "modules_count": 5,
        "users_count": 8
      }
    ]
  },
  "message": "Role hierarchy retrieved successfully"
}
```

### 3. Validate Permission Structure

**Request:**

```http
GET /api/role-management/roles/validate-structure
```

**Success Response:**

```json
{
  "success": true,
  "data": {
    "issues": [],
    "is_valid": true
  },
  "message": "Permission structure is valid"
}
```

**Response with Issues:**

```json
{
  "success": true,
  "data": {
    "issues": [
      "Found 2 orphaned role permissions",
      "Found 1 orphaned user roles"
    ],
    "is_valid": false
  },
  "message": "Permission structure has issues"
}
```

---

## 🎯 Common Use Cases

### Use Case 1: Create a New Department Head Role

```http
POST /api/role-management/roles
Content-Type: application/json

{
  "role_name": "Department Head - Computer Science",
  "description": "Head of Computer Science Department",
  "role_level": 3,
  "is_global": false,
  "campus_id": 1
}
```

Then set module access:

```http
POST /api/role-management/roles/{new_role_id}/module-access
Content-Type: application/json

{
  "module_id": 4,
  "can_view": true,
  "can_create": true,
  "can_edit": true,
  "can_delete": false,
  "can_export": true,
  "can_import": false
}
```

### Use Case 2: Bulk Assign Faculty Role

```http
POST /api/role-management/roles/5/assign-users
Content-Type: application/json

{
  "user_ids": [101, 102, 103, 104, 105, 106, 107, 108, 109, 110]
}
```

### Use Case 3: Clone Role Permissions (Multi-step)

1. Get source role details:

```http
GET /api/role-management/roles/5
```

2. Create new role:

```http
POST /api/role-management/roles
Content-Type: application/json

{
  "role_name": "Senior Faculty",
  "description": "Senior faculty with additional privileges",
  "role_level": 3,
  "is_global": false,
  "campus_id": 1
}
```

3. Assign same permissions:

```http
POST /api/role-management/roles/{new_role_id}/permissions
Content-Type: application/json

{
  "permissions": [14, 15, 16]
}
```

---

## 🔍 Error Codes Reference

| Status Code | Meaning          | Example                       |
| ----------- | ---------------- | ----------------------------- |
| 200         | Success          | Role retrieved successfully   |
| 201         | Created          | Role created successfully     |
| 400         | Bad Request      | Invalid request parameters    |
| 401         | Unauthorized     | Invalid or expired token      |
| 403         | Forbidden        | Insufficient permissions      |
| 404         | Not Found        | Role not found                |
| 409         | Conflict         | Cannot delete role with users |
| 422         | Validation Error | Invalid input data            |
| 500         | Server Error     | Internal server error         |

---

## 🛠️ Testing with Postman

### Setup

1. Import the collection from `/json/updated_postman_collection.json`
2. Set environment variables:
   - `base_url`: http://localhost/api/v1
   - `access_token`: Your JWT token

### Test Sequence

1. **Authentication**

   ```
   POST /auth/login
   ```

2. **Get Roles**

   ```
   GET /role-management/roles
   ```

3. **Create Role**

   ```
   POST /role-management/roles
   ```

4. **Set Module Access**

   ```
   POST /role-management/roles/{role_id}/module-access
   ```

5. **Assign to Users**

   ```
   POST /role-management/roles/{role_id}/assign-users
   ```

6. **Verify**
   ```
   GET /role-management/roles/{role_id}
   ```

---

## 📝 Notes

- All timestamps are in `Y-m-d H:i:s` format
- All IDs are integers
- Boolean values are returned as `true`/`false`
- Null values are returned as `null`
- Arrays can be empty `[]`
- Error messages are user-friendly and actionable

---

## 🔄 Version History

- **v1.0.0** (2025-01-20) - Initial API documentation
- Supports Laravel 11.x backend
- Requires JWT authentication

---

**Last Updated**: 2025-01-20
