export const lang = {
  currentLang: localStorage.getItem("currentLang") || "th",

  switchLang() {
    this.currentLang = this.currentLang === "th" ? "en" : "th";
    localStorage.setItem("currentLang", this.currentLang);
    location.reload(); // โหลดหน้าใหม่เพื่อให้แปลภาษาใหม่
  },

  getLang() {
    return this.currentLang;
  }
};


  //localStorge = web strore API ใช้เก้บข้อมูลแบบถาวร แม้กรระทั้งปิดเบาร์เซอร์ก้จะไม่หาย
  /* localStorage.setItem('key','value') = เก้บข้อมูล
     localStorage.getItem('key') = ดึงข้อมูล 
     localStorage.removeItem('key') = ลบข้อมูล
     localStorage.clear(); = ลบข้อมูลทั้งหมด
     */
//สามารถเก็บข้อมูลในรูปแบบ json ได้โดย 
/* const user = {name:'Alice' , age: 25}
localStorage.setItem('user' , JSON.stringify(user))//เก้บข้อมูลอยู่ในรูปแบบ ่json
แล้วถ้าเวลาดึงทำไง
const savedUser = JSON.parse(localStore.getItem('user')) */
//แล้วข้อมูลจะ๔ุกเก็บไว้ไหน??
/**
 *เก็บไวที่ แยกdomain ของ user
 *user สามารภดูได้โดย devtools
 */

 // location.reload() โหลดหน้าเดิม เมื่อ user f5
  