import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

// Import or define your translation files
import en from "./locales/en_final_checked.json";
import fr from "./locales/fr_final_checked.json";
import ja from "./locales/ja_final_checked.json";
import nb from "./locales/nb_final_checked.json";
import de from "./locales/de_final_checked.json";
import it from "./locales/it_final_checked.json";
import mn from "./locales/mn_final_checked.json";
import sv from "./locales/sv_final_checked.json";
import es from "./locales/es_final_checked.json";

// Set the key-value pairs for the different languages you want to support.
const translations = {
  en,
  fr,
  ja,
  es,
  nb,
  sv,
  de,
  it,
  mn,
};

const i18n = new I18n(translations);

// Fallback to English if user’s locale isn’t found
i18n.enableFallback = true;

// You can explicitly set a default locale (optional)
i18n.defaultLocale = "en";

// Detect the current locale automatically (e.g., "en", "fr", "en-GB", etc.)
i18n.locale = getLocales()[0].languageCode;

export default i18n;
