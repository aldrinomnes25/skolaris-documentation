# Section Code Increment Fix

## Issue

When clicking "Generate All Subjects", all subjects were getting the same section code "LFI1M001" even if that section already existed in the database. The section code should increment to the next available number.

**Example Problem:**

- Existing section: `LFI1M001`
- New generation creates: `LFI1M001` ❌ (DUPLICATE!)
- Should create: `LFI1M002` ✅

## Root Cause

The section code generator was hardcoding the sequential number to `1` for all subjects:

```javascript
// OLD - Always uses 1
const sectionCodeGenerator = (index) => {
  return SectionCodeService.generateSectionCode(
    config.modality,
    campus.campus_name,
    config.year_level,
    config.schedule_type,
    1 // ❌ Hardcoded to 1
  );
};
```

This meant every time you generated subjects, they would all get section code ending in `001`, regardless of existing sections.

## Solution

Implemented logic to:

1. **Query existing course offerings** with the same configuration
2. **Extract all section codes** from existing offerings
3. **Find the highest sequential number** (last 3 digits)
4. **Increment by 1** for the next generation

### Code Changes

**Added query for existing offerings:**

```javascript
// Before generating, fetch existing course offerings
const existingOfferingsResponse =
  await courseOfferingService.getCourseOfferings({
    campus_id: config.campus_id,
    program_id: config.program_id,
    term_id: config.term_id,
    year_level: config.year_level,
    semester: config.semester,
    modality: config.modality,
    schedule_type: config.schedule_type,
    per_page: 10000,
  });
```

**Extract section numbers and find the next:**

```javascript
let nextSectionNumber = 1;

if (existingOfferingsResponse.success && existingOfferingsResponse.data) {
  const offerings =
    existingOfferingsResponse.data.data || existingOfferingsResponse.data;
  const offeringsList = Array.isArray(offerings) ? offerings : [];

  // Extract section codes and find the highest sequential number
  const sectionCodes = offeringsList
    .map((o) => o.section)
    .filter((section) => section && typeof section === "string");

  if (sectionCodes.length > 0) {
    // Parse the sequential number from section codes (last 3 digits)
    const numbers = sectionCodes
      .map((code) => {
        const lastThree = code.slice(-3);
        const num = parseInt(lastThree);
        return isNaN(num) ? 0 : num;
      })
      .filter((num) => num > 0);

    if (numbers.length > 0) {
      nextSectionNumber = Math.max(...numbers) + 1;
    }
  }
}
```

**Use the calculated number:**

```javascript
const sectionCodeGenerator = (index) => {
  if (campus && config.modality && config.year_level && config.schedule_type) {
    // All subjects in this generation get the same section code
    // But use the next available section number
    return SectionCodeService.generateSectionCode(
      config.modality,
      campus.campus_name,
      config.year_level,
      config.schedule_type,
      nextSectionNumber // ✅ Uses calculated next number
    );
  }
  return "";
};
```

## How It Works

### Section Code Format

```
LFI1M001
│││ │ │  │
│││ │ │  └─ Sequential number (3 digits)
│││ │ └──── Schedule type (M=Morning, A=Afternoon, N=Noon, E=Evening)
│││ └────── Year level (1=Year 1, 2=Year 2, etc.)
││└──────── Campus code (I=Iloilo, M=Main, etc.)
│└───────── Modality (LF=Limited Face-to-Face, TC=Traditional, etc.)
└────────── Modality prefix
```

### Example Flow

**Scenario 1: First Generation**

- No existing offerings
- `nextSectionNumber = 1`
- Generates: `LFI1M001`

**Scenario 2: Second Generation**

- Existing: `LFI1M001`
- Parses numbers: `[1]`
- `nextSectionNumber = 1 + 1 = 2`
- Generates: `LFI1M002`

**Scenario 3: Multiple Existing Sections**

- Existing: `LFI1M001`, `LFI1M002`, `LFI1M005`
- Parses numbers: `[1, 2, 5]`
- Max: `5`
- `nextSectionNumber = 5 + 1 = 6`
- Generates: `LFI1M006`

## Important Notes

1. **All subjects in one generation get the SAME section code**

   - If you generate 10 subjects, they all get `LFI1M001`
   - This is intentional - they're all in the same section

2. **Next generation increments the section number**

   - First batch: `LFI1M001`
   - Second batch: `LFI1M002`
   - Third batch: `LFI1M003`

3. **The query only matches offerings with the SAME:**
   - Campus
   - Program
   - Term
   - Year Level
   - Semester
   - Modality
   - Schedule Type

## Example Usage

**First Generation:**

```
Campus: Iloilo, Program: BSIT, Year: 1, Schedule: Morning
Generate → All subjects get: LFI1M001
```

**Second Generation (same config):**

```
Campus: Iloilo, Program: BSIT, Year: 1, Schedule: Morning
Generate → All subjects get: LFI1M002 (incremented!)
```

**Different Config:**

```
Campus: Main, Program: BSCS, Year: 2, Schedule: Afternoon
Generate → All subjects get: TCZ2A001 (different prefix, starts at 001)
```

## Benefits

✅ **No duplicate section codes** - Automatically increments from existing sections  
✅ **Predictable numbering** - Always starts from highest existing + 1  
✅ **Config-aware** - Only considers offerings with matching configuration  
✅ **Scalable** - Works even with hundreds of existing sections  
✅ **User-friendly** - No manual tracking needed

## Testing

Test cases:

- ✅ Generate subjects when no existing sections exist → Creates `LFI1M001`
- ✅ Generate subjects when `LFI1M001` exists → Creates `LFI1M002`
- ✅ Generate subjects when `LFI1M001`, `LFI1M002`, `LFI1M005` exist → Creates `LFI1M006` (highest + 1)
- ✅ Generate with different campus/term/program → Starts at `001` (different configuration)
- ✅ All subjects in one generation have the SAME section code
- ✅ Next generation has incremented section code

## Files Modified

- `src/pages/CourseOfferingFormAdmin.jsx` (lines 1210-1341)

## Date

January 2025
