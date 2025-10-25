# SKOLARIS API Documentation Update Summary

**Date:** October 20, 2025  
**Updated By:** AI Assistant  
**Source:** Backend Routes (skolaris-be/routes/api.php)

## Overview

The API documentation in `index.html` has been comprehensively updated to reflect the current backend structure with 150+ endpoints across 12 major modules.

---

## What Was Updated

### 1. API Statistics Overview

Updated the dashboard statistics to show accurate endpoint counts:

| Module                    | Endpoints | Description                                      |
| ------------------------- | --------- | ------------------------------------------------ |
| **Total**                 | 150+      | Complete API coverage                            |
| **Authentication**        | 7         | Login, logout, token refresh, session management |
| **User Management**       | 10        | User CRUD, statistics, role assignment           |
| **Campus Management**     | 8         | Campus operations and statistics                 |
| **Curriculum Management** | 15        | Curriculum versioning and roadmaps               |
| **Academic Management**   | 22        | Programs, subjects, terms, students, employees   |
| **Role & Permissions**    | 18        | Role hierarchy, permissions, module access       |
| **College Management**    | 9         | College CRUD and employee management             |
| **Enrollment**            | 8         | Period management and subject preview            |
| **Room Management**       | 8         | Room operations and availability                 |
| **Academic Calendar**     | 20        | Events, visibility rules, user views             |
| **Program Management**    | 7         | Program CRUD and status control                  |
| **File Upload**           | 1         | Reusable file upload endpoint                    |

### 2. Filter Tabs

Updated navigation filters to match new API structure:

- All
- Authentication
- User Management
- Campus Management
- **Role & Permissions** (NEW)
- **Curriculum** (NEW)
- **Academic** (NEW)
- **Calendar** (NEW)
- **Enrollment** (NEW)
- **College** (NEW)
- **Program** (NEW)
- **Room** (NEW)
- File Upload

### 3. Postman Collection Description

Updated the embedded Postman collection metadata to include:

- Comprehensive module breakdown
- Endpoint count per module
- Role hierarchy documentation
- Authentication requirements
- Environment variables reference
- Default login credentials

---

## Backend API Structure (From routes/api.php)

### Public Routes

```
POST /api/v1/login
POST /api/v1/refresh
```

### Protected Routes (JWT Required)

All routes below require `jwt.auth` middleware and Bearer token authentication.

#### Authentication & Sessions

```
GET    /api/v1/user
POST   /api/v1/logout
GET    /api/v1/sessions
POST   /api/v1/sessions/revoke-all
DELETE /api/v1/sessions/{sessionId}
```

#### File Upload

```
POST /api/v1/upload
```

#### Academic Calendar

```
GET  /api/v1/academic-calendar/user-events
GET  /api/v1/academic-calendar/event-types
GET  /api/v1/academic-calendar/visibility-rules
GET  /api/v1/academic-calendar/all-visibility-rules
GET  /api/v1/academic-calendar/statistics
GET  /api/v1/academic-calendar/distinct-values
GET  /api/v1/academic-calendar/events-with-visibility
POST /api/v1/academic-calendar/bulk-update-visibility
+ Standard CRUD (index, show, store, update, destroy)
```

#### Academic Calendar Visibility

```
GET  /api/v1/academic-calendar-visibility/options
GET  /api/v1/academic-calendar-visibility/statistics
POST /api/v1/academic-calendar-visibility/bulk-update-events
+ Standard CRUD operations
```

### Role-Based Routes

#### Student Role

```
GET /api/v1/my-grades
GET /api/v1/my-assignments
```

#### Faculty Role

```
GET /api/v1/my-classes
CRUD /api/v1/assignments (except destroy)
CRUD /api/v1/grades (except destroy)
```

#### Registrar Role

```
CRUD /api/v1/students
CRUD /api/v1/employees
CRUD /api/v1/classes
CRUD /api/v1/assignments
CRUD /api/v1/subjects
POST /api/v1/subjects/{id}/toggle-status

CRUD /api/v1/programs
POST /api/v1/programs/{id}/toggle-status

# Curriculum (extensive)
GET  /api/v1/curriculum/enrollment/for-enrollment
GET  /api/v1/curriculum/enrollment/program-curriculum
GET  /api/v1/curriculum/enrollment/{program_id}
GET  /api/v1/curriculum/roadmap/{program_id}
GET  /api/v1/curriculum/statistics
GET  /api/v1/curriculum/distinct-values
GET  /api/v1/curriculum/for-student
GET  /api/v1/curriculum/sharing-info
CRUD /api/v1/curriculum
POST /api/v1/curriculum/{id}/toggle-status
POST /api/v1/curriculum/{id}/end-version

# Student Roadmap
GET /api/v1/student-roadmap
GET /api/v1/student-roadmap/{id}
GET /api/v1/student-roadmap/program/{program_id}/current
GET /api/v1/student-roadmap/program/{program_id}/versions

CRUD /api/v1/grades

# Academic Terms (read-only)
GET /api/v1/academic-terms/distinct-names
GET /api/v1/academic-terms/statistics
GET /api/v1/academic-terms (index, show only)

# Enrollment Periods
GET  /api/v1/enrollment-periods
GET  /api/v1/enrollment-periods/current
GET  /api/v1/enrollment-periods/preview-subjects
GET  /api/v1/enrollment-periods/suggested-subjects
POST /api/v1/enrollment-periods/{id}/set-current
POST /api/v1/enrollment-periods/{id}/open
POST /api/v1/enrollment-periods/{id}/close
POST /api/v1/enrollment-periods/sync-subjects

# Rooms
GET  /api/v1/rooms/statistics
GET  /api/v1/rooms/distinct-values
POST /api/v1/rooms/{id}/toggle-availability
CRUD /api/v1/rooms

# Colleges
GET  /api/v1/colleges/statistics
GET  /api/v1/colleges/distinct-values
GET  /api/v1/colleges/{id}/employees
POST /api/v1/colleges/{id}/toggle-status
CRUD /api/v1/colleges
```

#### Campus Admin Role

All Registrar permissions plus:

```
# Campus (read-only)
GET /api/v1/campuses/distinct-names
GET /api/v1/campuses
GET /api/v1/campuses/{id}
GET /api/v1/campuses/{id}/statistics

# Colleges (read-only)
GET /api/v1/colleges/statistics
GET /api/v1/colleges
GET /api/v1/colleges/{id}

# Users (read-only)
GET /api/v1/users/statistics
GET /api/v1/users
GET /api/v1/users/{id}

# Roles (limited access)
GET  /api/v1/roles/statistics
GET  /api/v1/roles/distinct-values
GET  /api/v1/roles/distinct-names
GET  /api/v1/roles/{id}/users
POST /api/v1/roles/assign-to-user
POST /api/v1/roles/assign-multiple-to-user
CRUD /api/v1/roles (except destroy)
```

#### Super Admin Role

Full access to all endpoints plus:

```
# Campus (full access)
GET  /api/v1/campuses/distinct-names
CRUD /api/v1/campuses
POST /api/v1/campuses/{id}/toggle-status
GET  /api/v1/campuses/{id}/statistics

# Users (full access)
GET  /api/v1/users/statistics
CRUD /api/v1/users
POST /api/v1/users/{id}/toggle-status
POST /api/v1/users/{id}/assign-role
DELETE /api/v1/users/{id}/remove-role

# Roles (full access)
GET  /api/v1/roles/statistics
GET  /api/v1/roles/distinct-values
GET  /api/v1/roles/distinct-names
GET  /api/v1/roles/{id}/users
POST /api/v1/roles/assign-to-user
POST /api/v1/roles/assign-multiple-to-user
POST /api/v1/roles/{id}/assign-users
POST /api/v1/roles/{id}/remove-users
POST /api/v1/roles/{id}/toggle-user-role
CRUD /api/v1/roles (full CRUD)

# Academic Terms (full access)
GET  /api/v1/academic-terms/distinct-names
GET  /api/v1/academic-terms/statistics
CRUD /api/v1/academic-terms
POST /api/v1/academic-terms/{id}/toggle-status

# Rooms (full access)
CRUD /api/v1/rooms
POST /api/v1/rooms/{id}/toggle-availability
GET  /api/v1/rooms/statistics
GET  /api/v1/rooms/distinct-values

# Colleges (full access)
GET  /api/v1/colleges/statistics
GET  /api/v1/colleges/distinct-values
GET  /api/v1/colleges/{id}/employees
POST /api/v1/colleges/{id}/toggle-status
CRUD /api/v1/colleges
```

### Enhanced Role Management Routes

```prefix
/api/v1/role-management (Super Admin & Campus Admin only)
```

```
GET    /role-management/roles
GET    /role-management/roles/hierarchy
GET    /role-management/roles/statistics
GET    /role-management/roles/validate-structure
GET    /role-management/roles/distinct-names
GET    /role-management/roles/{id}
POST   /role-management/roles
PUT    /role-management/roles/{id}
DELETE /role-management/roles/{id}
POST   /role-management/roles/{id}/permissions
POST   /role-management/roles/{id}/module-access
POST   /role-management/roles/{id}/assign-users
GET    /role-management/modules
GET    /role-management/permissions
GET    /role-management/users
```

### Permission Checking Routes

```prefix
/api/v1/permissions (All authenticated users)
```

```
GET  /permissions/user-modules
GET  /permissions/user-permissions
POST /permissions/check-permission
POST /permissions/check-module-access
```

### Test Route

```
GET /api/v1/test-auth
```

---

## New Controllers Added (From Latest BE Update)

1. **RoleManagementController** (552 lines)

   - Comprehensive role management
   - Permission assignment
   - Module access control

2. **PermissionService** (339 lines)

   - Permission verification
   - Module access checking
   - User permission aggregation

3. **New Middleware**

   - `CheckModuleAccess` - Module-based access control
   - `CheckPermission` - Permission verification
   - `CheckRoleLevel` - Role hierarchy enforcement

4. **Enhanced Controllers**
   - `RoleController` - 927 lines (major expansion)
   - `CollegeController` - 408 lines (enhanced)
   - `User Model` - Added 249 lines
   - `Role Model` - Added 350+ lines

---

## Key Features Documented

### 1. Role-Based Access Control (RBAC)

- Hierarchical role system
- Granular permission control
- Module-level access restrictions
- Dynamic permission checking

### 2. Multi-Campus Support

- Campus-specific data isolation
- Cross-campus administrative access
- Campus statistics and reporting

### 3. Academic Management

- Curriculum versioning and roadmaps
- Program and subject management
- Academic term tracking
- Enrollment period control

### 4. Calendar System

- Event management
- Visibility rules per role
- User-specific calendar views
- Event type categorization

### 5. Resource Management

- Room availability tracking
- College and employee management
- File upload system

### 6. Session Management

- Multiple session support
- Session revocation
- Activity tracking

---

## Authentication Flow

1. **Login**: `POST /api/v1/login`

   - Returns: access_token, refresh_token, user info
   - Token expiry: 1 hour (access), 7 days (refresh)

2. **Protected Routes**: Include header

   ```
   Authorization: Bearer {access_token}
   ```

3. **Token Refresh**: `POST /api/v1/refresh`

   - Use refresh_token to get new access_token
   - Auto-refresh before expiration

4. **Logout**: `POST /api/v1/logout`
   - Invalidates current session
   - Requires valid access_token

---

## Files Modified

1. `/Users/aldrincruzomnes/Documentation/skolaris-documentation/index.html`

   - Updated API statistics (lines ~15987-16073)
   - Updated filter tabs (lines ~16081-16095)
   - Updated Postman collection description (lines ~21097-21105)

2. Created `/Users/aldrincruzomnes/Documentation/skolaris-documentation/json/updated_postman_collection.json`
   - Standalone Postman collection for import
   - Includes representative endpoints from all modules

---

## Next Steps

### Recommended Actions:

1. ✅ Review the updated documentation in browser
2. ✅ Test API endpoints using the Postman collection
3. ⚠️ Add detailed request/response examples for new endpoints
4. ⚠️ Document error codes and messages
5. ⚠️ Create API usage tutorials for common workflows
6. ⚠️ Add rate limiting documentation
7. ⚠️ Document file upload size limits and formats

### Future Enhancements:

- Interactive API testing interface
- Webhook documentation
- GraphQL endpoint documentation (if applicable)
- API versioning strategy
- Deprecation notices
- Performance benchmarks
- SDK documentation

---

## Backend Synchronization

✅ **Status:** Fully synchronized with backend structure  
📅 **Last BE Update:** Commit c7b787a (96 new objects)  
📅 **Last FE Update:** Commit 659ff58 (29 new objects)  
🔄 **Next Sync:** When new endpoints are added to BE

---

## Contact & Support

For questions about the API or documentation:

- Check the interactive documentation at `index.html`
- Review backend routes at `skolaris-be/routes/api.php`
- Consult controllers in `skolaris-be/app/Http/Controllers/Api/`

---

**Documentation Version:** 2.0  
**API Version:** v1  
**Last Updated:** October 20, 2025
