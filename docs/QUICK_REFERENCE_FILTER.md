# Quick Reference: Curriculum Filter

## 🎯 Para Saan ang Filter?

### Simpleng Sagot:

**Para makita kung ANONG CURRICULUM ang gagamitin ng students na mag-eenroll sa specific year.**

---

## 📊 Visual Guide

### May 3 Subjects sa Database:

```
┌──────────────────────────────────────────────┐
│ CS100: 2020-2022 (TAPOS NA)                 │
│ CS101: 2023-Ongoing (CURRENT PA)            │
│ CS105: 2026-Ongoing (FUTURE)                │
└──────────────────────────────────────────────┘
```

### Pag Nag-Filter:

#### Filter: "Students Enrolling 2023-2024"

```
Shows: CS101 ✅
Hides: CS100 ❌ (ended 2022)
       CS105 ❌ (starts 2026)

Meaning: 2023 students use CS101
```

#### Filter: "Students Enrolling 2025-2026"

```
Shows: CS101 ✅ (still ongoing)
Hides: CS100 ❌ (ended 2022)
       CS105 ❌ (starts 2026)

Meaning: 2025 students STILL use CS101 (same as 2023!)
```

#### Filter: "Students Enrolling 2026-2027"

```
Shows: CS105 ✅ (starts 2026!)
Hides: CS100 ❌ (ended long ago)
       CS101 ??? (depends if still ongoing or ended)

Meaning: 2026 students use NEW subject CS105
```

---

## 💡 Kailan Gamitin?

### Scenario 1: Student Inquiry

**Question:** "I'll enroll in 2026, anong subjects ko?"

**Action:**

- Filter: "Students Enrolling 2026-2027"
- View roadmap

**Result:** Makikita EXACTLY ang 2026 curriculum!

---

### Scenario 2: Historical Check

**Question:** "Noong 2023, anong curriculum?"

**Action:**

- Filter: "Students Enrolling 2023-2024"
- View table

**Result:** Makikita ang 2023 curriculum!

---

### Scenario 3: See Everything

**Question:** "Show me ALL subjects, past and present"

**Action:**

- Filter: "All Years (Show Everything)"

**Result:** Lahat ng subjects, kahit ended na!

---

## 📋 Updated Labels (Mas Clear)

### Curriculum Tab:

```
OLD: "Curriculum Version:"
NEW: "View Curriculum For Year:"
     ↓
     "Students Enrolling 2025-2026"
```

### Program Roadmap:

```
OLD: "Curriculum Version:"
NEW: "For Students Enrolling In:"
     ↓
     "2025-2026 (Current Year)"
```

---

## ✅ Key Points

### Ang Filter ay:

✅ Para **VIEW** curriculum ng specific year  
✅ Para **FILTER** effective subjects for that year  
✅ Para **SEE** kung ano ang makikita ng students

### Hindi siya:

❌ Version number (v1, v2)  
❌ Para mag-duplicate every year  
❌ Para mag-create ng bago

### Analogy:

```
Parang time machine:
- Select 2023 → See 2023 curriculum
- Select 2025 → See 2025 curriculum
- Select 2026 → See 2026 curriculum

Hindi ka nag-create ng bago,
Tini-VIEW mo lang kung ano ang effective sa year na yun!
```

---

## 🔄 Complete Flow

### Creating Curriculum (One Time):

```
1. Add CS101
   - Start: 2023
   - End: Ongoing ✅

→ This ONE record serves 2023, 2024, 2025, 2026... students!
→ NO NEED to create new every year!
```

### Viewing Different Years (Using Filter):

```
Filter 2023: Shows CS101 ✅
Filter 2024: Shows CS101 ✅ (same record!)
Filter 2025: Shows CS101 ✅ (same record!)
Filter 2026: Shows CS101 ✅ (same record, if still ongoing!)

All viewing the SAME CS101 record!
Just filtered by year!
```

### Only Create New When Change:

```
2026: Replace CS101 with CS105

Action:
1. Edit CS101 → End: 2025
2. Create CS105 → Start: 2026, End: Ongoing

Now:
Filter 2025: Shows CS101 ✅
Filter 2026: Shows CS105 ✅

Different results, pero dalawa lang ang records (not 10+!)
```

---

## 🎓 Summary

### Filter = Year Viewer

**Purpose:**

- View curriculum for specific enrollment year
- See what students of that year follow
- Compare across years
- Historical reference

**NOT for:**

- Creating new versions
- Duplicating records
- Version numbering

**Kaya kailangan:**

- Para makita kung ano ang effective sa specific year
- Para hindi messy ang display (lahat ng subjects)
- Para ma-filter by enrollment year

**Formula:**

```
Database: Subjects with effectivity RANGE (start-end)
Filter: Show subjects effective for YEAR X
Display: Only subjects where X is within range
```

**Analogy:**

```
Database = Library with books tagged with year ranges
Filter = "Show me books available in 2025"
Display = Filtered list of books

You're not creating new books every year,
You're just viewing what's available in specific years!
```

---

**Clear na? Ang filter is for VIEWING, not for CREATING! 👁️**

**Updated label na rin para mas clear! ✅**
