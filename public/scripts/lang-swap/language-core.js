export const languageManager = {
    applyTranslation(dictionary, langKey) {
      const data = dictionary[langKey];
      for (const id in data) {
        const el = document.getElementById(id);
        if (el) el.textContent = data[id];
      }
    }
  };