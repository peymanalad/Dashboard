import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import fa from 'locales/fa/translation.json';
import {isEnLocale} from 'utils';

const isEn = isEnLocale();
const languageDetector: any = {
  type: 'languageDetector',
  async: true,
  detect: (cb: any) => cb(isEn ? 'en' : 'fa'),
  init: () => {},
  cacheUserLanguage: () => {}
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    lng: 'fa',
    fallbackLng: 'fa',
    debug: process.env.NODE_ENV === 'development',
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false // not needed for react!!
    },
    resources: {
      fa
    }
  });

export default i18n;
