# Campus-Specific Filtering Implementation

## Overview

This implementation adds campus-specific filtering to User Management, Student Management, and Employee Management based on the current user's active role campus. When a user has a role that is specific to a campus (not global), they will only see data from that campus.

## Key Features

1. **Automatic Campus Filtering**: Data is automatically filtered based on the user's active role campus
2. **Global Role Support**: Users with global roles can see all data across campuses
3. **Consistent Implementation**: Same filtering logic applied across all management modules
4. **Reusable Trait**: Campus filtering logic is centralized in a reusable trait

## Implementation Details

### 1. CampusFiltering Trait

Created a new trait at `app/Traits/CampusFiltering.php` that provides:

- `getCampusFilteringParams()`: Gets the current user's campus filtering parameters
- `applyCampusFiltering($query, $campusColumn)`: Applies campus filtering to a query

```php
<?php

namespace App\Traits;

trait CampusFiltering
{
    /**
     * Get the current user's campus filtering parameters based on their active role
     */
    protected function getCampusFilteringParams()
    {
        $currentUser = auth()->user();
        $currentUserCampusId = null;
        $isCurrentUserGlobal = false;

        if ($currentUser) {
            $activeRole = $currentUser->getCurrentActiveRole();
            if ($activeRole) {
                // If the active role is global, show all data
                $isCurrentUserGlobal = $activeRole->is_global;
                // If not global, filter by the role's campus
                if (!$isCurrentUserGlobal && $activeRole->campus_id) {
                    $currentUserCampusId = $activeRole->campus_id;
                }
            }
        }

        return [
            'campus_id' => $currentUserCampusId,
            'is_global' => $isCurrentUserGlobal
        ];
    }

    /**
     * Apply campus filtering to a query based on current user's active role
     */
    protected function applyCampusFiltering($query, $campusColumn = 'campus_id')
    {
        $filteringParams = $this->getCampusFilteringParams();

        // Apply campus filtering based on current user's active role
        if (!$filteringParams['is_global'] && $filteringParams['campus_id']) {
            $query->where($campusColumn, $filteringParams['campus_id']);
        }

        return $query;
    }
}
```

### 2. Updated Controllers

#### UserController

- Added campus filtering to the `index()` method
- Users with campus-specific roles only see users from their campus
- Users with global roles see all users

#### StudentController

- Added campus filtering using JOIN with users table
- Students are filtered based on their associated user's campus
- Uses `users.campus_id` column for filtering

#### EmployeeController

- Added campus filtering to the `index()` method
- Employees are filtered based on their campus_id
- Consistent with other management modules

### 3. How It Works

1. **Role Check**: The system checks the current user's active role
2. **Global Role Detection**: If the role is global (`is_global = true`), no filtering is applied
3. **Campus-Specific Filtering**: If the role is campus-specific, data is filtered by the role's campus
4. **Query Modification**: The filtering is applied at the database query level for optimal performance

### 4. Database Structure

The filtering relies on the existing database structure:

- `roles` table has `campus_id` and `is_global` columns
- `users` table has `campus_id` column
- `students` table is linked to `users` via `user_id`
- `employees` table has `campus_id` column

### 5. Usage Examples

#### For User Management:

```php
// Users with campus-specific roles will only see users from their campus
// Users with global roles will see all users
$query = User::with(['roles.campus', 'campus', 'userType']);
$query = $this->applyCampusFiltering($query, 'campus_id');
```

#### For Student Management:

```php
// Students are filtered based on their user's campus
$query = Student::with(['user.campus', 'program'])
    ->join('users', 'students.user_id', '=', 'users.user_id');
$query = $this->applyCampusFiltering($query, 'users.campus_id');
```

#### For Employee Management:

```php
// Employees are filtered based on their campus
$query = Employee::with(['user.campus', 'college.campus']);
$query = $this->applyCampusFiltering($query, 'campus_id');
```

## Benefits

1. **Data Security**: Users can only access data from their assigned campus
2. **Performance**: Filtering happens at the database level, not in application code
3. **Consistency**: Same filtering logic across all management modules
4. **Maintainability**: Centralized filtering logic in a reusable trait
5. **Flexibility**: Easy to extend or modify filtering behavior

## Testing

To test the implementation:

1. **Create users with campus-specific roles**: Assign roles that are not global
2. **Create users with global roles**: Assign roles that are global
3. **Verify filtering**: Check that campus-specific users only see data from their campus
4. **Verify global access**: Check that global users can see all data

## Future Enhancements

1. **Audit Logging**: Add logging for campus filtering actions
2. **Performance Monitoring**: Monitor query performance with large datasets
3. **Caching**: Consider caching campus filtering parameters for better performance
4. **Frontend Integration**: Update frontend components to show campus-specific information

## Files Modified

1. `app/Traits/CampusFiltering.php` - New trait for campus filtering
2. `app/Http/Controllers/Api/UserController.php` - Added campus filtering
3. `app/Http/Controllers/Api/StudentController.php` - Added campus filtering with JOIN
4. `app/Http/Controllers/Api/EmployeeController.php` - Added campus filtering

## Conclusion

This implementation provides a robust, secure, and maintainable solution for campus-specific data filtering across the Skolaris system. The use of a trait ensures consistency and reusability, while the database-level filtering ensures optimal performance.
