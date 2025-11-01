# 🚀 Quick Start: Role-Based Permissions

**Implementation Complete**: October 22, 2025  
**Status**: ✅ Ready to Use

---

## ⚡ Quick Reference

### 5-Minute Integration for New Pages

#### 1️⃣ Import Dependencies

```javascript
import { usePermissions } from "../contexts/PermissionContext";
import { PermissionButton } from "../components/ui/PermissionButton";
import { MODULES, ACTIONS } from "../services/permissionService";
```

#### 2️⃣ Use Permission Hook

```javascript
function MyPage() {
  const { getModulePermissions } = usePermissions();

  // Get permissions for your module
  const permissions = getModulePermissions(MODULES.YOUR_MODULE);

  // ... rest of component
}
```

#### 3️⃣ Replace Buttons

```javascript
// Before:
<Button onClick={handleCreate}>Create</Button>
<Button onClick={handleEdit}>Edit</Button>
<Button onClick={handleDelete}>Delete</Button>

// After:
<PermissionButton
  moduleCode={MODULES.YOUR_MODULE}
  action={ACTIONS.CREATE}
  hideIfNoPermission={true}
  onClick={handleCreate}
>
  Create
</PermissionButton>

<PermissionButton
  moduleCode={MODULES.YOUR_MODULE}
  action={ACTIONS.EDIT}
  onClick={handleEdit}
>
  Edit
</PermissionButton>

<PermissionButton
  moduleCode={MODULES.YOUR_MODULE}
  action={ACTIONS.DELETE}
  hideIfNoPermission={true}
  onClick={handleDelete}
  variant="destructive"
>
  Delete
</PermissionButton>
```

#### 4️⃣ Protect Route

```javascript
// In App.jsx
<Route
  path="/admin/your-page"
  element={
    <ProtectedRoute requiredRole={["Super Admin", "Campus Admin", "Registrar"]}>
      <YourPage />
    </ProtectedRoute>
  }
/>
```

---

## 📋 Available Modules

```javascript
MODULES.ACADEMIC_MANAGEMENT;
MODULES.CAMPUS_MANAGEMENT;
MODULES.CALENDAR_EVENTS;
MODULES.SYSTEM_ADMINISTRATION;
MODULES.USER_MANAGEMENT;
MODULES.STUDENT_MANAGEMENT;
MODULES.EMPLOYEE_MANAGEMENT;
MODULES.SUBJECT_MANAGEMENT;
MODULES.PROGRAM_MANAGEMENT;
MODULES.CURRICULUM_MANAGEMENT;
MODULES.ACADEMIC_TERM_MANAGEMENT;
MODULES.ENROLLMENT_PERIOD_MANAGEMENT;
MODULES.COLLEGE_MANAGEMENT;
MODULES.ROOM_MANAGEMENT;
MODULES.ACADEMIC_CALENDAR;
MODULES.ROLE_MANAGEMENT;
```

---

## 🎯 Available Actions

```javascript
ACTIONS.VIEW; // Read access
ACTIONS.CREATE; // Create new records
ACTIONS.EDIT; // Update existing records
ACTIONS.DELETE; // Delete records
ACTIONS.EXPORT; // Export data
ACTIONS.IMPORT; // Import data
```

---

## 👥 Available Roles

```javascript
ROLES.SUPER_ADMIN; // Level 1
ROLES.ADMIN; // Level 2
ROLES.COLLEGE_PRESIDENT; // Level 2
ROLES.ACADEMIC_AFFAIRS; // Level 3
ROLES.ACADEMIC_OFFICER; // Level 4
ROLES.CAMPUS_ADMIN; // Level 4
ROLES.REGISTRAR; // Level 5
ROLES.ACCOUNTING; // Level 5
ROLES.ACADEMIC_COORDINATOR_CAMPUS; // Level 6
ROLES.STUDENT_AFFAIRS; // Level 6
ROLES.DEAN; // Level 7
ROLES.MARKETING; // Level 7
ROLES.DEPARTMENT_HEAD; // Level 8
ROLES.CAMPUS_COORDINATOR; // Level 8
ROLES.FACULTY; // Level 9
ROLES.SYSTEM_STAFF; // Level 9
ROLES.STUDENT; // Level 10
```

---

## 🔑 Permission Hooks

```javascript
const {
  hasPermission, // async (module, action) => boolean
  canAccessModule, // (moduleCode) => boolean
  hasAnyRole, // (roles[]) => boolean
  hasRole, // (role) => boolean
  getModulePermissions, // (moduleCode) => { can_view, can_create, ... }
  isSuperAdmin, // () => boolean
  isCampusAdmin, // () => boolean
  userModules, // array of accessible modules
  userPermissions, // array of user permissions
  loading, // boolean
} = usePermissions();
```

---

## 🎨 Component Patterns

### Pattern 1: Permission Button (Hide if No Access)

```javascript
<PermissionButton
  moduleCode={MODULES.SUBJECT_MANAGEMENT}
  action={ACTIONS.CREATE}
  hideIfNoPermission={true}
  onClick={handleCreate}
>
  <Plus className="h-4 w-4" />
  Create Subject
</PermissionButton>
```

### Pattern 2: Permission Button (Disable if No Access)

```javascript
<PermissionButton
  moduleCode={MODULES.SUBJECT_MANAGEMENT}
  action={ACTIONS.EDIT}
  hideIfNoPermission={false} // Shows but disabled
  onClick={handleEdit}
>
  Edit
</PermissionButton>
```

### Pattern 3: Conditional Rendering

```javascript
import { HasPermission } from "../components/ui/PermissionButton";

<HasPermission moduleCode={MODULES.SUBJECT_MANAGEMENT} action={ACTIONS.EXPORT}>
  <ExportSection />
</HasPermission>;
```

### Pattern 4: Role-Based Rendering

```javascript
<HasPermission requiredRole={["Super Admin", "Campus Admin"]}>
  <AdminOnlyFeature />
</HasPermission>
```

### Pattern 5: Icon Button with Permission

```javascript
import { PermissionIconButton } from "../components/ui/PermissionButton";

<PermissionIconButton
  moduleCode={MODULES.SUBJECT_MANAGEMENT}
  action={ACTIONS.EDIT}
  icon={Edit}
  onClick={handleEdit}
  title="Edit"
/>;
```

---

## 🛡️ Route Protection Patterns

### Pattern 1: Single Role

```javascript
<ProtectedRoute requiredRole="Super Admin">
  <AdminPage />
</ProtectedRoute>
```

### Pattern 2: Multiple Roles (Any Match)

```javascript
<ProtectedRoute requiredRole={["Super Admin", "Campus Admin", "Registrar"]}>
  <ManagementPage />
</ProtectedRoute>
```

### Pattern 3: Module-Based

```javascript
<ProtectedRoute requiredModule={MODULES.ACADEMIC_MANAGEMENT}>
  <AcademicPage />
</ProtectedRoute>
```

### Pattern 4: Action-Specific

```javascript
<ProtectedRoute
  requiredModule={MODULES.SUBJECT_MANAGEMENT}
  requiredAction={ACTIONS.EDIT}
>
  <SubjectEditPage />
</ProtectedRoute>
```

### Pattern 5: Super Admin Only

```javascript
<ProtectedRoute requireSuperAdmin={true}>
  <SystemConfigPage />
</ProtectedRoute>
```

---

## 🧪 Testing Checklist

For each new page:

- [ ] Import permission dependencies
- [ ] Add permission hooks
- [ ] Replace Create button with PermissionButton
- [ ] Replace Edit buttons with PermissionButton
- [ ] Replace Delete buttons with PermissionButton
- [ ] Add Export/Import buttons with permissions (if applicable)
- [ ] Protect route in App.jsx
- [ ] Test as Super Admin (should see everything)
- [ ] Test as Campus Admin (should see most features)
- [ ] Test as Registrar (should see academic features)
- [ ] Test as Student (should see limited features)
- [ ] Verify sidebar shows correct menu items
- [ ] Verify unauthorized users get access denied

---

## 🚦 Role Access Matrix (Quick Reference)

| Module              | Super Admin | Campus Admin | Registrar       | Academic Coord | Others  |
| ------------------- | ----------- | ------------ | --------------- | -------------- | ------- |
| Academic Management | ✅ Full     | ✅ Full      | ✅ Read/Write   | ✅ Read/Write  | Limited |
| Campus Management   | ✅ Full     | ✅ Full      | ✅ Read/Limited | ✅ Read        | No      |
| Calendar & Events   | ✅ Full     | ✅ Manage    | ✅ Manage       | ✅ Manage      | View    |
| System Admin        | ✅ Full     | ✅ Limited   | ❌ No           | ❌ No          | ❌ No   |
| User Management     | ✅ Full     | ✅ Campus    | ✅ Read/Limited | ✅ Read        | ❌ No   |

---

## 📞 Need Help?

1. **Detailed Guide**: See `ROLE_PERMISSIONS_IMPLEMENTATION_GUIDE.md`
2. **Complete Summary**: See `ROLE_IMPLEMENTATION_COMPLETE_SUMMARY.md`
3. **Role Matrix**: See `ROLE_BASED_ACCESS_MATRIX_IMPLEMENTATION.md`

---

## ✅ Files Created

### Core Implementation

- ✅ `/src/services/permissionService.js` - Permission logic
- ✅ `/src/contexts/PermissionContext.jsx` - React context & hooks
- ✅ `/src/components/ProtectedRoute.jsx` - Enhanced route protection
- ✅ `/src/components/ui/PermissionButton.jsx` - Permission-aware buttons
- ✅ `/src/components/layout/Sidebar.jsx` - Dynamic navigation
- ✅ `/src/App.jsx` - Updated with PermissionProvider

### Documentation

- ✅ `ROLE_PERMISSIONS_IMPLEMENTATION_GUIDE.md` - Complete guide
- ✅ `ROLE_IMPLEMENTATION_COMPLETE_SUMMARY.md` - Implementation summary
- ✅ `QUICK_START_ROLE_PERMISSIONS.md` - This file!

---

## 🎉 You're Ready!

The role-based permission system is fully implemented and ready to use. Simply follow the 5-minute integration pattern above for any new pages you create!

**Key Points:**

- 🔒 All routes are protected
- 🎨 UI adapts to permissions automatically
- 👥 17 roles fully supported
- 📦 5 module groups covered
- ✅ Production ready

---

_Happy coding! 🚀_

