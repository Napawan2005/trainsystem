// public/scripts/lang-swap/index-lang.js

let currentLanguage = "en"; // Default language
let translations = {};

/**
 * Update the text content of elements based on the current language.
 */
function updateTexts() {
  // Update the document's language attribute
  document.documentElement.lang = currentLanguage;
  
  const langData = translations[currentLanguage];
  console.log(langData)
  if (!langData) return;

  // Iterate over each key in the language data and update the corresponding element
  for (const key in langData) {
    const element = document.getElementById(key);
    if (element) {
      element.textContent = langData[key];
    }
  }
}

/**
 * Fetch translation data from the JSON file.
 */
function loadTranslations() {
  fetch("/scripts/lang-swap/data/lang.json")
    .then(response => response.json())
    .then(data => {
      translations = data;
      updateTexts(); // Initial update on load
    })
    .catch(error => {
      console.error("Error fetching translations:", error);
    });
}

// Wait for the DOM content to load before executing scripts
document.addEventListener("DOMContentLoaded", () => {
  // Load translation data from the JSON file
  loadTranslations();

  // Set up event listener for the translate button
  const translateBtn = document.getElementById("translate-btn");
  if (translateBtn) {
    translateBtn.addEventListener("click", () => {
      // Toggle language between English and Thai
      currentLanguage = currentLanguage === "en" ? "th" : "en";
      updateTexts();
    });
  }
});
