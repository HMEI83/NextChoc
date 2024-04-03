/**
 * 多语言
 */


import { I18n } from "i18n-js";
import zh from "./zh";
import en from "./en";


const i18n = new I18n({
  en,
  zh,
});

export function strings(name, params = {}) {
  return I18n.t(name, params);
}

////////console.log(i18n.locale);
// i18n.locale = getLocales()[0].languageCode;
i18n.enableFallback = true;
export default i18n;
