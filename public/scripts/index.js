// index.js
import { languageManager } from "./lang-swap/language-core.js";
import { lang } from "./lang-swap/lang.js";
const translations = {
  "th": {
    // Header
    "main": "หน้าแรก",
    "history": "ประวัติการจอง",
    "translate": "English",
    "login": "เข้าสู่ระบบ",
    "title": "ไปสวรรค์",
    // Select
    "labelSearchFrom": "ต้นทาง",
    "labelSearchTo": "ปลายทาง",
    "optionEmptyFrom": "-- เลือกต้นทาง --",
    "optionBangkok": "กรุงเทพ",
    "optionChiangMai": "เชียงใหม่",
    "optionKorat": "โคราช",
    "optionEmptyTo": "-- เลือกปลายทาง --",
    "optionBangkokTo": "กรุงเทพ",
    "optionChiangMaiTo": "เชียงใหม่",
    "optionKoratTo": "โคราช",
    "labelSearchDate": "วันที่เดินทาง",
    "btnSearch": "ค้นหา",
    // Popular (pop)
    "popularHeading": "เส้นทางยอดนิยม",
    "popularDesc": "เลือกจุดหมายปลายทางที่ได้รับความนิยมจากนักเดินทาง",
    "tripBKKTitle": "กรุงเทพ",
    "tripBKKDesc": "มหานครที่ไม่เคยหลับใหล เต็มไปด้วยวัฒนธรรมและสีสัน",
    "tripCNXTitle": "เชียงใหม่",
    "tripCNXDesc": "ดินแดนแห่งขุนเขาและวัฒนธรรมล้านนา",
    "tripKRTTitle": "โคราช",
    "tripKRTDesc": "ประตูสู่อีสาน เมืองใหญ่เต็มไปด้วยแหล่งท่องเที่ยว",
    // Services
    "servicesHeading": "บริการของเรา",
    "serviceDomesticTitle": "รถไฟภายในประเทศ",
    "serviceDomesticDesc": "เดินทางสะดวกไปยังสถานีหลักทั่วประเทศ",
    "serviceInternationalTitle": "รถไฟระหว่างประเทศ",
    "serviceInternationalDesc": "เชื่อมต่อประเทศเพื่อนบ้าน เดินทางง่ายข้ามพรมแดน",
    "serviceSupportTitle": "บริการลูกค้า 24/7",
    "serviceSupportDesc": "พร้อมช่วยเหลือ ให้คำปรึกษาตลอดการเดินทาง",
    // ABOUT US
    "aboutHeading": "เกี่ยวกับเรา",
    "aboutDesc": "เราเป็นผู้ให้บริการจองตั๋วรถไฟชั้นนำ ที่มีประสบการณ์ยาวนาน มุ่งเน้นให้ผู้โดยสารได้รับความสะดวกสบายและประสบการณ์ที่ดีที่สุด",
    "networkTitle": "เครือข่ายครอบคลุมทั่วประเทศ",
    "sellTitle": "ราคาโปร่งใส ไม่มีค่าธรรมเนียมแอบแฝง",
    "systemTitle": "ระบบปลอดภัย มั่นใจในการทำธุรกรรม",
    // Contact & Footer
    "contactHeading": "ติดต่อเรา",
    "contactPhone": "โทร: 0-XXX-XXX-XXX",
    "contactEmail": "Email: info@trainbooking.com",
    "contactAddress": "ที่อยู่: 123 ถ.สายรถไฟ เขตท่องเที่ยว กรุงเทพฯ 10000",
    "footerMenuHeading": "เมนู",
    "footerNavHome": "หน้าแรก",
    "footerNavPopular": "เส้นทางยอดนิยม",
    "footerNavServices": "บริการ",
    "footerNavAbout": "เกี่ยวกับเรา",
    "footerSocialHeading": "ติดตามเรา"
  },
  "en": {
    // Header
    "main": "Home",
    "history": "Booking History",
    "translate": "ไทย",
    "login": "Login",
    "title": "Go to Heaven",
    // Select
    "labelSearchFrom": "Departure",
    "labelSearchTo": "Destination",
    "optionEmptyFrom": "-- Select Departure --",
    "optionBangkok": "Bangkok",
    "optionChiangMai": "Chiang Mai",
    "optionKorat": "Korat",
    "optionEmptyTo": "-- Select Destination --",
    "optionBangkokTo": "Bangkok",
    "optionChiangMaiTo": "Chiang Mai",
    "optionKoratTo": "Korat",
    "labelSearchDate": "Travel Date",
    "btnSearch": "Search",
    // Popular (pop)
    "popularHeading": "Popular Routes",
    "popularDesc": "Choose from the most popular travel destinations",
    "tripBKKTitle": "Bangkok",
    "tripBKKDesc": "The city that never sleeps, full of culture and colors",
    "tripCNXTitle": "Chiang Mai",
    "tripCNXDesc": "The land of mountains and Lanna culture",
    "tripKRTTitle": "Korat",
    "tripKRTDesc": "Gateway to Isan, a city full of attractions",
    // Services
    "servicesHeading": "Our Services",
    "serviceDomesticTitle": "Domestic Trains",
    "serviceDomesticDesc": "Convenient travel to major stations nationwide",
    "serviceInternationalTitle": "International Trains",
    "serviceInternationalDesc": "Seamless cross-border travel to neighboring countries",
    "serviceSupportTitle": "24/7 Customer Support",
    "serviceSupportDesc": "Always ready to assist you throughout your journey",
    // ABOUT US
    "aboutHeading": "About Us",
    "aboutDesc": "We are a leading train ticket booking service with extensive experience, dedicated to providing passengers with a comfortable journey and the best travel experience.",
    "networkTitle": "Nationwide Coverage",
    "sellTitle": "Transparent Pricing, No Hidden Fees",
    "systemTitle": "Secure System for Trusted Transactions",
    // Contact & Footer
    "contactHeading": "Contact Us",
    "contactPhone": "Phone: 0-XXX-XXX-XXX",
    "contactEmail": "Email: info@trainbooking.com",
    "contactAddress": "Address: 123 Railway Rd, Tourist District, Bangkok 10000",
    "footerMenuHeading": "Menu",
    "footerNavHome": "Home",
    "footerNavPopular": "Popular Routes",
    "footerNavServices": "Services",
    "footerNavAbout": "About Us",
    "footerSocialHeading": "Follow Us"
  }
};


// ✅ ทำให้แน่ใจว่า DOM โหลดเสร็จก่อนค่อยทำงาน
document.addEventListener("DOMContentLoaded", () => {
  languageManager.applyTranslation(translations, lang.getLang());

  // ✅ ผูก event หลัง DOM โหลด เพื่อป้องกัน error
  const translateBtn = document.getElementById("translate-btn");
  if (translateBtn) {
    translateBtn.addEventListener("click", () => {
      lang.switchLang(); // เปลี่ยนภาษาแล้ว reload
    });
  }
});


document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('toggle-btn');
  const toggleText = document.getElementById('toggleText');
  const passwordConfirmGroup = document.getElementById('password-confirm-group');
  let isLogin = true; // Default mode is Login

  toggleBtn.addEventListener('click', function () {
    if (isLogin) {
      // Switch to Register mode
      passwordConfirmGroup.style.display = 'block';
      toggleText.textContent = 'Already have an account? Login now';
      toggleBtn.textContent = 'Switch to Login';
      isLogin = false;
    } else {
      // Switch to Login mode
      passwordConfirmGroup.style.display = 'none';
      toggleText.textContent = "Don't have an account? Register now";
      toggleBtn.textContent = 'Switch to Register';
      isLogin = true;
    }
  });
});

