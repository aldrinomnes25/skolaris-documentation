# Conflict Tracking Explanation

## Two Types of Conflicts to Prevent

### 1. Within Same Section (Section-Level Conflict)

**Key:** `day + time` (no room_id)

**Why:** Students in the same section can't attend multiple subjects at the same time, regardless of room location.

**Example:**

```
Section: LFI1M001
Subjects in this section:
- Math (Room 101, Mon 8:00-9:00) ✅
- English (Room 102, Mon 8:00-9:00) ❌ CONFLICT! (Same day + time)
```

**Solution:** Use `day + time` as tracking key to prevent same-day overlaps within the section.

### 2. Across Different Sections (Room-Level Conflict)

**Key:** `room_id + day + time`

**Why:** A room can't host two different sections at the same time.

**Example:**

```
Section LFI1M001: Math (Room 101, Mon 8:00-9:00) ✅
Section LFI1M002: Physics (Room 101, Mon 8:00-9:00) ❌ CONFLICT! (Same room + day + time)
```

**Solution:** This is handled by the backend API when creating course offerings and room schedules.

## How It Works in Practice

### Scenario: Generating Subjects for One Section

When you click "Generate All Subjects", all subjects get the same section code (e.g., LFI1M001).

**Step 1: Same Section Conflict Prevention**

```javascript
// Key: day + time (room doesn't matter)
const scheduleKey = `${day}_${timeStart}_${timeEnd}`

// Prevents:
Monday_08:00_09:00 (Math) ✅
Monday_08:00_09:00 (English) ❌ REJECTED - Same day + time
Monday_09:00_10:00 (English) ✅ ALLOWED - Different time
```

**Step 2: Room Conflict Prevention**
When creating course offerings, the backend checks:

```php
// Check if room is already booked
RoomSchedule::where('room_id', $room_id)
    ->where('day', $day)
    ->where('start_time', $time_start)
    ->where('is_available', true)
```

If conflict detected → Reuse existing schedule or report error.

## Benefits of This Approach

✅ **No student conflicts** - Students in same section can't have overlapping classes  
✅ **No room double-booking** - Backend ensures rooms aren't double-booked  
✅ **Flexible room usage** - Same section can use different rooms at different times  
✅ **Reusable schedules** - Different sections can share room schedules  
✅ **Logical** - Matches real-world scheduling constraints

## Example: Complete Flow

**Generating 5 subjects for Section LFI1M001:**

```
1. Math     → Monday, 8:00-9:00, Room 101
   Key: "Monday_08:00_09:00" ✅ Added

2. English  → Monday, 8:00-9:00, Room 102
   Key: "Monday_08:00_09:00" ❌ CONFLICT! Try next slot
   → Monday, 9:00-10:00, Room 102 ✅
   Key: "Monday_09:00_10:00" ✅ Added

3. Science  → Monday, 10:00-11:00, Room 103
   Key: "Monday_10:00_11:00" ✅ Added

4. History  → Tuesday, 8:00-9:00, Room 101
   Key: "Tuesday_08:00_09:00" ✅ Added (different day)

5. PE       → Monday, 11:00-12:00, Room 104
   Key: "Monday_11:00_12:00" ✅ Added (different time)
```

**Result:**

- ✅ No same-day time overlaps within section
- ✅ Rooms can be different (flexible)
- ✅ Backend will prevent room conflicts with other sections

## Files Modified

- `src/hooks/useSubjects.js` - Tracks by day+time for same section

## Date

January 2025
