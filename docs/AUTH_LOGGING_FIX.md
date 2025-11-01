# Auth Logging Fix Summary

## 🐛 Issue

**Error:** `SQLSTATE[23000]: Integrity constraint violation: 19 CHECK constraint failed: event_type`

**Cause:** The `auth_logs` table migration defined lowercase event types (e.g., `'login'`, `'logout'`), but the AuthController was using capitalized or mixed-case event types (e.g., `'Login'`, `'Token_Refresh'`, `'Web Logout'`).

---

## ✅ Solution

### 1. **Updated Migration**

File: `database/migrations/2025_10_09_053053_create_auth_logs_table.php`

**Added missing event types:**

- `'revoke_all_sessions'`
- `'revoke_session'`

**Complete event type list:**

```php
$table->enum('event_type', [
    'login',
    'logout',
    'token_refresh',
    'password_change',
    'account_lock',
    'failure',
    'mfa_challenge',
    'mfa_verified',
    'account_creation',
    'password_reset_request',
    'revoke_all_sessions',  // NEW
    'revoke_session'        // NEW
])->comment('Type of authentication-related action');
```

### 2. **Updated API AuthController**

File: `app/Http/Controllers/Api/AuthController.php`

**Changed event types to lowercase:**

- `'Login'` → `'login'`
- `'Logout'` → `'logout'`
- `'Token_Refresh'` → `'token_refresh'`
- `'Revoke_All_Sessions'` → `'revoke_all_sessions'`
- `'Revoke_Session'` → `'revoke_session'`

**Example:**

```php
// Before
$this->logAuthEvent($request, 'Login', true, $user->email, 'Login successful');

// After
$this->logAuthEvent($request, 'login', true, $user->email, 'Login successful');
```

### 3. **Updated Web AuthController**

File: `app/Http/Controllers/Web/AuthController.php`

**Changed event types to standard lowercase:**

- `'Web Login'` → `'login'` (with `'source' => 'web'` in details)
- `'Web Logout'` → `'logout'` (with `'source' => 'web'` in details)
- `'Web Token Refresh'` → `'token_refresh'` (with `'source' => 'web'` in details)
- `'Web Revoke All Sessions'` → `'revoke_all_sessions'` (with `'source' => 'web'` in details)
- `'Web Revoke Session'` → `'revoke_session'` (with `'source' => 'web'` in details)

**Example:**

```php
// Before
$this->logAuthEvent($request, 'Web Login', true, $user->email, 'Web login successful');

// After
$this->logAuthEvent(
    $request,
    'login',
    true,
    $user->email,
    'Web login successful',
    $tokens['refresh_token'],
    ['user_id' => $user->user_id, 'session_type' => 'web', 'source' => 'web']
);
```

**Note:** The `source` field in the details JSON helps distinguish between API and Web logins.

### 4. **Fixed Database Seeder SQLite Compatibility**

File: `database/seeders/DatabaseSeeder.php`

**Changed from MySQL-specific syntax to database-agnostic:**

```php
// Before
\DB::statement('SET FOREIGN_KEY_CHECKS=0;');

// After
$driver = \DB::getDriverName();
if ($driver === 'mysql') {
    \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
} elseif ($driver === 'sqlite') {
    \DB::statement('PRAGMA foreign_keys = OFF;');
}
```

---

## 📊 Event Type Standardization

### Standard Event Types (Lowercase Snake Case)

| Event Type               | Description               | Used In        |
| ------------------------ | ------------------------- | -------------- |
| `login`                  | User login attempt        | API & Web Auth |
| `logout`                 | User logout               | API & Web Auth |
| `token_refresh`          | JWT token refresh         | API & Web Auth |
| `password_change`        | User password change      | Future use     |
| `account_lock`           | Account locked            | Future use     |
| `failure`                | Generic auth failure      | Future use     |
| `mfa_challenge`          | MFA challenge sent        | Future use     |
| `mfa_verified`           | MFA successfully verified | Future use     |
| `account_creation`       | New account created       | Future use     |
| `password_reset_request` | Password reset requested  | Future use     |
| `revoke_all_sessions`    | All sessions revoked      | API & Web Auth |
| `revoke_session`         | Single session revoked    | API & Web Auth |

### Distinguishing API vs Web Logins

Use the `details` JSON field:

```php
// API Login
['user_id' => 1]

// Web Login
['user_id' => 1, 'session_type' => 'web', 'source' => 'web']
```

---

## 🧪 Testing

### Test Login After Fix

**1. API Login:**

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@icct.edu.ph",
    "password": "Password123!"
  }'
```

**Expected:** Login succeeds and auth log is created with `event_type = 'login'`

**2. Web Login:**

```bash
curl -X POST http://localhost:8000/web/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@icct.edu.ph",
    "password": "Password123!"
  }'
```

**Expected:** Login succeeds and auth log is created with `event_type = 'login'` and `source = 'web'` in details

### Verify Auth Logs

```sql
SELECT * FROM auth_logs ORDER BY created_at DESC LIMIT 10;
```

**Expected columns:**

- `user_identifier`: Email address
- `event_type`: Lowercase value (e.g., `'login'`, `'logout'`)
- `is_success`: 1 or 0
- `result_reason`: Reason for result
- `details`: JSON with additional context

---

## 📝 Fixed Files Summary

### Migrations:

1. ✅ `database/migrations/2025_10_09_053053_create_auth_logs_table.php`
   - Added `revoke_all_sessions` and `revoke_session` event types

### Controllers:

2. ✅ `app/Http/Controllers/Api/AuthController.php`

   - Changed all event types to lowercase snake_case

3. ✅ `app/Http/Controllers/Web/AuthController.php`
   - Changed all event types to lowercase snake_case
   - Added `'source' => 'web'` to details

### Seeders:

4. ✅ `database/seeders/DatabaseSeeder.php`
   - Fixed SQLite foreign key syntax

### Additional Fixes:

5. ✅ `database/migrations/2025_10_19_100000_enhance_employees_table_add_personal_details.php`
   - Fixed SQLite column drop issue for `status` column with index

---

## 🚀 Deployment Steps

1. **Pull latest code:**

   ```bash
   cd /Users/aldrincruzomnes/SKOLARIS/skolaris-be
   git pull origin main
   ```

2. **Run migrations:**

   ```bash
   php artisan migrate:fresh --seed
   ```

3. **Clear cache (if needed):**

   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan route:clear
   ```

4. **Test authentication:**
   - Try logging in via API
   - Try logging in via Web
   - Check auth_logs table for correct event types

---

## 🔍 Database Schema

### `auth_logs` Table Structure

```sql
CREATE TABLE auth_logs (
    auth_logs_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_identifier VARCHAR(100) NOT NULL,
    event_type VARCHAR(30) NOT NULL CHECK(event_type IN (
        'login', 'logout', 'token_refresh', 'password_change',
        'account_lock', 'failure', 'mfa_challenge', 'mfa_verified',
        'account_creation', 'password_reset_request',
        'revoke_all_sessions', 'revoke_session'
    )),
    is_success BOOLEAN DEFAULT 1,
    result_reason VARCHAR(100),
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(512),
    session_token_hash CHAR(64),
    details TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## ✅ Verification Checklist

- [x] Migration updated with new event types
- [x] API AuthController uses lowercase event types
- [x] Web AuthController uses lowercase event types
- [x] SQLite compatibility fixed in seeders
- [x] SQLite compatibility fixed in employee migration
- [x] Database migrations run successfully
- [x] All seeders run without errors
- [x] Auth logging now works correctly

---

## 📌 Best Practices

1. **Always use lowercase snake_case for enum values** in database migrations
2. **Keep event types consistent** across all controllers
3. **Use the `details` JSON field** to store additional context
4. **Test with SQLite during development** to catch compatibility issues early
5. **Document event types** and their usage

---

**Status:** ✅ Fixed and Deployed  
**Date:** October 22, 2025  
**Impact:** All authentication logging now works correctly without constraint violations
