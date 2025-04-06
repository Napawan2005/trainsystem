// /scripts/lang/i18n.js
import { langStorage } from "./storage.js";

let translations = {};

export async function loadTranslations() {
    const res = await fetch("/lang-swap-data/lang.json");
    translations = await res.json();
    console.log("translate = " + translations);
    console.log("res " + res);
    console.log("langstorage = " + langStorage.get());
    applyTranslations(langStorage.get());
}

export function applyTranslations(lang) {
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
    let newLang = langStorage.toggle();
    loadTranslations();
    applyTranslations(newLang);
    const btn = document.getElementById("translate-btn");
    //console.log(btn);
    if (btn) {
        btn.addEventListener("click", () => {
            newLang = langStorage.toggle();
            applyTranslations(newLang);
            console.log("\n");
        });
    }
});
