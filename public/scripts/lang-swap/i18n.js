// /scripts/lang/i18n.js
import { langStorage } from "./storage.js";

let translations = {};

async function loadTranslations() {
    const res = await fetch("/lang-swap-data/lang.json");
    translations = await res.json();
    applyTranslations(langStorage.get());
}

function applyTranslations(lang) {
    const langData = translations[lang];

    if (!langData) {
        console.log("No lang lang-swap-data found.");
        return ;
    }

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (langData[key]) {
            el.textContent = langData[key];
            console.log("key = " + key + " = " + langData[key]);
        }
    });

    document.documentElement.lang = lang;
}

document.addEventListener("DOMContentLoaded", () => {
    loadTranslations();

    const btn = document.getElementById("translate-btn");
    //console.log(btn);
    if (btn) {
        btn.addEventListener("click", () => {
            const newLang = langStorage.toggle();
            applyTranslations(newLang);
            console.log("\n");
        });
    }
});
