# Room Schedule Conflict Detection Fix

## Issue

When creating or updating room schedules via the API endpoint `http://localhost:8000/api/v1/rooms/9/schedules`, the system was reporting false conflicts even when the schedule shouldn't conflict.

**Example Error:**

```json
{
  "success": false,
  "message": "Time conflicts with existing schedule(s)",
  "conflicts": [...]
}
```

## Root Cause

The conflict detection logic in `RoomController.php` was checking **ALL schedules** (both available and unavailable) when detecting conflicts. This caused false positives because:

1. **Old/inactive schedules** marked as `is_available = false` were being checked
2. These unavailable schedules would trigger conflict errors
3. Users couldn't create new schedules even when the old one was unavailable

### The Problematic Code

```php
// OLD - Checks ALL schedules including unavailable ones
$conflicts = RoomSchedule::where('room_id', $room->room_id)
    ->where('day', $request->day)
    // ❌ Missing: where('is_available', true)
    ->where(function($query) use ($request) {
        // ... conflict detection logic
    })
    ->get();
```

## Solution

Added `->where('is_available', true)` to the conflict detection query to **only check against available schedules**.

### Code Changes

**In `createSchedule()` method:**

```php
// NEW - Only checks AVAILABLE schedules
$conflicts = RoomSchedule::where('room_id', $room->room_id)
    ->where('day', $request->day)
    ->where('is_available', true)  // ✅ Only check conflicts with available schedules
    ->where(function($query) use ($request) {
        // ... conflict detection logic
    })
    ->get();
```

**In `updateSchedule()` method:**

```php
$conflicts = RoomSchedule::where('room_id', $schedule->room_id)
    ->where('day', $schedule->day)
    ->where('is_available', true)  // ✅ Only check conflicts with available schedules
    ->where('schedule_id', '!=', $schedule->schedule_id)
    ->where(function($query) use ($startTime, $endTime) {
        // ... conflict detection logic
    })
    ->get();
```

## How It Works Now

### Conflict Detection Logic

The system only considers a schedule as a conflict if it:

1. ✅ Has the same `room_id`
2. ✅ Has the same `day`
3. ✅ **Is marked as available** (`is_available = true`)
4. ✅ Has an overlapping time range

### Example Scenarios

**Scenario 1: Old Unavailable Schedule**

```
Existing: Room 9, Monday, 8:00-9:00, is_available = false
New:      Room 9, Monday, 8:00-9:00, is_available = true

Result: ✅ NO CONFLICT (ignores unavailable schedule)
```

**Scenario 2: Available Schedule Conflicts**

```
Existing: Room 9, Monday, 8:00-9:00, is_available = true
New:      Room 9, Monday, 8:00-9:00, is_available = true

Result: ❌ CONFLICT (both are available and same time)
```

**Scenario 3: Different Days**

```
Existing: Room 9, Monday, 8:00-9:00, is_available = true
New:      Room 9, Tuesday, 8:00-9:00, is_available = true

Result: ✅ NO CONFLICT (different days)
```

**Scenario 4: Non-Overlapping Times**

```
Existing: Room 9, Monday, 8:00-9:00, is_available = true
New:      Room 9, Monday, 10:00-11:00, is_available = true

Result: ✅ NO CONFLICT (no time overlap)
```

## Why This Makes Sense

1. **Unavailable schedules = old/inactive**

   - When `is_available = false`, the schedule is not in use
   - Shouldn't block new schedules

2. **Reuse of room schedules**

   - Different terms can reuse the same time slot
   - Old schedules should not block new ones

3. **Database cleanup**
   - You may have old schedules from previous terms
   - They shouldn't prevent creating new schedules

## Benefits

✅ **No false conflicts** - Only available schedules are checked  
✅ **Reusability** - Old schedules don't block new ones  
✅ **Logical** - Only active/available schedules conflict  
✅ **Efficient** - Less data to check means faster queries

## Testing

Test cases:

- ✅ Create schedule when old unavailable schedule exists → Should succeed
- ✅ Create schedule when old available schedule exists (same time) → Should fail with conflict
- ✅ Create schedule when old available schedule exists (different time) → Should succeed
- ✅ Update schedule excludes itself from conflict check
- ✅ Update schedule only checks against available schedules

## API Endpoint

**Endpoint:** `POST /api/v1/rooms/{roomId}/schedules`

**Request:**

```json
{
  "day": "Monday",
  "period": "M",
  "start_time": "08:00:00",
  "end_time": "09:00:00",
  "is_available": true
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "Schedule created successfully",
  "data": {...}
}
```

**Conflict Response (only if truly conflicting):**

```json
{
  "success": false,
  "message": "Time conflicts with existing schedule(s)",
  "conflicts": [...]
}
```

## Files Modified

- `app/Http/Controllers/Api/RoomController.php`
  - `createSchedule()` method (line ~464)
  - `updateSchedule()` method (line ~554)

## Date

January 2025
