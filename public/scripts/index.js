import { initDatabases } from "./db/initialize-db.js";
import {langStorage} from "./lang-swap/storage.js";
import {loadTranslations, applyTranslations} from "./lang-swap/i18n.js"


document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('toggleText-btn');
  const toggleText = document.getElementById('toggleText');
  const passwordConfirmGroup = document.getElementById('password-confirm-group');
  let isLogin = true; // Default mode is Login

  // Initialize databases if not already created
  initDatabases();

  toggleBtn.addEventListener('click', function () {
    let newLang = langStorage.toggle();

    loadTranslations();
    applyTranslations(newLang);

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