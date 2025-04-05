# เอกสารซอฟต์แวร์และเอกสารทางเทคนิค

เอกสารนี้อธิบายรายละเอียดการทำงานของฟังก์ชันตรวจสอบการเข้าสู่ระบบของผู้ดูแลระบบ (Admin Authentication) ในโปรเจค Rail System ซึ่งพัฒนาด้วย Vanilla JavaScript

---

## 1. ภาพรวมของฟังก์ชัน

ฟังก์ชันนี้มีวัตถุประสงค์เพื่อ:
- ดึงข้อมูลผู้ใช้ที่ล็อกอินจาก `sessionStorage`
- ตรวจสอบความถูกต้องของข้อมูลผู้ใช้
- ตรวจสอบบทบาทของผู้ใช้ (ต้องเป็น admin)
- ป้องกันไม่ให้ผู้ใช้ที่ไม่ได้รับอนุญาตเข้าถึงหน้าที่จำกัด (admin-only)

---

## 2. รายละเอียดการทำงาน

### 2.1. การดึงข้อมูลผู้ใช้
- ใช้คำสั่ง `sessionStorage.getItem("loggedInUser")` เพื่อดึงข้อมูลผู้ใช้ในรูปแบบ JSON
- หากไม่พบข้อมูลใน `sessionStorage` จะแสดงข้อความแจ้งเตือนและเปลี่ยนเส้นทางไปยังหน้า login

### 2.2. การแปลงข้อมูล JSON
- ใช้ `JSON.parse` ในการแปลงข้อมูล JSON ให้เป็นอ็อบเจกต์ JavaScript
- ถ้าเกิดข้อผิดพลาดระหว่างการแปลงข้อมูล (เช่น ข้อมูลเสียหาย) ระบบจะลบข้อมูลใน `sessionStorage` และเปลี่ยนเส้นทางกลับไปยังหน้า login

### 2.3. การตรวจสอบบทบาทของผู้ใช้
- ตรวจสอบคุณสมบัติ `role` ของอ็อบเจกต์ผู้ใช้ที่ได้จากการแปลง JSON
- ใช้เมธอด `toLowerCase()` เพื่อให้การตรวจสอบเป็นแบบไม่คำนึงถึงตัวพิมพ์
- หากบทบาทของผู้ใช้ไม่ใช่ "admin" จะแสดงข้อความแจ้งเตือนและเปลี่ยนเส้นทางกลับไปยังหน้า login

### 2.4. การอนุญาตการเข้าถึง
- หากผ่านทุกขั้นตอนการตรวจสอบแล้ว (ข้อมูลถูกต้องและบทบาทเป็น admin) ระบบจะบันทึกข้อความใน console ว่า "Admin authenticated successfully."
- เมื่อผ่านการตรวจสอบ ระบบอนุญาตให้ผู้ใช้ดำเนินการในหน้าที่จำกัดเฉพาะ admin ต่อไป

---

## 3. โค้ดตัวอย่าง

```js
(() => {
    // ดึงข้อมูลผู้ใช้ที่ล็อกอินจาก session storage โดยใช้คีย์ "loggedInUser"
    const loggedInUserJSON = sessionStorage.getItem("loggedInUser");

    // หากไม่มีข้อมูลผู้ใช้ที่ล็อกอิน ให้แสดงข้อความแจ้งเตือนและเปลี่ยนเส้นทางไปยังหน้า login
    if (!loggedInUserJSON) {
        alert("Access denied. You must be logged in as an admin to access this page.");
        window.location.href = "/index.html"; // เปลี่ยนเป็น URL ของหน้า login ที่ถูกต้อง
        return;
    }

    let loggedInUser;
    try {
        loggedInUser = JSON.parse(loggedInUserJSON);
    } catch (error) {
        console.error("Error parsing logged in user data:", error);
        alert("Invalid session data. Please log in again.");
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "/index.html";
        return;
    }

    // ตรวจสอบว่าบทบาทของผู้ใช้เป็น admin หรือไม่ (ใช้ toLowerCase เพื่อความสอดคล้อง)
    if (loggedInUser.role.toLowerCase() !== "admin") {
        alert("Access denied. Admins only.");
        window.location.href = "/index.html"; // เปลี่ยนเส้นทางสำหรับผู้ใช้ที่ไม่ใช่ admin ไปยังหน้า login
        return;
    }

    // หากโปรแกรมมาถึงส่วนนี้ แสดงว่าผู้ใช้เป็น admin
    console.log("Admin authenticated successfully.");
})();
