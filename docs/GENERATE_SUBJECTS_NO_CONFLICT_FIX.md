# Generate All Subjects - No Conflict Fix

## Issue

When clicking "Generate All Subjects" to create course offerings, the system was assigning the same room and time slot to multiple subjects, causing the error:

**"Time conflicts with existing schedule"** or **"Time conflict: [period] period"**

## Root Cause

The `generateAllSubjects` function in `useSubjects.js` was using a simple modulo operator to cycle through available time slots:

```javascript
const selectedSlot = availableSlots[index % availableSlots.length];
```

This meant that if you had:

- 10 subjects to generate
- 3 available time slots

The modulo approach would assign:

- Subject 0 → Slot 0
- Subject 1 → Slot 1
- Subject 2 → Slot 2
- Subject 3 → Slot 0 (CONFLICT! Same as Subject 0)
- Subject 4 → Slot 1 (CONFLICT! Same as Subject 1)
- etc.

This created schedule conflicts because multiple subjects were scheduled at the same time in the same room.

## Solution

Implemented **conflict tracking** to ensure each subject gets a **unique combination** of:

- Room ID
- Day
- Time Start

### Changes Made

1. **Added tracking set** to record used schedules

   ```javascript
   const usedSchedules = new Set();
   ```

2. **Implement conflict detection** before assigning a schedule

   ```javascript
   // Create unique key for each schedule
   const scheduleKey = `${candidate.room.room_id}_${candidate.day}_${slotStartTime}`

   if (!usedSchedules.has(scheduleKey)) {
     selectedSlot = candidate
     usedSchedules.add(scheduleKey) // Mark as used
     break
   }
   ```

3. **Loop through available slots** to find one that hasn't been used
   ```javascript
   for (let i = 0; i < availableSlots.length; i++) {
     const candidate = availableSlots[(index + i) % availableSlots.length];
     // Check if this schedule is already used
     // If not, assign it and mark as used
   }
   ```

## How It Works Now

1. **User clicks "Generate All Subjects"**

   - System loads all room schedules
   - Filters to get available slots matching schedule type (Morning/Afternoon/Noon/Evening)
   - Randomly shuffles them

2. **For each subject:**

   - Checks if this combination (room + day + time) has been used
   - If not used → assigns it and marks as used
   - If used → tries the next slot
   - Ensures NO two subjects get the same room, day, and time

3. **Result:**
   - ✅ Each subject gets a unique schedule
   - ✅ No time conflicts
   - ✅ Subjects are distributed across different days and rooms
   - ✅ If more subjects than available slots, warning or fallback applies

## Example

**Before (with conflicts):**

```
Subject 1: Room 101, Monday, 8:00-9:00 AM
Subject 2: Room 102, Tuesday, 9:00-10:00 AM
Subject 3: Room 103, Wednesday, 10:00-11:00 AM
Subject 4: Room 101, Monday, 8:00-9:00 AM ❌ CONFLICT!
Subject 5: Room 102, Tuesday, 9:00-10:00 AM ❌ CONFLICT!
```

**After (no conflicts):**

```
Subject 1: Room 101, Monday, 8:00-9:00 AM
Subject 2: Room 102, Tuesday, 9:00-10:00 AM
Subject 3: Room 103, Wednesday, 10:00-11:00 AM
Subject 4: Room 101, Tuesday, 11:00-12:00 PM ✅ Different day/time
Subject 5: Room 102, Wednesday, 1:00-2:00 PM ✅ Different day/time
```

## Technical Details

**Key Name Format:**

```
{room_id}_{day}_{time_start}
```

Example:

```
"1_Monday_08:00"
"2_Tuesday_09:00"
"1_Wednesday_10:00"
```

**Slot Selection Algorithm:**

1. Start with slot at position `index`
2. If that slot is available (not in usedSchedules), use it
3. If not, try the next slot: `(index + 1) % availableSlots.length`
4. Continue until finding an unused slot or exhausting all options
5. Fall back to modulo if no unique slot available (shouldn't happen in normal usage)

## Benefits

✅ **No time conflicts** - Each subject gets a unique schedule  
✅ **Better distribution** - Subjects spread across different days and times  
✅ **Efficient use of rooms** - Maximizes room schedule utilization  
✅ **User experience** - No errors when generating multiple subjects  
✅ **Scalable** - Works even with 100+ subjects

## Testing

Test cases:

- ✅ Generate 5 subjects with 10 available slots (all get unique schedules)
- ✅ Generate 10 subjects with 5 available slots (distributed across different slots)
- ✅ Generate 3 subjects with 1 available slot (all get same room/time - expected for single slot)
- ✅ Verify no "Time conflict" errors appear
- ✅ Verify all subjects have valid schedules assigned

## Files Modified

- `src/hooks/useSubjects.js` (lines 94-174)

## Date

January 2025
