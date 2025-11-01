# 🔧 API Route Duplicate Prefix Fix

## Error

```
NotFoundHttpException: The route api/v1/v1/permissions/user-modules could not be found.
```

## Problem

Notice the **double `/v1/`** in the route: `api/v1/v1/permissions/user-modules`

This happened because:

1. Base URL already includes `/v1`: `http://127.0.0.1:8000/api/v1`
2. API calls were adding `/v1/` again: `/v1/permissions/user-modules`
3. Combined result: `http://127.0.0.1:8000/api/v1/v1/permissions/user-modules` ❌

## Root Cause

In `permissionService.js`, API endpoints included the `/v1/` prefix when it's already part of the base URL.

**File**: `/skolaris-fe/src/services/api.js`

```javascript
const API_BASE_URL = "http://127.0.0.1:8000/api/v1"; // ← Already has /v1
```

**File**: `/skolaris-fe/src/services/permissionService.js`

```javascript
// ❌ Before - double v1
await api.get("/v1/permissions/user-modules");
// Results in: http://127.0.0.1:8000/api/v1/v1/permissions/user-modules
```

## Solution

Removed the redundant `/v1/` prefix from API endpoint calls.

**File**: `/skolaris-fe/src/services/permissionService.js`

### Fixed Endpoints:

**1. Line 65 - getUserModules()**

```javascript
// Before
const response = await api.get("/v1/permissions/user-modules");

// After
const response = await api.get("/permissions/user-modules");
```

**2. Line 78 - getUserPermissions()**

```javascript
// Before
const response = await api.get("/v1/permissions/user-permissions");

// After
const response = await api.get("/permissions/user-permissions");
```

**3. Line 91 - checkPermission()**

```javascript
// Before
const response = await api.post('/v1/permissions/check-permission', {...})

// After
const response = await api.post('/permissions/check-permission', {...})
```

**4. Line 108 - checkModuleAccess()**

```javascript
// Before
const response = await api.post('/v1/permissions/check-module-access', {...})

// After
const response = await api.post('/permissions/check-module-access', {...})
```

## How API URLs Work

### Correct Structure:

```
Base URL: http://127.0.0.1:8000/api/v1
Endpoint: /permissions/user-modules
Result:   http://127.0.0.1:8000/api/v1/permissions/user-modules ✅
```

### Previous (Incorrect):

```
Base URL: http://127.0.0.1:8000/api/v1
Endpoint: /v1/permissions/user-modules
Result:   http://127.0.0.1:8000/api/v1/v1/permissions/user-modules ❌
```

## Backend Routes

The actual routes in Laravel are defined without the `/v1/` prefix because it's handled by the route group:

**File**: `/skolaris-be/routes/api.php`

```php
Route::prefix('v1')->group(function () {
    Route::middleware('jwt.auth')->prefix('permissions')->group(function () {
        Route::get('user-modules', function (Request $request) {...});
        Route::get('user-permissions', function (Request $request) {...});
        Route::post('check-permission', function (Request $request) {...});
        Route::post('check-module-access', function (Request $request) {...});
    });
});
```

This creates routes:

- `/api/v1/permissions/user-modules`
- `/api/v1/permissions/user-permissions`
- `/api/v1/permissions/check-permission`
- `/api/v1/permissions/check-module-access`

## Testing

After the fix, test these endpoints:

### 1. Get User Modules

```javascript
// Frontend call
await permissionService.getUserModules()

// Resolves to
GET http://127.0.0.1:8000/api/v1/permissions/user-modules ✅
```

### 2. Get User Permissions

```javascript
// Frontend call
await permissionService.getUserPermissions()

// Resolves to
GET http://127.0.0.1:8000/api/v1/permissions/user-permissions ✅
```

### 3. Check Permission

```javascript
// Frontend call
await permissionService.checkPermission('users', 'create')

// Resolves to
POST http://127.0.0.1:8000/api/v1/permissions/check-permission ✅
```

### 4. Check Module Access

```javascript
// Frontend call
await permissionService.checkModuleAccess('USER_MANAGEMENT', 'view')

// Resolves to
POST http://127.0.0.1:8000/api/v1/permissions/check-module-access ✅
```

## Prevention

### Rule for API Endpoint Paths:

✅ **DO**: Start with `/` (slash) and resource name

```javascript
api.get("/users");
api.get("/permissions/user-modules");
api.post("/roles/assign");
```

❌ **DON'T**: Include `/v1/`, `/api/`, or base URL parts

```javascript
api.get("/v1/users"); // ❌ /v1 already in base URL
api.get("/api/v1/users"); // ❌ /api/v1 already in base URL
api.get("http://.../"); // ❌ Use relative paths
```

### How to Check:

Look at your base URL:

```javascript
const API_BASE_URL = "http://127.0.0.1:8000/api/v1";
```

Everything after `.8000` is already included, so your endpoint should start from the next part:

```javascript
// Base includes: /api/v1
// So endpoint should be: /permissions/user-modules
api.get("/permissions/user-modules"); // ✅ Correct
```

## Files Changed

### Frontend:

1. ✅ `/skolaris-fe/src/services/permissionService.js` - Removed `/v1/` prefix (4 locations)

### Documentation:

1. ✅ `/skolaris-documentation/API_ROUTE_DUPLICATE_PREFIX_FIX.md` (this file)

## Related Files (No changes needed)

- ✅ `/skolaris-fe/src/services/api.js` - Base URL correctly configured
- ✅ `/skolaris-be/routes/api.php` - Routes correctly defined
- ✅ Other service files - No `/v1/` prefix found

## Summary

✅ **Fixed**: Duplicate `/v1/` prefix in API endpoint calls
✅ **Impact**: Permission-related API calls now work correctly
✅ **Prevention**: Clear guidelines for API endpoint paths
✅ **No More 404s**: Routes resolve to correct URLs

**Result**: Permission service now works without route errors! 🎉
