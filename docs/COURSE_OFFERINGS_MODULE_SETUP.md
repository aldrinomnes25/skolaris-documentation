# Course Offerings Module Setup

## Summary

The Course Offerings Management module has been successfully added to the backend seeders with appropriate role-based access. The frontend is already configured to display this module.

## Changes Made

### Backend (skolaris-be)

#### 1. SystemModuleSeeder.php

✅ Added Course Offerings module:

- Module Code: `course_offerings`
- Display Name: Course Offerings
- Route: `/admin/course-offerings`
- Sort Order: 9 (between Curriculum and Enrollment Periods)

#### 2. RoleModuleAccessSeeder.php

✅ Added module access for the following roles:

- **Super Admin**: Full control (view, create, edit, delete, export, import)
- **Admin (Central Office)**: Full CRUD except delete
- **Academic Affairs (VP/AVP)**: Full CRUD except delete
- **Academic Coordinator (Campus)**: Full CRUD except delete
- **Dean**: Full CRUD except delete
- **Registrar**: Full CRUD except delete

### Frontend (skolaris-fe)

✅ Already configured:

- Sidebar.jsx: Shows "Course Offerings" menu item (lines 150-156)
- App.jsx: Routes configured for Course Offerings (lines 96-99)
- Component files exist: `CourseOfferingsListAdmin.jsx`

## Why It's Not Showing Yet

The module appears only after the database is seeded with the new module and permissions.

## To Apply the Changes

### Option 1: Fresh Migration (Recommended for Development)

```bash
cd skolaris-be

# Stop any running Laravel server first
# Then run:
php artisan migrate:fresh --seed
```

⚠️ **Warning**: This will delete all existing data and recreate the database.

### Option 2: Update Existing Database

```bash
cd skolaris-be

# Clear any database locks (restart Laravel if needed)
# Then manually add the module to the database:

php artisan tinker
```

In tinker, run:

```php
// Check if module exists
$exists = App\Models\SystemModule::where('module_code', 'course_offerings')->exists();
if (!$exists) {
    App\Models\SystemModule::create([
        'module_name' => 'Course Offerings Management',
        'module_code' => 'course_offerings',
        'display_name' => 'Course Offerings',
        'description' => 'Manage course offerings, schedules, and faculty assignments',
        'icon' => 'fas fa-book-open',
        'route_path' => '/admin/course-offerings',
        'is_active' => true,
        'sort_order' => 9,
        'access_level' => 'restricted',
    ]);
    echo "Module created!";
} else {
    echo "Module already exists!";
}
```

### Option 3: Reseed Without Migration

If the database is locked or you can't do a fresh migration, you need to:

1. Stop the Laravel server (to unlock database)
2. Run: `php artisan db:seed --class=SystemModuleSeeder`
3. Run: `php artisan db:seed --class=RoleModuleAccessSeeder`
4. Start the Laravel server again

## After Seeding

1. **Logout and login again** to refresh your permissions
2. The "Course Offerings" menu item will appear in the sidebar under "Academic Management"
3. You'll be able to access `/admin/course-offerings`

## Verification

To verify the module was added correctly, check in your database:

```php
php artisan tinker
```

Run:

```php
// Check module
$module = App\Models\SystemModule::where('module_code', 'course_offerings')->first();
var_dump($module);

// Check role access
$superAdmin = App\Models\Role::where('role_name', 'Super Admin')->first();
$access = App\Models\RoleModuleAccess::where('role_id', $superAdmin->role_id)
    ->whereHas('module', function($q) {
        $q->where('module_code', 'course_offerings');
    })
    ->first();
var_dump($access);
```

## Module Access Summary

| Role                   | View | Create | Edit | Delete | Export | Import |
| ---------------------- | ---- | ------ | ---- | ------ | ------ | ------ |
| Super Admin            | ✅   | ✅     | ✅   | ✅     | ✅     | ✅     |
| Admin (Central Office) | ✅   | ✅     | ✅   | ❌     | ✅     | ✅     |
| Academic Affairs       | ✅   | ✅     | ✅   | ❌     | ✅     | ✅     |
| Academic Coordinator   | ✅   | ✅     | ✅   | ❌     | ✅     | ✅     |
| Dean                   | ✅   | ✅     | ✅   | ❌     | ✅     | ✅     |
| Registrar              | ✅   | ✅     | ✅   | ❌     | ✅     | ✅     |

## Next Steps

1. Apply the database changes using one of the options above
2. Logout and login to refresh permissions
3. The Course Offerings module will appear in the Academic Management section
4. Test the module functionality

## Troubleshooting

### Module not showing after seeding?

1. Clear browser cache
2. Logout and login again
3. Check browser console for errors
4. Verify the API returns the module: Check `/api/permissions/user-modules` in Network tab

### Database locked error?

- Stop any running Laravel servers
- Close any DB browser tools
- Wait a few seconds and try again

### Permission issues?

- Verify your user has the Super Admin role or one of the Academic roles
- Check the `user_roles` table in the database
- Clear permission cache if needed
