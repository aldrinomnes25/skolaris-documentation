# Role Management System - Implementation Guide

## Overview

This document provides a complete guide for the Role Management system in SKOLARIS. The system implements a comprehensive Role-Based Access Control (RBAC) with support for role hierarchy, module-based permissions, and campus-specific access control.

---

## 📋 Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [API Endpoints](#api-endpoints)
4. [Frontend Usage](#frontend-usage)
5. [Sample Data](#sample-data)
6. [Database Schema](#database-schema)
7. [Security Features](#security-features)

---

## ✨ Features

### Role Management

- ✅ Create, edit, and delete roles
- ✅ Role hierarchy with 5 levels (1 = highest authority)
- ✅ Global roles (apply to all campuses)
- ✅ Campus-specific roles (restricted to specific campus)
- ✅ Role statistics and analytics

### Module Access Control

- ✅ Granular permissions per module (view, create, edit, delete, export, import)
- ✅ Visual module access configuration
- ✅ Role-based module filtering

### User Interface

- ✅ Modern, responsive design matching existing SKOLARIS UI
- ✅ Interactive data table with sorting
- ✅ Real-time statistics dashboard
- ✅ Modal-based forms for better UX
- ✅ Toast notifications for user feedback

---

## 🚀 Installation

### Backend Setup

1. **Run Database Migrations** (if not already done)

   ```bash
   cd /Users/aldrincruzomnes/SKOLARIS/skolaris-be
   php artisan migrate
   ```

2. **Run the Role Management Seeder**

   ```bash
   php artisan db:seed --class=RoleManagementSeeder
   ```

   This will create:

   - 8 predefined roles (Super Admin, Campus Admin, Registrar, etc.)
   - 10 system modules with proper configurations
   - 17 granular permissions
   - Module access mappings for each role

### Frontend Setup

1. **The following files have been created:**

   - `/src/services/roleService.js` - API service layer
   - `/src/pages/RoleManagementAdmin.jsx` - Main role management page
   - `/src/App.jsx` - Updated with new routes

2. **Access the Role Management Page:**
   - Navigate to: `http://localhost:5173/admin/roles`
   - Required Role: Super Admin or Campus Admin

---

## 🔌 API Endpoints

### Get All Roles

```http
GET /api/role-management/roles
```

**Query Parameters:**

- `campus_id` - Filter by campus
- `role_level` - Filter by role level
- `is_global` - Filter by global/campus-specific
- `search` - Search by role name

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "role_id": 1,
      "role_name": "Super Admin",
      "description": "System-wide administrator",
      "role_level": 1,
      "is_global": true,
      "campus_id": null,
      "users_count": 5
    }
  ]
}
```

### Create Role

```http
POST /api/role-management/roles
```

**Request Body:**

```json
{
  "role_name": "Department Head",
  "description": "Manages department operations",
  "role_level": 3,
  "is_global": false,
  "campus_id": 1
}
```

### Update Role

```http
PUT /api/role-management/roles/{id}
```

### Delete Role

```http
DELETE /api/role-management/roles/{id}
```

### Set Module Access

```http
POST /api/role-management/roles/{id}/module-access
```

**Request Body:**

```json
{
  "module_id": 1,
  "can_view": true,
  "can_create": true,
  "can_edit": true,
  "can_delete": false,
  "can_export": true,
  "can_import": false
}
```

### Get Role Statistics

```http
GET /api/role-management/roles/statistics
```

### Get System Modules

```http
GET /api/role-management/modules
```

### Get Permissions

```http
GET /api/role-management/permissions
```

---

## 💻 Frontend Usage

### Accessing Role Management

1. **Login** as Super Admin or Campus Admin
2. **Navigate** to `/admin/roles`
3. **View** the role management dashboard

### Creating a New Role

1. Click **"Add Role"** button
2. Fill in the form:
   - **Role Name**: Enter a descriptive name
   - **Description**: Describe the role's responsibilities
   - **Role Level**: Select authority level (1-5)
   - **Global Role**: Check if applies to all campuses
   - **Campus**: Select campus (if not global)
3. Click **"Create Role"**

### Configuring Module Access

1. Click the **Shield icon** on a role row
2. For each module, check the permissions:
   - ✅ **View** - Can view the module
   - ✅ **Create** - Can create new records
   - ✅ **Edit** - Can edit existing records
   - ✅ **Delete** - Can delete records
   - ✅ **Export** - Can export data
   - ✅ **Import** - Can import data
3. Click **"Save Module Access"**

### Viewing Role Details

1. Click the **Eye icon** on a role row
2. View comprehensive role information:
   - Role metadata (name, level, type)
   - Campus assignment
   - User statistics
   - Permission counts

### Editing a Role

1. Click the **Edit icon** on a role row
2. Modify the desired fields
3. Click **"Update Role"**

### Deleting a Role

1. Click the **Trash icon** on a role row
2. Confirm the deletion
3. ⚠️ **Note**: Roles with assigned users cannot be deleted

---

## 📊 Sample Data

The `RoleManagementSeeder` creates the following roles:

### 1. Super Admin (Level 1, Global)

- Full access to all modules and features
- Can manage all campuses
- Can create and manage other roles

### 2. Campus Admin (Level 2, Campus-Specific)

- Full access to campus operations
- Cannot manage roles (except limited functions)
- Manages all resources within their campus

### 3. Registrar (Level 3, Campus-Specific)

- Manages student enrollment
- Views grades (read-only)
- Manages student records

### 4. Department Head (Level 3, Campus-Specific)

- Manages department operations
- Oversees faculty and curriculum
- Medium authority level

### 5. Faculty (Level 4, Campus-Specific)

- Manages own classes and grades
- Views student information
- Limited administrative access

### 6. Student (Level 5, Campus-Specific)

- Views own grades and schedule
- Basic system access
- No administrative permissions

### 7. Cashier (Level 4, Campus-Specific)

- Handles financial transactions
- Payment processing

### 8. Librarian (Level 4, Campus-Specific)

- Manages library resources
- Student access control

### System Modules Created

1. **User Management** - Manage system users
2. **Role Management** - Manage roles and permissions
3. **Campus Management** - Manage campus information
4. **Program Management** - Manage academic programs
5. **Subject Management** - Manage subjects
6. **Curriculum Management** - Manage curriculum
7. **Enrollment Management** - Student enrollment
8. **Grade Management** - Grades and assessment
9. **Schedule Management** - Class schedules
10. **Room Management** - Classroom management

---

## 🗄️ Database Schema

### Tables

#### `roles`

- `role_id` (PK)
- `role_name` (string, 50)
- `description` (text, nullable)
- `role_level` (integer, 1-10)
- `is_global` (boolean)
- `campus_id` (FK, nullable)
- `timestamps`

#### `user_roles`

- `user_role_id` (PK)
- `user_id` (FK)
- `role_id` (FK)
- `assigned_at` (timestamp)
- `is_active` (boolean)
- `timestamps`

#### `system_modules`

- `module_id` (PK)
- `module_code` (string, unique)
- `module_name` (string)
- `display_name` (string)
- `description` (text)
- `icon` (string)
- `route_path` (string)
- `is_active` (boolean)
- `sort_order` (integer)
- `access_level` (enum: public, restricted, admin_only)
- `parent_id` (FK, nullable)
- `timestamps`

#### `role_module_access`

- `access_id` (PK)
- `role_id` (FK)
- `module_id` (FK)
- `can_view` (boolean)
- `can_create` (boolean)
- `can_edit` (boolean)
- `can_delete` (boolean)
- `can_export` (boolean)
- `can_import` (boolean)
- `is_active` (boolean)
- `timestamps`

#### `permissions`

- `permission_id` (PK)
- `module` (string)
- `action` (string)
- `resource` (string, nullable)
- `description` (text)
- `timestamps`

#### `role_permissions`

- `role_id` (FK)
- `permission_id` (FK)
- `timestamps`
- Composite PK: (role_id, permission_id)

---

## 🔒 Security Features

### Role Hierarchy

- Lower level numbers = higher authority
- Roles can only manage users with higher level numbers
- Prevents privilege escalation

### Campus Isolation

- Campus-specific roles are restricted to their campus
- Global roles can access all campuses
- Enforced at the database and API level

### Permission Aggregation

- Users with multiple roles get combined permissions
- Uses OR logic (any role granting permission = user has it)
- Permissions are cached for performance

### Audit Trail

- All role assignments tracked with timestamps
- Soft deletion with `is_active` flag
- Created/Updated timestamps on all records

### Validation

- Role names must be unique per campus
- Campus ID required for non-global roles
- Roles with active users cannot be deleted
- Role level must be between 1-10

---

## 📱 Screenshots

The Role Management interface includes:

1. **Dashboard View** - Statistics cards showing:

   - Total roles
   - Global roles
   - Campus roles
   - Active roles with users

2. **Data Table** - Features:

   - Sortable columns
   - Role type badges (Global/Campus)
   - Action buttons (View, Edit, Module Access, Delete)
   - User count per role

3. **Create/Edit Modal** - Form fields:

   - Role name input
   - Description textarea
   - Role level dropdown
   - Global role checkbox
   - Campus selector (conditional)

4. **Module Access Modal** - Shows:

   - List of all system modules
   - Checkboxes for each permission type
   - Module descriptions and icons
   - Batch save functionality

5. **Role Details Modal** - Displays:
   - Role metadata
   - Campus assignment
   - User statistics
   - Permission counts

---

## 🧪 Testing

### Manual Testing Checklist

#### Role CRUD Operations

- [ ] Create a new global role
- [ ] Create a new campus-specific role
- [ ] Edit an existing role
- [ ] Delete a role without users
- [ ] Attempt to delete a role with users (should fail)

#### Module Access

- [ ] Configure module access for a role
- [ ] Test all 6 permission types (view, create, edit, delete, export, import)
- [ ] Verify access updates reflect immediately

#### Role Assignment

- [ ] Assign a role to a user
- [ ] Assign multiple roles to a user
- [ ] Remove a role from a user
- [ ] Toggle role active status

#### Validation

- [ ] Create role without required fields (should fail)
- [ ] Create campus-specific role without campus (should fail)
- [ ] Create role with duplicate name in same campus (should fail)
- [ ] Create role with duplicate name in different campus (should succeed)

#### Authorization

- [ ] Access as Super Admin (full access)
- [ ] Access as Campus Admin (limited access)
- [ ] Access as other roles (should be unauthorized)

---

## 🐛 Troubleshooting

### Issue: Roles not showing in the list

**Solution**: Ensure the backend API is running and accessible. Check browser console for errors.

### Issue: Cannot create campus-specific role

**Solution**: Make sure at least one campus exists in the database. Run campus seeder if needed.

### Issue: Module access not saving

**Solution**: Verify the modules exist in the database. Run the seeder to create default modules.

### Issue: Permission denied error

**Solution**: Ensure your user has Super Admin or Campus Admin role assigned.

### Issue: Seeder fails to run

**Solution**: Ensure migrations are run first. Check that at least one campus exists.

---

## 📝 Code Standards

The implementation follows SKOLARIS frontend coding standards:

### File Structure

```
src/
├── services/
│   └── roleService.js          # API service layer
├── pages/
│   └── RoleManagementAdmin.jsx  # Main page component
└── App.jsx                      # Updated with routes
```

### Component Patterns

- Uses functional components with hooks
- Follows existing UI component library
- Consistent error handling
- Toast notifications for feedback
- Modal-based forms

### API Service Pattern

```javascript
export const roleService = {
  async getMethod() {
    try {
      const response = await api.get("/endpoint");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Error message",
      };
    }
  },
};
```

### State Management

- Uses React useState for local state
- useEffect for data fetching
- useAuth for authentication context
- useToast for notifications

---

## 🚦 Next Steps

### Recommended Enhancements

1. **Role Templates**

   - Pre-configured role templates for common positions
   - Quick setup for standard roles

2. **Bulk Operations**

   - Bulk assign roles to multiple users
   - Bulk edit module access

3. **Role Cloning**

   - Clone existing role with all permissions
   - Modify and save as new role

4. **Permission Groups**

   - Group related permissions
   - Assign permission groups to roles

5. **Activity Logs**

   - Track role changes
   - Audit log for role assignments

6. **Role Inheritance**
   - Parent-child role relationships
   - Inherit permissions from parent roles

---

## 📞 Support

For issues or questions:

- Check the troubleshooting section above
- Review the API documentation
- Contact the development team

---

## 📄 License

This documentation is part of the SKOLARIS project.

**Created**: 2025
**Last Updated**: 2025-01-20
**Version**: 1.0.0
