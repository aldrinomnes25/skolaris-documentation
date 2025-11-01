# No Same Day Time Overlaps Fix

## Issue

When generating all subjects for course offerings, multiple subjects could be assigned the same time slot on the same day, even if they were in different rooms.

**Example Problem:**

```
Subject 1: Monday, 8:00-9:00 AM (Room 101)
Subject 2: Monday, 8:00-9:00 AM (Room 102) ❌ Same time!
Subject 3: Monday, 8:00-9:00 AM (Room 103) ❌ Same time!
```

This creates conflicts because students can't attend multiple classes at the same time, even if they're in different rooms.

## Root Cause

The conflict tracking was using `room_id + day + time_start` as the unique key:

```javascript
// OLD - Tracks by room + day + time
const scheduleKey = `${candidate.room.room_id}_${candidate.day}_${slotStartTime}`;
```

This allowed multiple subjects to have the same time on the same day, as long as they were in different rooms.

## Solution

Changed the conflict tracking to use `day + time_start + time_end` only (without room_id):

```javascript
// NEW - Tracks by day + time only (not room)
const scheduleKey = `${candidate.day}_${slotStartTime}_${slotEndTime}`;
```

Now, no two subjects can have overlapping times on the same day, **regardless of which room they're in**.

## How It Works Now

### Before (With Overlaps)

```javascript
// Key format: room_id_day_time
"101_Monday_08:00"; // Subject 1 in Room 101
"102_Monday_08:00"; // Subject 2 in Room 102 ✅ DIFFERENT KEY (no conflict detected)
"103_Monday_08:00"; // Subject 3 in Room 103 ✅ DIFFERENT KEY (no conflict detected)
```

**Result:** ❌ All subjects at same time on Monday!

### After (No Overlaps)

```javascript
// Key format: day_startTime_endTime
"Monday_08:00_09:00"; // Subject 1 (any room)
"Monday_08:00_09:00"; // ❌ CONFLICT! (same day + time, rejected)
"Monday_09:00_10:00"; // ✅ Different time, no conflict
```

**Result:** ✅ Subjects spread across different times

## Example Scenarios

### Scenario 1: No Overlaps (Ideal)

**Generating 5 subjects:**

```
Subject 1: Monday, 8:00-9:00 AM (Room 101)
Subject 2: Monday, 9:00-10:00 AM (Room 102)  ✅ Different time
Subject 3: Monday, 10:00-11:00 AM (Room 103) ✅ Different time
Subject 4: Tuesday, 8:00-9:00 AM (Room 101)  ✅ Different day
Subject 5: Tuesday, 9:00-10:00 AM (Room 102) ✅ Different day + time
```

**Keys used:**

- `Monday_08:00_09:00`
- `Monday_09:00_10:00`
- `Monday_10:00_11:00`
- `Tuesday_08:00_09:00`
- `Tuesday_09:00_10:00`

### Scenario 2: More Subjects Than Available Slots

**Generating 10 subjects but only 5 time slots:**

First 5 get different times:

```
Subject 1: Monday, 8:00-9:00
Subject 2: Monday, 9:00-10:00
Subject 3: Monday, 10:00-11:00
Subject 4: Tuesday, 8:00-9:00
Subject 5: Tuesday, 9:00-10:00
```

Next 5 subjects:

- Try to get slots not yet used
- May get same time on a different day
- Or will use fallback (same slot anyway)

### Scenario 3: Reuse Across Different Days

**Generating subjects:**

```
Subject 1: Monday, 8:00-9:00 (Room 101)
Subject 2: Tuesday, 8:00-9:00 (Room 101) ✅ Same time, different day (OK!)
Subject 3: Wednesday, 8:00-9:00 (Room 102) ✅ Same time, different day (OK!)
```

**Keys used:**

- `Monday_08:00_09:00`
- `Tuesday_08:00_09:00` (Different day, no conflict)
- `Wednesday_08:00_09:00` (Different day, no conflict)

## Benefits

✅ **No overlapping times on same day** - Students can't be in two places at once  
✅ **Better distribution** - Subjects are spread across different times  
✅ **Logical scheduling** - Prevents impossible timetables  
✅ **Student-friendly** - No class conflicts  
✅ **Flexible across days** - Same time on different days is allowed

## Why This Makes Sense

1. **Student scheduling**

   - A student can't attend two classes at the same time
   - Even if classes are in different rooms, students need time to move
   - Multiple subjects at same time = impossible schedule

2. **Day separation**

   - Same time on Monday and Tuesday is OK (different days)
   - A student can attend 8:00 AM class on Monday and Tuesday
   - Only conflicts if same DAY + same TIME

3. **Room flexibility**
   - Different rooms can have classes at different times
   - Same room can be used multiple times in different time slots
   - Room assignment is separate from time conflict

## Technical Details

### Key Format

**Old:**

```
{room_id}_{day}_{time_start}
Example: "101_Monday_08:00"
```

**New:**

```
{day}_{time_start}_{time_end}
Example: "Monday_08:00_09:00"
```

### Conflict Detection Logic

```javascript
// For each subject:
1. Get available time slots
2. Check if day+time combination is already used
3. If used → Try next slot
4. If not used → Assign it and mark as used
5. Move to next subject
```

### Comparison Logic

```javascript
function hasConflict(newDay, newStart, newEnd, usedSchedules) {
  const key = `${newDay}_${newStart}_${newEnd}`;
  return usedSchedules.has(key);
}
```

## Edge Cases Handled

1. **Same time, different rooms** → ✅ Detected as conflict
2. **Same time, different days** → ✅ Allowed (no conflict)
3. **Overlapping times (8:00-9:00 and 8:30-9:30)** → ✅ Detected as different keys
4. **More subjects than available slots** → ✅ Uses fallback (may have conflicts)
5. **No available slots** → ✅ Falls back to random room/day assignment

## Files Modified

- `src/hooks/useSubjects.js` (lines ~103-150)

## Date

January 2025
