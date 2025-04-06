// /scripts/lang/storage.js
export const langStorage = {
    key: "preferredLang",
    get: () => localStorage.getItem("preferredLang") || "en",
    set: (lang) => localStorage.setItem("preferredLang", lang),
    toggle: () => {
        const newLang = langStorage.get() === "en" ? "th" : "en";
        langStorage.set(newLang);
        return newLang;
    }
};
