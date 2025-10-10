# Program Roadmap - Mabilis na Gabay (Quick Guide)

## 🗺️ Ano ang Program Roadmap?

Ang **Program Roadmap** ay visual na representation ng **buong curriculum journey** ng isang programa mula Year 1 hanggang graduation.

### Simpleng Paliwanag:

Parang "mapa" ng estudyante kung:

- Ano-anong subjects ang kukunin niya kada semester
- Ilang years para matapos ang program
- Ano ang prerequisites bago makakuha ng ibang subject
- Ilang units kada term at year

---

## 🎯 Paano Ito Gumagana?

### Hierarchy (Pagkakasunod-sunod):

```
📚 PROGRAM (e.g., BSCS)
    │
    ├─ 📚 Year 1
    │   ├─ 📖 1st Semester
    │   │   ├─ CS101 - Intro to Computing (3 units)
    │   │   ├─ MATH101 - Calculus I (3 units)
    │   │   ├─ ENG101 - English I (3 units)
    │   │   └─ ... (iba pang subjects)
    │   │
    │   └─ 📖 2nd Semester
    │       ├─ CS102 - Programming (3 units) - Prereq: CS101
    │       ├─ MATH102 - Calculus II (3 units) - Prereq: MATH101
    │       └─ ... (iba pang subjects)
    │
    ├─ 📚 Year 2
    │   ├─ 📖 1st Semester
    │   └─ 📖 2nd Semester
    │
    ├─ 📚 Year 3
    │   ├─ 📖 1st Semester
    │   └─ 📖 2nd Semester
    │
    └─ 📚 Year 4
        ├─ 📖 1st Semester
        └─ 📖 2nd Semester
```

---

## 📊 Ano ang Makikita sa Display?

### Bawat Year Level:

- Total bilang ng subjects sa buong year
- Total units sa buong year
- Lahat ng terms (1st Sem, 2nd Sem, Summer)

### Bawat Term:

- Listahan ng lahat ng subjects sa term na yun
- Bilang ng subjects
- Total units

### Bawat Subject:

- **Subject Code** (e.g., CS101) - Bold purple text
- **Units** (e.g., 3 Units) - Gray text
- **Subject Name** (e.g., Introduction to Computing) - Black text
- **Prerequisites** (e.g., Prereq: CS101) - Italic text
  - Kung walang prereq, nakalagay "No prerequisite"

---

## 🎨 Mga Features

### 1. Program Selector Dropdown

Sa taas ng page, may dropdown para pumili ng program:

- BSCS - Computer Science
- BSIT - Information Technology
- BSIS - Information Systems
- ACT - Associate in Computer Technology

**Pag nag-change ka ng program, automatic nag-update yung roadmap!**

### 2. Color Coding

| Color               | Meaning            |
| ------------------- | ------------------ |
| **Purple Gradient** | Year level headers |
| **Light Gray**      | Term headers       |
| **White**           | Subject rows       |
| **Purple Text**     | Subject codes      |
| **Gray Text**       | Units              |
| **Black Text**      | Subject names      |

### 3. Print Function

May button na **"🖨️ Print Roadmap"**

- I-print para sa students
- Save as PDF
- Walang buttons sa print - clean lang yung curriculum

### 4. Hover Effects

Pag nag-hover ka sa subject row, mag-highlight siya (light gray background)

---

## 💡 Kailan Gamitin?

### Para sa Academic Head:

✅ Review ng buong curriculum ng isang program  
✅ Check kung tama ba ang sequence ng subjects  
✅ Tingnan kung logical ba ang prerequisites  
✅ I-print para sa faculty meetings

### Para sa Student Advisors:

✅ I-guide ang students kung ano ang kukunin  
✅ Ipakita kung ano pa ang kailangan para maka-graduate  
✅ Explain ang prerequisites at subject flow  
✅ I-print para ibigay sa students

### Para sa Students:

✅ Makita ang buong journey from Year 1 to Year 4  
✅ Maintindihan kung bakit may prerequisites  
✅ Mag-plan ahead kung ano ang kukunin sa susunod na term  
✅ Estimate kung kailan sila makaka-graduate

---

## 📝 Example: BSCS Curriculum Journey

### Year 1 - 1st Semester

Total: **6 subjects | 17 units**

| Code    | Subject                   | Units | Prereq |
| ------- | ------------------------- | ----- | ------ |
| CS101   | Introduction to Computing | 3     | None   |
| MATH101 | Calculus I                | 3     | None   |
| ENG101  | English I                 | 3     | None   |
| FIL101  | Filipino I                | 3     | None   |
| PE101   | Physical Education 1      | 2     | None   |
| NSTP101 | NSTP 1                    | 3     | None   |

### Year 1 - 2nd Semester

Total: **6 subjects | 17 units**

| Code    | Subject                  | Units | Prereq      |
| ------- | ------------------------ | ----- | ----------- |
| CS102   | Programming Fundamentals | 3     | **CS101**   |
| MATH102 | Calculus II              | 3     | **MATH101** |
| ENG102  | English II               | 3     | **ENG101**  |
| FIL102  | Filipino II              | 3     | **FIL101**  |
| PE102   | Physical Education 2     | 2     | **PE101**   |
| NSTP102 | NSTP 2                   | 3     | **NSTP101** |

### Year 2 - 1st Semester

Total: **5 subjects | 15 units**

| Code    | Subject                     | Units | Prereq      |
| ------- | --------------------------- | ----- | ----------- |
| CS201   | Data Structures             | 3     | **CS102**   |
| CS202   | Object-Oriented Programming | 3     | **CS102**   |
| MATH201 | Discrete Mathematics        | 3     | **MATH102** |
| PHYS101 | Physics for CS              | 3     | **MATH101** |
| HUM101  | Humanities Elective         | 3     | None        |

... at ito ay patuloy hanggang Year 4 - 2nd Semester!

---

## ⚡ Mga Advantages

### 1. Visual Clarity

Hindi na text-based list lang. Nakikita mo ang **buong picture** ng programa.

### 2. Easy Navigation

Organized by Year → Term → Subjects. Madali hanapin ang hinahanap mo.

### 3. Prerequisite Tracking

Clear na clear kung ano ang kailangan bago kumuha ng subject.

### 4. Planning Tool

Makikita kung gaano kabigat ang isang term (based sa number of subjects at units).

### 5. Print-Ready

Ready na i-print para sa orientation, advising, or student handouts.

---

## 🔄 Pagkakaiba ng 3 Tabs

### Tab 1: Default Curriculum (List View)

- **Format:** Table/List
- **Purpose:** Add/Edit/Delete individual curriculum records
- **Best For:** Data entry, maintenance

### Tab 2: Program Roadmap (Visual View) ⭐ NEW!

- **Format:** Hierarchical Visual Display
- **Purpose:** See complete curriculum journey
- **Best For:** Planning, advising, presentations

### Tab 3: Course Offerings

- **Format:** Table with faculty, schedule, slots
- **Purpose:** Manage actual classes being offered
- **Best For:** Term-specific class scheduling

---

## 🚀 Paano Gamitin Step-by-Step

### Step 1: Buksan ang Page

- Open `curriculum-management.html` sa browser

### Step 2: Pumunta sa Program Roadmap Tab

- Click ang **"🗺️ Program Roadmap"** tab

### Step 3: Piliin ang Program

- Sa dropdown, piliin kung anong program (e.g., BSCS)

### Step 4: Review ang Roadmap

- Scroll down para makita lahat ng years
- Tingnan ang bawat term
- Check ang subjects at prerequisites

### Step 5 (Optional): Print

- Click **"🖨️ Print Roadmap"** button
- Choose printer or "Save as PDF"
- Print or save

---

## 💻 Technical Details

### Data Source

Currently static data muna (JavaScript array), pero pwede ma-integrate sa backend:

```javascript
// Example data structure
{
    id: 1,
    program: 'BSCS',
    year: 1,
    term: '1st Semester',
    subjectCode: 'CS101',
    subjectName: 'Introduction to Computing',
    units: 3,
    prerequisites: 'None',
    status: 'active'
}
```

### Rendering Function

`renderProgramRoadmap()` - Main function na:

1. Kumuha ng selected program
2. Filter curriculum data
3. Group by year at term
4. Sort nang maayos
5. Calculate totals
6. Generate HTML
7. Display sa screen

---

## 📱 Responsive Design

### Desktop

- Full layout with all columns
- Side-by-side display

### Tablet

- Adjusted spacing
- Touch-friendly buttons

### Mobile

- Stacked layout
- Swipe-friendly
- Larger tap targets

---

## ❓ Common Questions

**Q: Pwede ba akong mag-add ng subject dito?**  
A: Hindi. Mag-add sa **"Default Curriculum"** tab, tapos automatic mag-appear sa Roadmap.

**Q: Paano kung may mali sa roadmap?**  
A: Edit sa **"Default Curriculum"** tab, tapos refresh or switch program ulit.

**Q: Pwede ba i-export to Excel?**  
A: Hindi pa. But pwede i-print as PDF.

**Q: Paano kung walang data?**  
A: Lalabas "No curriculum data available" message.

**Q: Real-time ba ang updates?**  
A: Sa ngayon, kailangan pa ng manual refresh. Future versions will be real-time.

---

## 🎯 Summary

### Ang Program Roadmap ay:

✅ **Complete view** ng buong program curriculum  
✅ **Organized** by Year → Term → Subject  
✅ **Visual** at madaling maintindihan  
✅ **Print-ready** para sa students  
✅ **Shows prerequisites** clearly  
✅ **Calculates totals** automatically

### Hindi ito:

❌ Para sa pag-add/edit ng individual subjects (yun yung sa Tab 1)  
❌ Para sa actual course offerings (yun yung sa Tab 3)  
❌ Real-time enrollment tracker

---

## 🎓 Conclusion

Ang **Program Roadmap** ay powerful tool para makita ang **big picture** ng isang academic program. Instead of looking at individual subjects lang, nakikita mo na ang **entire journey** ng student from enrollment to graduation.

Perfect para sa:

- 📋 Academic planning
- 🎯 Student advising
- 📊 Program review
- 📄 Documentation
- 🖨️ Student handouts

---

**Salamat at Enjoy using the Program Roadmap! 🎉**

---

**For full detailed guide, basahin ang:**  
`CURRICULUM_MANAGEMENT_UI_GUIDE.md`
