# Room Schedule Implementation

## Summary

Added room schedule management with time period tagging (Morning, Afternoon, Noon, Evening) for all rooms across all campuses.

## Database Changes

### 1. New Migration: `room_schedules` table

**File:** `database/migrations/2025_10_26_085610_create_room_schedules_table.php`

**Fields:**

- `schedule_id` - Primary key
- `room_id` - Foreign key to rooms table
- `day` - Day of week (Monday-Sunday)
- `period` - Time period (M/A/N/E)
  - M - Morning (07:00-11:00)
  - A - Afternoon (11:00-15:00)
  - N - Noon (11:00-12:00)
  - E - Evening (15:00-19:00)
- `start_time` - Time field
- `end_time` - Time field
- `is_available` - Boolean

**Constraints:**

- Unique constraint on (`room_id`, `day`, `period`)
- Indexes on `room_id`, `day`, `period`

### 2. Models

**RoomSchedule Model** (`app/Models/RoomSchedule.php`):

- Has relationship to Room
- Accessor methods:
  - `period_name` - Returns full period name
  - `time_range` - Returns formatted time range

**Room Model** (`app/Models/Room.php`):

- Added `schedules()` relationship to RoomSchedule

### 3. Seeder: `RoomScheduleSeeder`

**What it does:**

- Creates schedules for ALL existing rooms
- Assigns 4 periods per day (M, A, N, E)
- Assigns schedules for 5 days (Mon-Fri)
- Total: 20 schedules per room (5 days × 4 periods)

**Time Periods:**

- **M (Morning)**: 07:00 - 11:00
- **A (Afternoon)**: 11:00 - 15:00
- **N (Noon)**: 11:00 - 12:00
- **E (Evening)**: 15:00 - 19:00

## Current Status

✅ **Backend Complete:**

- Migration created and run
- RoomSchedule model created
- RoomScheduleSeeder created and run
- 9,600 schedules created for 480 rooms
- All rooms now have schedules across all campuses

⏳ **Frontend Pending:**

- Need to update CourseOfferingFormAdmin to use room schedules
- Need to filter rooms by schedule availability
- Need to show period tags when selecting rooms

## Statistics

- **Total Rooms**: 480 across all campuses
- **Total Schedules**: 9,600
- **Schedules per Room**: 20 (5 days × 4 periods)
- **Days**: Monday-Friday
- **Periods**: M, A, N, E

## Usage Example

When creating a course offering:

1. Select campus
2. Select day (Monday-Friday)
3. Select time period (Morning/Afternoon/Noon/Evening)
4. Room dropdown shows only rooms available for that period
5. Each room shows its time slot

## Future Frontend Implementation

In `CourseOfferingFormAdmin.jsx`:

1. Load rooms with schedules
2. Filter rooms based on selected day and period
3. Show room availability status
4. Display time slots when room is selected

## API Endpoints Needed

```php
// Get rooms with schedules
GET /api/rooms?campus_id=1&day=Monday&period=M

// Get room schedules
GET /api/rooms/{id}/schedules

// Get available rooms for time slot
GET /api/rooms/available?campus_id=1&day=Monday&start_time=09:00&end_time=10:00
```
