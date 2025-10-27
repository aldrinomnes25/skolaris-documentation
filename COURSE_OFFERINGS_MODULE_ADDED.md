# Course Offerings Module Added

## Summary

Added "Course Offerings Management" module to the system with proper role-based access control.

## Changes Made

### 1. SystemModuleSeeder.php

-   Added new module: `course_offerings`

    -   Module Name: Course Offerings Management
    -   Display Name: Course Offerings
    -   Description: Manage course offerings, schedules, and faculty assignments
    -   Route: `/admin/course-offerings`
    -   Icon: `fas fa-book-open`
    -   Sort Order: 9 (placed between Curriculum and Enrollment Periods)
    -   Access Level: restricted

-   Updated sort orders for all subsequent modules to maintain proper ordering

### 2. RoleModuleAccessSeeder.php

Added `course_offerings` access permissions for the following roles:

#### Super Admin

-   Full control: view, create, edit, delete, export, import

#### Admin (Central Office)

-   Full CRUD except delete: view, create, edit, export, import

#### Academic Affairs (VP/AVP)

-   Full CRUD except delete: view, create, edit, export, import

#### Academic Coordinator (Campus)

-   Full CRUD except delete: view, create, edit, export, import

#### Dean

-   Full CRUD except delete: view, create, edit, export, import

#### Registrar

-   Full CRUD except delete: view, create, edit, export, import

## Access Permissions

The Course Offerings module is accessible to:

1. **Super Admin** - Full control with delete permissions
2. **Academic roles** (including VP/AVP, Academic Coordinator, Dean, Registrar) - Full CRUD except delete
3. **Admin (Central Office)** - Full CRUD except delete

This ensures that:

-   Academic personnel can manage course offerings
-   Super Admin has ultimate control
-   Non-academic users don't have unnecessary access

## Database Seeding

To apply these changes, run:

```bash
php artisan migrate:fresh --seed
```

Or if just reseeding modules:

```bash
php artisan db:seed --class=SystemModuleSeeder
php artisan db:seed --class=RoleModuleAccessSeeder
```

## Next Steps

1. Run the database seeder to create the module
2. Update frontend to include the Course Offerings module in navigation
3. Ensure API endpoints exist for the module
4. Update user interfaces to match the new module structure
