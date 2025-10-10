# Curriculum Versioning - Maikling Paliwanag (Tagalog)

## 🎯 Ang Problema

**Scenario:**

```
2023: Si Maria nag-enroll sa BSCS
      - Kailangan niya kunin: CS101, MATH101, ENG101

2024: Nag-update ang school ng BSCS curriculum
      - BAGO: CS100 (hindi na CS101), MATH100, ENG102

Tanong: Anong kukunin ni Maria? CS101 o CS100?
```

**Problema:**

- ❌ Si Maria ay 2nd year na - nalilito siya
- ❌ Dapat ba siya mag-follow ng OLD curriculum (CS101) o NEW (CS100)?
- ❌ Paano kung di na nag-offer ng CS101?

---

## ✅ Solusyon: CURRICULUM EFFECTIVITY YEAR

### Ang Konsepto

Bawat curriculum may **Taon ng Pagsisimula** (Effectivity Year)

```
┌────────────────────────────────────────────┐
│  BSCS Curriculum 2023                      │
│  (Para sa mga nag-enroll 2023 pataas)     │
│                                            │
│  CS101, MATH101, ENG101...                 │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  BSCS Curriculum 2024 (BAGO!)              │
│  (Para sa mga nag-enroll 2024 pataas)     │
│                                            │
│  CS100, MATH100, ENG102... (Revised)       │
└────────────────────────────────────────────┘
```

### Paano Gumagana?

1. **Si Maria (2023 enrollee):**

   - Naka-lock siya sa "2023 Curriculum"
   - Kahit nag-update ang school, 2023 curriculum pa rin susundan niya
   - CS101, MATH101, ENG101 ang kukunin niya

2. **Si Juan (2024 enrollee):**
   - Naka-assign siya sa "2024 Curriculum"
   - NEW curriculum ang susundan niya
   - CS100, MATH100, ENG102 ang kukunin niya

### Tignan Mo:

```
Maria (2023):
Program: BSCS
Curriculum: 2023 ← LOCKED!
Subjects: CS101, MATH101, ENG101

Juan (2024):
Program: BSCS
Curriculum: 2024 ← NEW!
Subjects: CS100, MATH100, ENG102
```

---

## 🔧 Ano Ang Kailangan I-add?

### 1. Dagdag Field sa Curriculum

**Dati:**

```javascript
{
    program: 'BSCS',
    year: 1,
    term: '1st Semester',
    subjectCode: 'CS101',
    subjectName: 'Introduction to Computing'
}
```

**Bago (may Effectivity Year):**

```javascript
{
    program: 'BSCS',
    effectivityYear: '2023',  // BAGO!
    year: 1,
    term: '1st Semester',
    subjectCode: 'CS101',
    subjectName: 'Introduction to Computing'
}
```

### 2. Dropdown sa Form

Dagdag ng dropdown para sa Effectivity Year:

```html
<div class="form-group">
  <label>Curriculum Effectivity Year *</label>
  <select id="curriculum-effectivity" required>
    <option value="2020">2020-2021</option>
    <option value="2021">2021-2022</option>
    <option value="2022">2022-2023</option>
    <option value="2023">2023-2024</option>
    <option value="2024">2024-2025 (Current)</option>
    <option value="2025">2025-2026 (Upcoming)</option>
  </select>
  <small>Para sa mga estudyante na nag-enroll sa taong ito</small>
</div>
```

### 3. Filter sa Display

May filter para pumili kung anong curriculum version ang ipapakita:

```html
<select id="filter-effectivity" onchange="filterByEffectivity()">
  <option value="2023">2023-2024 Curriculum</option>
  <option value="2024">2024-2025 Curriculum (Current)</option>
  <option value="2025">2025-2026 Curriculum (Upcoming)</option>
</select>
```

### 4. Update Table - May Effectivity Column

**Tignan mo ang table:**

| ID  | Program | **Effectivity** | Year/Term    | Subject | Actions     |
| --- | ------- | --------------- | ------------ | ------- | ----------- |
| 1   | BSCS    | **2023-2024**   | Year 1 - 1st | CS101   | Edit/Delete |
| 2   | BSCS    | **2024-2025**   | Year 1 - 1st | CS100   | Edit/Delete |

Dalawa silang pareho ng program at year/term, pero **iba ang effectivity year**!

---

## 📊 Halimbawa ng Workflow

### Gumawa ng Bagong Curriculum Version

**Step 1: Copy Old Curriculum**

```
Click "Copy Curriculum 2023 to 2024"
→ System mag-duplicate ng lahat ng 2023 records
→ Change effectivity from 2023 to 2024
```

**Step 2: Update Subjects**

```
2024 Curriculum (copied):
- CS101 → Change to CS100
- MATH101 → Change to MATH100
- Add new subjects
- Remove outdated subjects
```

**Step 3: Save**

```
✅ 2023 Curriculum - still exists (for old students)
✅ 2024 Curriculum - newly created (for new students)
```

### Pag May Nag-enroll

**Maria enrolls in 2023:**

```
System:
- studentId: 2023-12345
- curriculumEffectivity: '2023' ← AUTO-ASSIGN
- Habambuhay 2023 curriculum na siya
```

**Juan enrolls in 2024:**

```
System:
- studentId: 2024-67890
- curriculumEffectivity: '2024' ← AUTO-ASSIGN
- 2024 curriculum ang makikita niya
```

### Pag Nag-view ng Curriculum

**Si Maria (2023) logs in:**

```
System filter:
- Program: BSCS
- Effectivity: 2023 ← from student record

Display:
✅ CS101, MATH101, ENG101 (2023 curriculum)
❌ Hindi niya makikita ang CS100 (2024 curriculum)
```

**Si Juan (2024) logs in:**

```
System filter:
- Program: BSCS
- Effectivity: 2024 ← from student record

Display:
✅ CS100, MATH100, ENG102 (2024 curriculum)
❌ Hindi niya makikita ang CS101 (2023 curriculum)
```

---

## 🎓 Course Offerings - Dalawang Version

Kailangan mag-offer ng BOTH versions!

**2024-2025 School Year:**

```
For 2023 Students (Year 2 na sila):
✅ Offer CS102, MATH102 (from 2023 curriculum)

For 2024 Students (Year 1 pa lang):
✅ Offer CS100, MATH100 (from 2024 curriculum)

Kailangan BOTH!
```

---

## ✅ Mga Benepisyo

### Para sa Students

- ✅ **Stable:** Hindi nag-change ang curriculum nila mid-program
- ✅ **Clear:** Alam nila kung ano kukunin
- ✅ **Fair:** Hindi sila ma-disadvantage ng curriculum changes

### Para sa School

- ✅ **Flexible:** Pwede mag-update ng curriculum anytime
- ✅ **Organized:** Clear separation ng versions
- ✅ **Compliant:** Meets CHED requirements

### Para sa System

- ✅ **Clean:** Organized ang data
- ✅ **Traceable:** Alam kung sino-sinong curriculum ang ginagamit
- ✅ **Historical:** May complete record ng changes

---

## 🚀 Priority Level

**Importance:** ⭐⭐⭐⭐⭐ (5/5 - SOBRANG IMPORTANTE!)

**Why?**

- Students protected from mid-program changes
- School can update curriculum freely
- Proper academic progression maintained
- Required for accreditation

---

## 📝 Implementation Checklist

Ito ang mga kailangan gawin:

### Quick (Must Have)

- [ ] Add `effectivityYear` field sa curriculum database
- [ ] Add effectivity dropdown sa curriculum form
- [ ] Add effectivity column sa table
- [ ] Add effectivity filter sa views
- [ ] Update save/edit functions

### Medium (Important)

- [ ] Add effectivity selector sa Program Roadmap
- [ ] Update Course Offerings to support multiple versions
- [ ] Add visual badges (Old/Current/Upcoming)
- [ ] Create "Copy Curriculum" function

### Advanced (Nice to Have)

- [ ] Curriculum comparison tool
- [ ] Student migration tools
- [ ] Archive old curricula
- [ ] Equivalency mapping

---

## 💡 Simpleng Solusyon

Kung gusto mo SIMPLE VERSION lang muna:

**1. Add field:**

```javascript
effectivityYear: "2024";
```

**2. Add dropdown sa form:**

```html
<select id="curriculum-effectivity">
  <option value="2023">2023-2024</option>
  <option value="2024">2024-2025</option>
</select>
```

**3. Add filter:**

```javascript
function filterByEffectivity() {
  const year = document.getElementById("filter-effectivity").value;
  const filtered = curriculumData.filter((c) => c.effectivityYear === year);
  renderCurriculumTable(filtered);
}
```

**Tapos na! May versioning na! 🎉**

---

## 🎯 Konklusyon

### Ang Sagot sa Tanong Mo:

**Tanong:**

> "Pano ung kapag nag bago ang curriculum this year dapat di ma apektuhan ung curriculum previously"

**Sagot:**

> **CURRICULUM EFFECTIVITY YEAR!**
>
> - Add effectivity year sa bawat curriculum record
> - Students are locked to their enrollment year's curriculum
> - Kahit nag-change ang curriculum, old students hindi affected
> - Both curricula coexist - old para sa old students, new para sa new students

**Simple lang:** Bawat curriculum may year stamp, bawat student locked sa kanilang year!

---

**Implemented na yan, solve na ang problema! 🎊**

---

**Para sa complete technical guide, basahin:**  
`CURRICULUM_VERSIONING_GUIDE.md`
