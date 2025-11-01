# Missing Frontend Endpoints

This document lists all Backend API endpoints that are **NOT yet implemented** in the Frontend.

Last Updated: October 21, 2025

---

## 🔐 Authentication & Sessions

### Session Management (AuthController)

- ❌ `GET /api/v1/sessions` - Get active sessions
- ❌ `POST /api/v1/sessions/revoke-all` - Revoke all sessions
- ❌ `DELETE /api/v1/sessions/{sessionId}` - Revoke specific session

---

## 📁 File Management

### File Upload (FileController)

- ❌ `POST /api/v1/upload` - Reusable file upload endpoint

---

## 📅 Academic Calendar

### Academic Calendar Visibility (AcademicCalendarVisibilityController)

- ❌ `GET /api/v1/academic-calendar-visibility/statistics` - Get visibility statistics
- ❌ `POST /api/v1/academic-calendar-visibility/bulk-update-events` - Bulk update event visibility

---

## 👥 Student Management

### Student (StudentController)

- ❌ `GET /api/v1/my-grades` - Get current student's grades
- ❌ `GET /api/v1/my-assignments` - Get current student's assignments
- ❌ `GET /api/v1/students` - List all students
- ❌ `GET /api/v1/students/{id}` - Get student by ID
- ❌ `POST /api/v1/students` - Create new student
- ❌ `PUT /api/v1/students/{id}` - Update student
- ❌ `DELETE /api/v1/students/{id}` - Delete student

---

## 👨‍🏫 Employee Management

### Employee (EmployeeController)

- ❌ `GET /api/v1/my-classes` - Get current employee's classes
- ❌ `GET /api/v1/employees` - List all employees
- ❌ `GET /api/v1/employees/{id}` - Get employee by ID
- ❌ `POST /api/v1/employees` - Create new employee
- ❌ `PUT /api/v1/employees/{id}` - Update employee
- ❌ `DELETE /api/v1/employees/{id}` - Delete employee

---

## 📚 Academic Management

### Class Management (ClassController)

- ❌ `GET /api/v1/classes` - List all classes
- ❌ `GET /api/v1/classes/{id}` - Get class by ID
- ❌ `POST /api/v1/classes` - Create new class
- ❌ `PUT /api/v1/classes/{id}` - Update class
- ❌ `DELETE /api/v1/classes/{id}` - Delete class

### Assignment Management (AssignmentController)

- ❌ `GET /api/v1/assignments` - List all assignments
- ❌ `GET /api/v1/assignments/{id}` - Get assignment by ID
- ❌ `POST /api/v1/assignments` - Create new assignment
- ❌ `PUT /api/v1/assignments/{id}` - Update assignment
- ❌ `DELETE /api/v1/assignments/{id}` - Delete assignment

### Grade Management (GradeController)

- ❌ `GET /api/v1/grades` - List all grades
- ❌ `GET /api/v1/grades/{id}` - Get grade by ID
- ❌ `POST /api/v1/grades` - Create new grade
- ❌ `PUT /api/v1/grades/{id}` - Update grade
- ❌ `DELETE /api/v1/grades/{id}` - Delete grade

---

## 🎓 Curriculum Management

### Curriculum Advanced Features (CurriculumController)

- ❌ `GET /api/v1/curriculum/enrollment/for-enrollment` - Get curriculum for enrollment
- ❌ `GET /api/v1/curriculum/enrollment/program-curriculum` - Get program curriculum
- ❌ `GET /api/v1/curriculum/enrollment/{program_id}` - Get enrollment curriculum for program
- ❌ `GET /api/v1/curriculum/roadmap/{program_id}` - Get program roadmap
- ❌ `GET /api/v1/curriculum/statistics` - Get curriculum statistics
- ❌ `GET /api/v1/curriculum/distinct-values` - Get distinct values for filtering
- ❌ `GET /api/v1/curriculum/for-student` - Get subjects for student
- ❌ `GET /api/v1/curriculum/sharing-info` - Get subject sharing information
- ❌ `POST /api/v1/curriculum/{id}/end-version` - End curriculum version

### Student Curriculum Roadmap (StudentCurriculumRoadmapController)

- ❌ `GET /api/v1/student-roadmap` - List all student roadmaps
- ❌ `GET /api/v1/student-roadmap/{roadmap_id}` - Get roadmap by ID
- ❌ `GET /api/v1/student-roadmap/program/{program_id}/current` - Get current roadmap for program
- ❌ `GET /api/v1/student-roadmap/program/{program_id}/versions` - Get roadmap versions for program

---

## 📆 Academic Term Management

### Academic Term Advanced Features (AcademicTermController)

- ❌ `GET /api/v1/academic-terms/distinct-names` - Get distinct academic term names
- ❌ `GET /api/v1/academic-terms/statistics` - Get academic term statistics

---

## 📝 Enrollment Management

### Enrollment Period (EnrollmentPeriodController)

**All endpoints missing - entire feature not implemented in FE**

- ❌ `GET /api/v1/enrollment-periods` - List all enrollment periods
- ❌ `GET /api/v1/enrollment-periods/current` - Get current enrollment period
- ❌ `GET /api/v1/enrollment-periods/preview-subjects` - Preview available subjects
- ❌ `GET /api/v1/enrollment-periods/suggested-subjects` - Get suggested subjects for student
- ❌ `POST /api/v1/enrollment-periods/{period_id}/set-current` - Set enrollment period as current
- ❌ `POST /api/v1/enrollment-periods/{period_id}/open` - Open enrollment period
- ❌ `POST /api/v1/enrollment-periods/{period_id}/close` - Close enrollment period
- ❌ `POST /api/v1/enrollment-periods/sync-subjects` - Sync subjects to default curricula

---

## 🏢 Room Management

### Room Advanced Features (RoomController)

- ❌ `GET /api/v1/rooms/statistics` - Get room statistics
- ❌ `GET /api/v1/rooms/distinct-values` - Get distinct values for filtering

---

## 🏛️ College Management

### College (CollegeController)

**All endpoints missing - entire feature not implemented in FE**

- ❌ `GET /api/v1/colleges` - List all colleges
- ❌ `GET /api/v1/colleges/{id}` - Get college by ID
- ❌ `POST /api/v1/colleges` - Create new college
- ❌ `PUT /api/v1/colleges/{id}` - Update college
- ❌ `DELETE /api/v1/colleges/{id}` - Delete college
- ❌ `GET /api/v1/colleges/statistics` - Get college statistics
- ❌ `GET /api/v1/colleges/distinct-values` - Get distinct values for filtering
- ❌ `GET /api/v1/colleges/{college}/employees` - Get employees in college
- ❌ `POST /api/v1/colleges/{college}/toggle-status` - Toggle college status

---

## 👤 User Management

### User Advanced Features (UserController)

- ❌ `GET /api/v1/users/statistics` - Get user statistics
- ❌ `POST /api/v1/users/{id}/assign-role` - Assign role to user
- ❌ `DELETE /api/v1/users/{id}/remove-role` - Remove role from user

---

## 🔑 Role Management

### Role Management (RoleController)

**✅ FULLY IMPLEMENTED - All basic role features available in FE**

- ✅ `GET /api/v1/roles` - List all roles
- ✅ `GET /api/v1/roles/{id}` - Get role by ID
- ✅ `POST /api/v1/roles` - Create new role
- ✅ `PUT /api/v1/roles/{id}` - Update role
- ✅ `DELETE /api/v1/roles/{id}` - Delete role
- ✅ `GET /api/v1/roles/statistics` - Get role statistics
- ✅ `GET /api/v1/roles/distinct-values` - Get distinct values for filtering
- ✅ `GET /api/v1/roles/distinct-names` - Get distinct role names
- ✅ `GET /api/v1/roles/{role}/users` - Get users with specific role
- ✅ `POST /api/v1/roles/assign-to-user` - Assign role to user
- ✅ `POST /api/v1/roles/assign-multiple-to-user` - Assign multiple roles to user
- ✅ `POST /api/v1/roles/{role}/assign-users` - Assign multiple users to role
- ✅ `POST /api/v1/roles/{role}/remove-users` - Remove multiple users from role
- ✅ `POST /api/v1/roles/{role}/toggle-user-role` - Toggle user's role

### Enhanced Role Management (RoleManagementController)

**✅ FULLY IMPLEMENTED - All advanced role management features available in FE**

- ✅ `GET /api/v1/role-management/roles` - List all roles (enhanced)
- ✅ `GET /api/v1/role-management/roles/hierarchy` - Get role hierarchy
- ✅ `GET /api/v1/role-management/roles/statistics` - Get role statistics
- ✅ `GET /api/v1/role-management/roles/validate-structure` - Validate role structure
- ✅ `GET /api/v1/role-management/roles/distinct-names` - Get distinct role names
- ✅ `GET /api/v1/role-management/roles/{role}` - Get role details
- ✅ `POST /api/v1/role-management/roles` - Create new role
- ✅ `PUT /api/v1/role-management/roles/{role}` - Update role
- ✅ `DELETE /api/v1/role-management/roles/{role}` - Delete role
- ✅ `POST /api/v1/role-management/roles/{role}/permissions` - Assign permissions to role
- ✅ `POST /api/v1/role-management/roles/{role}/module-access` - Set module access for role
- ✅ `POST /api/v1/role-management/roles/{role}/assign-users` - Assign users to role
- ✅ `GET /api/v1/role-management/modules` - Get all modules
- ✅ `GET /api/v1/role-management/permissions` - Get all permissions
- ✅ `GET /api/v1/role-management/users` - Get all users (for role management)

**Frontend Implementation:**

- Page: `/admin/roles` → `src/pages/RoleListAdmin.jsx`
- Service: `src/services/roleService.js` (all endpoints integrated)
- Access: Super Admin & Campus Admin only

---

## 🔒 Permission Management

### Permission Checking (Permission Routes)

**All endpoints missing - permission checking not implemented in FE**

- ❌ `GET /api/v1/permissions/user-modules` - Get user's accessible modules
- ❌ `GET /api/v1/permissions/user-permissions` - Get user's permissions
- ❌ `POST /api/v1/permissions/check-permission` - Check if user has specific permission
- ❌ `POST /api/v1/permissions/check-module-access` - Check if user can access module

---

## 📊 Summary by Priority

### 🔴 High Priority (Core Features)

1. **College Management** - Entire feature missing (9 endpoints)
2. **Enrollment Period Management** - Entire feature missing (8 endpoints)
3. **Student Management** - Core CRUD operations (8 endpoints)
4. **Employee Management** - Core CRUD operations (8 endpoints)
5. ~~**Role & Permission Management**~~ - ✅ **COMPLETED** (29 endpoints implemented)

### 🟡 Medium Priority (Extended Features)

1. **Class Management** - Academic operations (5 endpoints)
2. **Assignment Management** - Academic operations (5 endpoints)
3. **Grade Management** - Academic operations (5 endpoints)
4. **Curriculum Advanced Features** - Enhanced curriculum tools (9 endpoints)
5. **Session Management** - Security features (3 endpoints)

### 🟢 Low Priority (Nice to Have)

1. **Statistics Endpoints** - Various statistics endpoints across multiple controllers
2. **File Upload** - Generic file upload (1 endpoint)
3. **Distinct Values** - Filtering helpers across multiple controllers

---

## 📈 Implementation Statistics

- **Total Backend Endpoints**: ~150+
- **Frontend Implemented**: ~79 (29 role endpoints + 50 previous)
- **Missing Endpoints**: ~71
- **Implementation Coverage**: ~53%

### Missing by Category

- ~~Role & Permission Management~~: ✅ **0 endpoints** (29 implemented)
- Academic Management (Classes, Assignments, Grades): 15 endpoints (21%)
- Student & Employee Management: 16 endpoints (23%)
- College Management: 9 endpoints (13%)
- Enrollment Management: 8 endpoints (11%)
- Curriculum Advanced: 9 endpoints (13%)
- Statistics & Utilities: ~14 endpoints (20%)
- Others: ~10 endpoints (14%)

---

## 🎯 Recommended Implementation Order

### Phase 1: Critical Features

1. **College Management** - Required for institutional hierarchy
2. **Student & Employee Management** - Core user management
3. ~~**Role & Permission Management**~~ - ✅ **COMPLETED** - Access control foundation

### Phase 2: Academic Features

4. **Class Management** - Academic operations
5. **Assignment & Grade Management** - Academic tracking
6. **Enrollment Period Management** - Student enrollment

### Phase 3: Enhancement Features

7. **Curriculum Advanced Features** - Enhanced curriculum tools
8. **Session Management** - Security enhancements
9. **Statistics & Reports** - Analytics and insights

### Phase 4: Utilities

10. **File Upload** - Generic file handling
11. **Permission Checking UI** - User-facing permission checks
12. **Various Statistics Endpoints** - Data insights

---

## 📝 Notes

- Some endpoints may be role-restricted (Super Admin, Campus Admin, Registrar, etc.)
- Priority should be based on actual business requirements
- Some features might be intentionally not implemented in FE if not needed
- Consider creating dedicated service files for each major feature (e.g., `collegeService.js`, `enrollmentService.js`, `roleService.js`)
