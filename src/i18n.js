import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            "Product Name": "Product Name",
            "Lot Number": "Lot Number",
            "Submit": "Submit"
        }
    },
    th: {
        translation: {
            "Product Name": "ผลิตภัณฑ์",
            "Lot Number": "เลขล็อต",
            "Submit": "ค้นหา"
        }
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'en',
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;