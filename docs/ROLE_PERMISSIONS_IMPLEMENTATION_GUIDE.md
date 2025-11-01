# Role-Based Permissions Implementation Guide

**Date**: October 22, 2025  
**Status**: ✅ **IMPLEMENTED**  
**Version**: 1.0.0

---

## 📋 Overview

This guide explains how role-based access control has been implemented across all modules in the SKOLARIS system. The implementation covers both frontend and backend with comprehensive permission checking.

---

## 🎯 Modules Covered

### ✅ Academic Management

- **Subjects** - Subject/Course management
- **Academic Programs** - Program definitions and management
- **Academic Terms** - Term/semester management
- **Curriculum** - Curriculum planning and versioning
- **Enrollment Periods** - Enrollment period management

### ✅ Campus Management

- **Campuses** - Campus location management
- **Colleges** - College/department management
- **Classrooms** - Room and facility management

### ✅ Calendar & Events

- **Academic Calendar** - Institutional calendar events
- **Calendar Visibility Rules** - Event visibility management
- **Personal Calendar** - Individual user calendars

### ✅ System Administration

- **Role Management** - User roles and permissions
- **User Management** - User account administration

### ✅ User Management

- **Students** - Student records management
- **Employees** - Employee records management
- **Users** - System user accounts

---

## 🏗️ Architecture

### Frontend Components

#### 1. **Permission Service** (`src/services/permissionService.js`)

Central service for permission checking:

```javascript
import permissionService, {
  MODULES,
  ACTIONS,
  ROLES,
} from "../services/permissionService";

// Check if user can access a module
permissionService.canAccessAcademicManagement(user);

// Check if user has specific role
permissionService.userHasRole(user, ROLES.SUPER_ADMIN);

// Get module permissions
permissionService.getModulePermissions(user, MODULES.SUBJECT_MANAGEMENT);
```

#### 2. **Permission Context** (`src/contexts/PermissionContext.jsx`)

React context providing permission hooks:

```javascript
import { usePermissions } from '../contexts/PermissionContext'

function MyComponent() {
  const {
    hasPermission,
    canAccessModule,
    hasAnyRole,
    getModulePermissions,
    isSuperAdmin
  } = usePermissions()

  // Check permissions
  const canEdit = await hasPermission(MODULES.SUBJECT_MANAGEMENT, ACTIONS.EDIT)
}
```

#### 3. **ProtectedRoute Component** (`src/components/ProtectedRoute.jsx`)

Route-level protection:

```javascript
// Protect by role(s)
<ProtectedRoute requiredRole={['Super Admin', 'Campus Admin']}>
  <SubjectListAdmin />
</ProtectedRoute>

// Protect by module
<ProtectedRoute requiredModule={MODULES.SUBJECT_MANAGEMENT}>
  <SubjectListAdmin />
</ProtectedRoute>

// Protect by action
<ProtectedRoute
  requiredModule={MODULES.SUBJECT_MANAGEMENT}
  requiredAction={ACTIONS.EDIT}
>
  <SubjectFormAdmin />
</ProtectedRoute>
```

#### 4. **PermissionButton Component** (`src/components/ui/PermissionButton.jsx`)

Permission-aware button component:

```javascript
import { PermissionButton, HasPermission } from '../components/ui/PermissionButton'

// Button that's hidden if no permission
<PermissionButton
  moduleCode={MODULES.SUBJECT_MANAGEMENT}
  action={ACTIONS.CREATE}
  hideIfNoPermission={true}
  onClick={handleCreate}
>
  Create Subject
</PermissionButton>

// Conditional rendering
<HasPermission
  moduleCode={MODULES.SUBJECT_MANAGEMENT}
  action={ACTIONS.EDIT}
>
  <Button onClick={handleEdit}>Edit</Button>
</HasPermission>
```

#### 5. **Dynamic Sidebar** (`src/components/layout/Sidebar.jsx`)

Permission-based navigation:

- Menu items automatically shown/hidden based on user's accessible modules
- Uses `permissionService` methods to determine visibility
- Dynamically generates menu structure based on role

---

## 🔐 Role Hierarchy & Permissions

### Level 1 - Super Admin

**Full access to all modules and actions**

- All CRUD operations
- System configuration
- User management
- Cross-campus access

### Level 2-3 - Executive & Academic Leadership

- Admin (Central Office)
- College President
- Academic Affairs (VP/AVP)

**Access**: Read/Approve for most modules, limited write

### Level 4-6 - Campus & Academic Management

- Campus Admin
- Academic Officer (Central)
- Registrar
- Academic Coordinator (Campus)
- Student Affairs

**Access**: Full read/write for assigned modules, campus-scoped

### Level 7-9 - Department & Operational

- Dean
- Department Head
- Faculty
- System Staff

**Access**: Limited to assigned areas, mostly read and approve

### Level 10 - Students

**Access**: Read-only for own data, self-service actions

---

## 🔧 Implementation Pattern

### Page-Level Implementation

#### Step 1: Import Required Dependencies

```javascript
import { usePermissions } from "../contexts/PermissionContext";
import {
  PermissionButton,
  HasPermission,
} from "../components/ui/PermissionButton";
import { MODULES, ACTIONS } from "../services/permissionService";
```

#### Step 2: Get Permission Hooks

```javascript
function MyAdminPage() {
  const { getModulePermissions, hasAnyRole } = usePermissions();

  // Get permissions for this module
  const permissions = getModulePermissions(MODULES.SUBJECT_MANAGEMENT);
}
```

#### Step 3: Use Permission-Aware Components

```javascript
// Create button - only shows if user can create
<PermissionButton
  moduleCode={MODULES.SUBJECT_MANAGEMENT}
  action={ACTIONS.CREATE}
  hideIfNoPermission={true}
  onClick={openCreate}
>
  <Plus className="h-4 w-4" />
  Add Subject
</PermissionButton>

// Edit button - disabled if no edit permission
<PermissionButton
  moduleCode={MODULES.SUBJECT_MANAGEMENT}
  action={ACTIONS.EDIT}
  onClick={() => openEdit(item)}
  variant="outline"
  size="icon"
>
  <Edit className="h-4 w-4" />
</PermissionButton>

// Delete button - only for users with delete permission
<PermissionButton
  moduleCode={MODULES.SUBJECT_MANAGEMENT}
  action={ACTIONS.DELETE}
  hideIfNoPermission={true}
  onClick={() => handleDelete(item.id)}
  variant="destructive"
  size="icon"
>
  <Trash className="h-4 w-4" />
</PermissionButton>
```

#### Step 4: Conditional Features

```javascript
// Show/hide entire sections based on permissions
<HasPermission moduleCode={MODULES.SUBJECT_MANAGEMENT} action={ACTIONS.EXPORT}>
  <Button onClick={handleExport}>
    <Download className="h-4 w-4 mr-2" />
    Export Data
  </Button>
</HasPermission>
```

---

## 🚀 Quick Integration Checklist

### For Each Admin Page:

- [ ] **Import Permission Hooks**

  ```javascript
  import { usePermissions } from "../contexts/PermissionContext";
  import { PermissionButton } from "../components/ui/PermissionButton";
  import { MODULES, ACTIONS } from "../services/permissionService";
  ```

- [ ] **Replace Action Buttons**

  - Create buttons → `PermissionButton` with `action={ACTIONS.CREATE}`
  - Edit buttons → `PermissionButton` with `action={ACTIONS.EDIT}`
  - Delete buttons → `PermissionButton` with `action={ACTIONS.DELETE}`
  - Export buttons → `PermissionButton` with `action={ACTIONS.EXPORT}`

- [ ] **Add Module Check to Route**

  ```javascript
  <Route
    path="/admin/subjects"
    element={
      <ProtectedRoute
        requiredRole={["Super Admin", "Campus Admin", "Registrar"]}
      >
        <SubjectListAdmin />
      </ProtectedRoute>
    }
  />
  ```

- [ ] **Test Permission Behaviors**
  - Super Admin sees all buttons
  - Other roles see appropriate buttons
  - Unauthorized users redirected/blocked
  - Buttons properly disabled when no permission

---

## 📊 Module-Specific Roles

### Academic Management Modules

**Accessible to:**

- Super Admin (Full access)
- Campus Admin (Full access, campus-scoped)
- Registrar (Full read/write)
- Academic Coordinator (Campus) (Read/Write, no delete)
- Academic Affairs (VP/AVP) (Read/Approve)
- Dean (Read/Limited write)

### Campus Management Modules

**Accessible to:**

- Super Admin (Full access)
- Campus Admin (Full access, campus-scoped)
- Registrar (Read/Limited write)
- Academic Coordinator (Campus) (Read only)

### Calendar & Events

**View Access:** All authenticated users  
**Manage Access:**

- Super Admin
- Campus Admin
- Registrar
- Academic Coordinator (Campus)
- Academic Affairs (VP/AVP)

### System Administration

**Accessible to:**

- Super Admin (Full access)
- Campus Admin (Limited access, campus-scoped)

### User Management

**Accessible to:**

- Super Admin (Full access)
- Campus Admin (Campus-scoped)
- Registrar (Read/Limited write)
- Academic Coordinator (Campus) (Read only)
- Admin (Central Office) (Read/Approve)

---

## 🎨 UI/UX Patterns

### Button Visibility Patterns

#### Pattern 1: Hide if No Permission

Best for optional features or admin-only actions:

```javascript
<PermissionButton
  hideIfNoPermission={true}
  // ... other props
/>
```

#### Pattern 2: Disable if No Permission

Best for core features that users should know exist:

```javascript
<PermissionButton
  hideIfNoPermission={false} // default
  // ... other props
  // Button will be disabled and show tooltip
/>
```

#### Pattern 3: Conditional Rendering

Best for complex UI sections:

```javascript
<HasPermission moduleCode={MODULE} action={ACTION}>
  <ComplexFeatureSection />
</HasPermission>
```

---

## 🔍 Backend Integration

### Route Protection

All API routes are protected with role middleware:

```php
// Example from routes/api.php

// Super Admin, Campus Admin, Registrar can access
Route::middleware('role:Super Admin,Campus Admin,Registrar')->group(function () {
    Route::apiResource('subjects', SubjectController::class);
});

// Permission-based middleware
Route::middleware('permission:subject_management,edit')->group(function () {
    Route::put('subjects/{subject}', [SubjectController::class, 'update']);
});
```

### Permission Service (Backend)

```php
use App\Services\PermissionService;

class SubjectController extends Controller
{
    protected $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    public function update(Request $request, Subject $subject)
    {
        // Check if user can edit
        if (!$this->permissionService->userCanAccessModule(
            $request->user(),
            'subject_management',
            'edit'
        )) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // ... update logic
    }
}
```

---

## 📝 Testing Checklist

### For Each Role:

1. **Login as role**
2. **Check sidebar navigation**

   - Only permitted modules visible
   - No unauthorized links

3. **Access each permitted module**

   - Page loads successfully
   - No console errors

4. **Check action buttons**

   - Create button (if permitted)
   - Edit buttons (if permitted)
   - Delete buttons (if permitted)
   - Export/Import buttons (if permitted)

5. **Test denied actions**

   - Buttons hidden or disabled
   - API returns 403 if accessed directly
   - User-friendly error messages

6. **Cross-campus checks** (for campus-scoped roles)
   - Can only see/edit own campus data
   - Cannot access other campus data

---

## 🐛 Common Issues & Solutions

### Issue 1: Buttons Still Visible for Unauthorized Users

**Solution**: Ensure page imports `PermissionButton` instead of regular `Button`

### Issue 2: Permission Checks Not Working

**Solution**: Verify `PermissionProvider` wraps the app in `App.jsx`

### Issue 3: Route Still Accessible Despite Protection

**Solution**: Check backend route has proper `role:` or `permission:` middleware

### Issue 4: Sidebar Shows Wrong Items

**Solution**: Clear browser cache, ensure `permissionService` methods return correct values

---

## 🎓 Best Practices

1. **Always use PermissionButton for actions**

   - Don't use regular Button for CRUD operations
   - Use `hideIfNoPermission` for admin-only features

2. **Route-level protection is mandatory**

   - Never rely on UI hiding alone
   - Always protect routes with `ProtectedRoute`

3. **Backend validation is critical**

   - UI permissions are for UX, not security
   - Always validate on backend

4. **Clear error messages**

   - Tell users why they can't access something
   - Provide next steps if applicable

5. **Test with multiple roles**
   - Don't just test as Super Admin
   - Verify all role levels work correctly

---

## 📚 Related Documentation

- [Role-Based Access Matrix](./ROLE_BASED_ACCESS_MATRIX_IMPLEMENTATION.md)
- [Backend Permission Service](../skolaris-be/app/Services/PermissionService.php)
- [Frontend Permission Service](../skolaris-fe/src/services/permissionService.js)
- [API Routes](../skolaris-be/routes/api.php)

---

## ✅ Implementation Status

| Module                | Frontend Routes | Permission Buttons | Backend Middleware | Status   |
| --------------------- | --------------- | ------------------ | ------------------ | -------- |
| Academic Management   | ✅              | ✅                 | ✅                 | Complete |
| Campus Management     | ✅              | ✅                 | ✅                 | Complete |
| Calendar & Events     | ✅              | ✅                 | ✅                 | Complete |
| System Administration | ✅              | ✅                 | ✅                 | Complete |
| User Management       | ✅              | ✅                 | ✅                 | Complete |

---

## 🎉 Summary

The SKOLARIS system now has comprehensive role-based access control implemented across all modules:

✅ **17 Roles** with hierarchical permissions  
✅ **5 Major Module Groups** protected  
✅ **Frontend & Backend** permission checking  
✅ **Dynamic UI** based on user permissions  
✅ **Comprehensive Testing** guidelines  
✅ **Developer Documentation** for maintenance

The permission system is production-ready and provides:

- **Security**: Multi-layer permission checking
- **Usability**: Clear, role-appropriate interfaces
- **Maintainability**: Consistent patterns across codebase
- **Scalability**: Easy to add new roles and permissions

---

**Implementation Complete**: October 22, 2025  
**Ready for Production**: ✅ Yes  
**Tested**: ✅ All major roles  
**Documented**: ✅ Comprehensive

---

_For questions or issues, refer to the troubleshooting section or contact the development team._

