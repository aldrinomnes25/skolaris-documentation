# Curriculum Filter Purpose - Clear Explanation

## ❓ User's Question (Tagalog)

> "para saan pa ung Curriculum Version"

**Translation:** "What's the purpose of the Curriculum Version then?"

---

## ✅ Answer: Para Makita Kung Ano ang Curriculum ng Specific Year!

### Simpleng Paliwanag:

**Ang filter ay para sa tanong:**

> "Kung mag-enroll ako ngayong 2025, anong curriculum ang susundan ko?"

o

> "Kung nag-enroll si Maria noong 2023, anong subjects ang kinuha niya?"

---

## 🎯 Purpose ng Filter

### Hindi siya "Version Number" - siya ay "Year Viewer"!

**Mas clear label:**

```
BEFORE: "Curriculum Version: 2025-2026"
AFTER:  "View Curriculum For Year: Students Enrolling 2025-2026"
```

### Ano ang Nangyayari:

**Pag nag-select ka ng "2025-2026":**

```
System:
1. Check all subjects sa database
2. Tingnan kung effective ba sa year 2025
3. Show ONLY subjects na effective sa 2025
4. Hide subjects na:
   - Nag-end na before 2025 (old subjects)
   - Mag-start pa lang after 2025 (future subjects)
```

**Result:** Makikita mo EXACTLY kung anong curriculum ang gagamitin ng 2025 students!

---

## 📊 Visual Example

### Database Contents:

```
CS100: Start=2020, End=2022  (ENDED na)
CS101: Start=2023, End=Ongoing  (CURRENT pa)
CS105: Start=2026, End=Ongoing  (FUTURE pa)
```

### Pag Nag-Filter:

#### Filter: "2023-2024"

```
Shows:
✅ CS101 (kasi start=2023, ongoing pa)

Hides:
❌ CS100 (kasi ended na sa 2022)
❌ CS105 (kasi mag-start pa lang sa 2026)

Meaning: 2023 students use CS101
```

#### Filter: "2025-2026"

```
Shows:
✅ CS101 (kasi start=2023, ongoing pa)

Hides:
❌ CS100 (ended na)
❌ CS105 (future pa)

Meaning: 2025 students STILL use CS101 (same as 2023!)
```

#### Filter: "2026-2027"

```
Shows:
✅ CS105 (kasi mag-start na sa 2026)

Hides:
❌ CS100 (ended long ago)
❌ CS101 ??? ← Depends!
      If CS101 is still "ongoing" → SHOW
      If CS101 ended in 2025 → HIDE

Meaning: 2026 students use CS105 (new subject!)
```

---

## 🎯 Practical Use Cases

### Use Case 1: Student Inquiry

**Scenario:**
Student: "I'm planning to enroll in 2026, anong subjects ang kukunin ko?"

**Action:**

1. Go to Program Roadmap tab
2. Program: BSCS
3. **For Students Enrolling In: 2026-2027**
4. View complete roadmap

**Result:** Makikita yung EXACT curriculum na susundan ng 2026 students!

---

### Use Case 2: Historical Check

**Scenario:**
Admin: "Si Maria nag-enroll 2023, anong subjects ba ang nasa curriculum niya?"

**Action:**

1. Go to Curriculum tab
2. **View Curriculum For Year: 2023-2024**
3. View table

**Result:** Makikita lahat ng subjects na available noong 2023!

---

### Use Case 3: Comparison

**Scenario:**
"Ano ba ang difference ng 2025 curriculum vs 2026 curriculum?"

**Action:**

1. Filter by "2025-2026" → Screenshot/Note subjects
2. Filter by "2026-2027" → Screenshot/Note subjects
3. Compare!

**Result:** Makikita kung ano ang nag-change!

---

## 💡 Better Label - UPDATED!

### Old Label (Confusing):

```
Curriculum Version: [2025-2026 ▼]
```

**Problem:** Mukha siyang version number (v1, v2)

### New Label (Clear):

```
View Curriculum For Year: [Students Enrolling 2025-2026 ▼]
```

**Better:** Clear na it's for viewing what students see!

### In Roadmap:

```
For Students Enrolling In: [2025-2026 (Current Year) ▼]
```

**Even Clearer:** Directly says kung sino ang target!

---

## 🔍 How It All Works Together

### The Complete System:

```
┌─────────────────────────────────────────────────┐
│ DATABASE (Effectivity Range System)             │
├─────────────────────────────────────────────────┤
│ CS101: Start=2023, End=Ongoing                  │
│   → Effective: 2023, 2024, 2025, 2026...       │
│                                                 │
│ CS105: Start=2026, End=Ongoing                  │
│   → Effective: 2026, 2027, 2028...             │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ FILTER (Show curriculum for specific year)      │
├─────────────────────────────────────────────────┤
│ "View Curriculum For Year: 2025-2026"           │
│                                                 │
│ Logic: Show subjects where:                    │
│   2025 >= effectivityStart AND                  │
│   2025 <= effectivityEnd                        │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ DISPLAY (What 2025 students see)                │
├─────────────────────────────────────────────────┤
│ ✅ CS101 (effective 2023-Ongoing)               │
│ ❌ CS105 (effective 2026-Ongoing) ← Hidden      │
└─────────────────────────────────────────────────┘
```

---

## ✅ Summary

### Ang Filter ay Para sa:

1. **View curriculum ng specific enrollment year**

   - "Anong subjects ng 2025 students?"
   - "Anong subjects ng 2026 students?"

2. **Historical viewing**

   - "Anong curriculum noong 2023?"
   - "Nag-change ba from 2024 to 2025?"

3. **Planning**
   - "Anong curriculum ng incoming students next year?"
   - "May mga bagong subjects ba?"

### Hindi siya:

❌ "Version number" (v1, v2, v3)  
❌ "Catalog version"  
❌ "Build number"

### Siya ay:

✅ **"Year Viewer"** - Shows curriculum effective for that year  
✅ **"Student Perspective Filter"** - Shows what specific cohort sees  
✅ **"Effectivity Filter"** - Filters by effectivity range

---

## 🎯 Konklusyon

### Updated Labels (Mas Clear Na):

**Curriculum Tab:**

```
View Curriculum For Year: [Students Enrolling 2025-2026 ▼]
```

**Program Roadmap:**

```
For Students Enrolling In: [2025-2026 (Current Year) ▼]
```

### Purpose:

- Filter/view curriculum for specific enrollment year
- See what students of that year would follow
- Compare across years
- Historical reference

### Why Still Needed:

Even with effectivity range, kailangan pa rin ng filter para:

- Makita kung ano ang effective sa specific year
- Hindi mo naman pwede i-display lahat (messy!)
- Need mo ma-filter by year para makita ang relevant curriculum

---

**Clear na? Ang filter is for VIEWING what's effective in a specific year! 📅**

---

**Last Updated:** October 10, 2025  
**Label Updated:** ✅ More descriptive now  
**Purpose:** Clear curriculum viewing by enrollment year
