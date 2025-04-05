# เอกสารโค้ด: initialize-db.js

## 1. ชื่อไฟล์
**initialize-db.js**

## 2. ภาพรวม
ไฟล์นี้ใช้สำหรับการตั้งค่าและเริ่มต้นฐานข้อมูลที่จำเป็นสำหรับระบบ โดยใช้ IndexedDB ในการเก็บข้อมูล  
ไฟล์นี้ประกอบด้วยฟังก์ชันในการสร้างและอัปเกรดฐานข้อมูลที่สำคัญ 4 แห่ง ได้แก่:
- **RouteDB** สำหรับข้อมูลเส้นทางรถไฟ
- **UserDB** สำหรับข้อมูลผู้ใช้งาน
- **TicketDB** สำหรับข้อมูลตั๋วที่สั่งซื้อ
- **SeatClassDB** สำหรับข้อมูลราคาที่นั่ง

## 3. รายละเอียดฟังก์ชันและการทำงาน

### initRouteDB()
- เปิดหรือสร้างฐานข้อมูล "RouteDB" โดยใช้ version 1  
- ในเหตุการณ์ **onupgradeneeded** จะทำการสร้าง object store "routes" โดยกำหนด keyPath เป็น "routeID"  
- คืนค่า Promise ที่ resolve เมื่อฐานข้อมูลเปิดสำเร็จ

### initUserDB()
- เปิดหรือสร้างฐานข้อมูล "UserDB" โดยใช้ version 1  
- ใน **onupgradeneeded** จะทำการสร้าง object store "users" โดยใช้ keyPath "userID" และกำหนด autoIncrement  
- สร้าง index สำหรับ "username" ให้เป็นแบบ unique เพื่อป้องกันข้อมูลซ้ำกัน

### initTicketDB()
- เปิดหรือสร้างฐานข้อมูล "TicketDB" โดยใช้ version 1  
- ใน **onupgradeneeded** จะสร้าง object store "tickets" โดยใช้ keyPath "ticketID" พร้อมกับกำหนด autoIncrement

### initSeatClassDB()
- เปิดหรือสร้างฐานข้อมูล "SeatClassDB" โดยใช้ version 1  
- ใน **onupgradeneeded** จะสร้าง object store "seatClass" โดยใช้ keyPath "class"  
- เพิ่มข้อมูลเริ่มต้นสำหรับชั้นที่นั่ง:
  - Class A: ราคา 300
  - Class B: ราคา 200
  - Class C: ราคา 100

### initDatabases()
- ฟังก์ชันหลักที่นำเข้ามาใช้งานในโปรเจค  
- เรียกใช้ฟังก์ชัน **initRouteDB()**, **initUserDB()**, **initTicketDB()** และ **initSeatClassDB()**  
- เมื่อฐานข้อมูลทั้งหมดถูกตั้งค่าเรียบร้อย จะแสดงข้อความ "All databases initialized successfully." ใน console  
- หากเกิดข้อผิดพลาด จะทำการจับ error และแสดงข้อความใน console

## 4. วิธีการใช้งาน
- นำเข้า (import) ฟังก์ชัน **initDatabases()** จากไฟล์นี้ในส่วนของการเริ่มต้นโปรเจค  
- เมื่อเรียกใช้ **initDatabases()** ระบบจะทำการตั้งค่าและสร้างฐานข้อมูลทั้งหมดที่จำเป็นสำหรับการทำงานของแอปพลิเคชัน  
- ฟังก์ชันทั้งหมดใช้ Promise ในการจัดการการเปิดฐานข้อมูลและสามารถรองรับการอัปเกรดฐานข้อมูลได้อย่างเหมาะสม

## 5. ข้อสังเกต
- การใช้ IndexedDB ช่วยให้สามารถจัดการข้อมูลในฝั่ง client ได้อย่างอิสระ  
- การตรวจสอบการอัปเกรด (onupgradeneeded) สำคัญสำหรับการสร้าง object store ที่จำเป็น  
- ควรมีการจัดการ error อย่างเหมาะสมเพื่อป้องกันปัญหาในการเปิดฐานข้อมูลและดำเนินการตามขั้นตอนต่อไป
