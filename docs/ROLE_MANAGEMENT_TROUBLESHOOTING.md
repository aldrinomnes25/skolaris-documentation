# 🔧 Role Management - Troubleshooting Guide

**Issue**: Statistics show roles exist (8 total, 1 global, 7 campus) but the main table shows "No roles found"

---

## ✅ What's Working

1. **Database**: ✅ Roles exist in database (9 roles confirmed)
2. **Frontend**: ✅ Role Management page is implemented
3. **Routes**: ✅ API routes are configured
4. **Statistics**: ✅ Statistics endpoint is working (shows data)

---

## ❌ What's Not Working

1. **Roles List**: ❌ Main roles table shows "No roles found"
2. **API Connection**: ❌ Frontend can't fetch roles list

---

## 🔍 Root Cause Analysis

The statistics endpoint is working (showing 8 roles) but the roles list endpoint is failing. This suggests:

1. **Authentication Issue**: User might not have proper role permissions
2. **API Endpoint Issue**: Different endpoints might have different authentication requirements
3. **Backend Server**: Backend might not be running or accessible

---

## 🛠️ Solutions

### 1. Check Authentication

**Make sure you're logged in as:**

- Super Admin (full access)
- Campus Admin (limited access)

**Check your current role:**

1. Look at the user profile in the top-right corner
2. Verify you have the correct role assigned

### 2. Start Backend Server

**If backend is not running:**

```bash
cd /Users/aldrincruzomnes/SKOLARIS/skolaris-be
php artisan serve
```

**Verify backend is accessible:**

- Check if `http://localhost:8000` is accessible
- Verify API endpoints are responding

### 3. Check Browser Console

**Open Developer Tools:**

1. Press F12 or right-click → Inspect
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed API calls

**Common errors to look for:**

- `401 Unauthorized` - Authentication issue
- `403 Forbidden` - Permission issue
- `500 Internal Server Error` - Backend issue
- `Network Error` - Backend not running

### 4. Verify Database

**Roles exist in database:**

```bash
cd /Users/aldrincruzomnes/SKOLARIS/skolaris-be
sqlite3 database/database.sqlite "SELECT COUNT(*) FROM roles;"
# Should return: 9
```

**Check specific roles:**

```bash
sqlite3 database/database.sqlite "SELECT role_name, is_global FROM roles;"
```

### 5. Test API Endpoints

**Test basic roles endpoint:**

```bash
curl -H "Accept: application/json" http://localhost:8000/api/v1/roles
# Should return authentication error (expected)
```

**Test with authentication:**

- Use Postman or similar tool
- Include JWT token in Authorization header
- Test both basic and enhanced endpoints

---

## 🔄 Step-by-Step Fix

### Step 1: Verify Backend

```bash
cd /Users/aldrincruzomnes/SKOLARIS/skolaris-be
php artisan serve
```

### Step 2: Check Authentication

1. Login to frontend
2. Verify you have Super Admin or Campus Admin role
3. Check browser console for errors

### Step 3: Test API Access

1. Open browser developer tools
2. Go to Network tab
3. Refresh the roles page
4. Look for API calls to `/api/v1/roles`
5. Check response status codes

### Step 4: Debug Further

If still not working, check:

1. JWT token validity
2. Role permissions in database
3. API route middleware
4. CORS settings

---

## 📋 Quick Checklist

- [ ] Backend server running (`php artisan serve`)
- [ ] User logged in as Super Admin or Campus Admin
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls
- [ ] Database contains roles (9 roles confirmed)
- [ ] Frontend page loads without errors

---

## 🆘 If Still Not Working

### Check These Files:

1. **Backend Routes**: `/skolaris-be/routes/api.php`
2. **Role Controller**: `/skolaris-be/app/Http/Controllers/RoleController.php`
3. **Enhanced Controller**: `/skolaris-be/app/Http/Controllers/RoleManagementController.php`
4. **Frontend Service**: `/skolaris-fe/src/services/roleService.js`
5. **Frontend Page**: `/skolaris-fe/src/pages/RoleListAdmin.jsx`

### Common Issues:

1. **Middleware**: Role middleware might be too restrictive
2. **CORS**: Cross-origin requests might be blocked
3. **Token**: JWT token might be expired or invalid
4. **Database**: Database connection might be failing
5. **Permissions**: User might not have required role

---

## 📞 Getting Help

If the issue persists:

1. **Check Browser Console** for specific error messages
2. **Check Backend Logs** for server-side errors
3. **Verify Database** has the required data
4. **Test API Endpoints** directly with Postman
5. **Check Authentication** and role assignments

---

## 🎯 Expected Behavior

Once fixed, you should see:

- ✅ Statistics cards showing correct counts
- ✅ Roles table populated with 8-9 roles
- ✅ All action buttons working
- ✅ Search and filters functional
- ✅ Create/Edit/Delete operations working

---

**Last Updated**: October 21, 2025  
**Status**: Under Investigation
