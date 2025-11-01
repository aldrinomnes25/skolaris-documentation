# 📊 Database Structure - Users & Students

## Answer: **HINDI, email ay sa USERS table lang!**

---

## 🗄️ Database Tables

### **USERS Table** (Main table)
```sql
users
├── user_id (Primary Key)
├── campus_id
├── email ← EMAIL IS HERE! (UNIQUE)
├── phone
├── password_hash
├── full_name
├── user_type (student, faculty, staff, etc.)
├── is_active
├── created_at
└── updated_at
```

### **STUDENTS Table** (Extension/Details)
```sql
students
├── student_id (Primary Key)
├── user_id (Foreign Key → users.user_id)
├── program_id
├── student_number
├── year_level
├── status
├── admission_date
├── expected_graduation
├── gpa
├── total_units_earned
├── created_at
└── updated_at

NO EMAIL HERE! ❌
```

---

## 🔗 How They Connect

```
┌─────────────────────────┐
│      USERS TABLE        │
│  user_id: 1             │
│  email: juan@school.edu │ ← Email stored here!
│  full_name: Juan Dela   │
│  user_type: student     │
└──────────┬──────────────┘
           │
           │ user_id (Foreign Key)
           ▼
┌─────────────────────────┐
│    STUDENTS TABLE       │
│  student_id: 1          │
│  user_id: 1  ← Links!   │
│  student_number: STU001 │
│  program_id: 5          │
│  year_level: 1          │
└─────────────────────────┘
   NO email column! ❌
```

---

## 📋 **How to Get Student Email**

### Through Relationship:
```php
// PHP/Laravel
$student = Student::find(1);
$email = $student->user->email;  // Access through relationship!

// SQL Join
SELECT students.*, users.email
FROM students
JOIN users ON students.user_id = users.user_id
WHERE students.student_id = 1;
```

### In Student Model:
```php
// Student.php
public function user(): BelongsTo
{
    return $this->belongsTo(User::class, 'user_id', 'user_id');
}

// Usage:
$student->user->email     // ✅ Get email
$student->user->phone     // ✅ Get phone  
$student->user->full_name // ✅ Get name
```

---

## 🎯 **Why This Design?**

### **Single Source of Truth:**
```
✅ GOOD (Current Design):
Email stored in ONE place (users table)
Student accesses it through relationship

❌ BAD (If duplicated):
Email in users table: juan@school.edu
Email in students table: juan@school.edu ← Duplicate data!
What if they don't match? Which is correct?
```

### **Benefits:**
1. ✅ **No duplication** - Email stored once
2. ✅ **Data integrity** - Can't have mismatched emails
3. ✅ **Easy updates** - Change email in one place
4. ✅ **Unique constraint** - Enforced at users table level

---

## 📊 **Complete Picture:**

```
ONE User Account (users table)
├── Email: juan@school.edu ← Stored here only!
├── Password
├── Full Name
└── User Type: student

    ↓ Creates

ONE Student Record (students table)
├── Student Number: STU000001
├── Program: BS Computer Science
├── Year Level: 1
└── Links to User via user_id

    ↓ Access email

student.user.email → "juan@school.edu" ✅
```

---

## 🚀 **Practical Example:**

### Creating a Student:

**Step 1: Create User**
```javascript
User.create({
  email: "juan@school.edu",      ← Email here!
  password: "...",
  full_name: "Juan Dela Cruz",
  user_type: "student",
  campus_id: 1
})
// Returns: user_id = 501
```

**Step 2: Create Student (automatic)**
```javascript
Student.create({
  user_id: 501,                  ← Links to user
  student_number: "STU000501",
  program_id: 5,
  year_level: 1
  // NO email field! Gets it from user relationship
})
```

**Step 3: Access Email**
```javascript
// Get student
const student = Student.find(1);

// Get email through relationship
const email = student.user.email;  // "juan@school.edu" ✅
```

---

## ✅ **Your Situation:**

**Why duplicate error?**
```
Your account email: admin@school.edu
You tried to create new user with: admin@school.edu

❌ Error: "The email has already been taken."
```

**Solution:**
```
Use different email for new user:
- test.student@school.edu
- juan.delacruz@school.edu
- sample.user@school.edu
```

---

## 🎯 **Summary:**

**Question:** "May email ba sa users AND students?"

**Answer:** 
- ✅ **USERS table** - May email (unique)
- ❌ **STUDENTS table** - WALANG email!
- ✅ Access student email through: `student.user.email`

**Design:** One user = One email. Student just links to user!

**Your error:** Trying to use same email twice - that's correct behavior ng system! Use different email para sa new user. 💪🎉
