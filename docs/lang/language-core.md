# เอกสารโค้ด: language-core.js

## 1. ชื่อไฟล์
**language-core.js**

## 2. ภาพรวม
ไฟล์นี้เป็นโมดูลที่ทำหน้าที่จัดการการนำการแปล (Translation) มาใช้ในหน้าเว็บ  
มีฟังก์ชันหลักคือ **applyTranslation** ซึ่งจะอัปเดตข้อความในหน้าเว็บตามภาษาที่เลือกโดยใช้ข้อมูลจากพจนานุกรม (dictionary)

## 3. รายละเอียดฟังก์ชัน

- **applyTranslation(dictionary, langKey)**
  - **dictionary**: วัตถุที่เก็บคำแปลของแต่ละ element โดย key เป็น id ของ element และ value เป็นข้อความที่แปลแล้วสำหรับภาษาต่าง ๆ
  - **langKey**: คีย์ของภาษาที่ต้องการนำมาใช้ (เช่น "th" หรือ "en")
  - ฟังก์ชันนี้จะดึงข้อมูลคำแปลจาก dictionary ตามภาษาที่เลือก แล้ววนลูปผ่าน key แต่ละตัวเพื่อตรวจสอบว่าในหน้าเว็บมี element ที่มี id ตรงกับ key นั้นหรือไม่ ถ้ามีจะทำการอัปเดต `textContent` ให้ตรงกับข้อความที่แปลแล้ว

## 4. ข้อสังเกต
- การอัปเดตข้อความในหน้าเว็บจะอิงกับ id ของ element ดังนั้นควรให้ id ของ element ใน HTML ตรงกับ key ในพจนานุกรมที่ใช้สำหรับแปล
- โมดูลนี้ช่วยให้การจัดการและนำการแปลภาษามาใช้ในหน้าเว็บทำได้อย่างเป็นระบบและง่ายต่อการบำรุงรักษา

## 5. ตัวอย่างการใช้งาน
```js
import { languageManager } from './language-core.js';

const dictionary = {
  th: { "greeting": "สวัสดี", "farewell": "ลาก่อน" },
  en: { "greeting": "Hello", "farewell": "Goodbye" }
};

const selectedLanguage = "th";
languageManager.applyTranslation(dictionary, selectedLanguage);
```