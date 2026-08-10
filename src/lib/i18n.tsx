import * as React from "react";

export type Lang = "en" | "ar";
export type Dir = "ltr" | "rtl";

const dict = {
  en: {
    "app.name": "Zodiac Sign",
    "app.admin": "Admin Dashboard",
    "nav.overview": "Overview",
    "nav.forecasters": "Forecasters",
    "nav.predictions": "Predictions",
    "nav.settings": "Settings",
    "lang.label": "Language",
    "common.search": "Search",
    "common.create": "Create",
    "common.edit": "Edit",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.loading": "Loading…",
    "common.empty": "Nothing here yet",
    "common.error": "Something went wrong",
    "common.retry": "Retry",
    "common.actions": "Actions",
    "common.page": "Page",
    "common.prev": "Previous",
    "common.next": "Next",
    "common.all": "All",
    "common.optional": "optional",
    "common.saved": "Saved successfully",
    "common.filters": "Filters",
    "common.reset": "Reset",
    "common.sort": "Sort",
    "sort.asc": "Ascending",
    "sort.desc": "Descending",
    "overview.title": "Overview",
    "overview.subtitle": "Manage forecasters and their zodiac predictions.",
    "overview.forecasters": "Forecasters on this page",
    "overview.predictions": "Predictions on this page",
    "overview.avgRate": "Average rating",
    "overview.latest": "Latest predictions",
    "forecaster.title": "Forecasters",
    "forecaster.subtitle": "Astrologers publishing predictions.",
    "forecaster.new": "New forecaster",
    "forecaster.edit": "Edit forecaster",
    "forecaster.name": "Name",
    "forecaster.description": "Description",
    "forecaster.imagePath": "Image URL",
    "forecaster.rate": "Rating",
    "prediction.title": "Predictions",
    "prediction.subtitle": "Daily, weekly, monthly and yearly readings.",
    "prediction.new": "New prediction",
    "prediction.edit": "Edit prediction",
    "prediction.forecaster": "Forecaster",
    "prediction.date": "Date",
    "prediction.summary": "Summary",
    "prediction.description": "Description",
    "prediction.timeUnit": "Time unit",
    "prediction.zodiac": "Zodiac sign",
    "settings.title": "Settings",
    "settings.subtitle": "Connect the dashboard to your API.",
    "settings.apiBase": "API base URL",
    "settings.apiHint": "Example: https://localhost:7001 — requests go to /api/Forcastor and /api/Prediction.",
    "unit.Day": "Day",
    "unit.Week": "Week",
    "unit.Month": "Month",
    "unit.Year": "Year",
    "sign.Aries": "Aries",
    "sign.Taurus": "Taurus",
    "sign.Gemini": "Gemini",
    "sign.Cancer": "Cancer",
    "sign.Leo": "Leo",
    "sign.Virgo": "Virgo",
    "sign.Libra": "Libra",
    "sign.Scorpio": "Scorpio",
    "sign.Sagittarius": "Sagittarius",
    "sign.Capricorn": "Capricorn",
    "sign.Aquarius": "Aquarius",
    "sign.Pisces": "Pisces",
  },
  ar: {
    "app.name": "الأبراج",
    "app.admin": "لوحة التحكم",
    "nav.overview": "نظرة عامة",
    "nav.forecasters": "المنجّمون",
    "nav.predictions": "التوقعات",
    "nav.settings": "الإعدادات",
    "lang.label": "اللغة",
    "common.search": "بحث",
    "common.create": "إضافة",
    "common.edit": "تعديل",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.delete": "حذف",
    "common.loading": "جارٍ التحميل…",
    "common.empty": "لا توجد بيانات",
    "common.error": "حدث خطأ ما",
    "common.retry": "إعادة المحاولة",
    "common.actions": "إجراءات",
    "common.page": "صفحة",
    "common.prev": "السابق",
    "common.next": "التالي",
    "common.all": "الكل",
    "common.optional": "اختياري",
    "common.saved": "تم الحفظ بنجاح",
    "common.filters": "تصفية",
    "common.reset": "إعادة تعيين",
    "common.sort": "ترتيب",
    "sort.asc": "تصاعدي",
    "sort.desc": "تنازلي",
    "overview.title": "نظرة عامة",
    "overview.subtitle": "إدارة المنجّمين وتوقعات الأبراج.",
    "overview.forecasters": "المنجّمون في هذه الصفحة",
    "overview.predictions": "التوقعات في هذه الصفحة",
    "overview.avgRate": "متوسط التقييم",
    "overview.latest": "أحدث التوقعات",
    "forecaster.title": "المنجّمون",
    "forecaster.subtitle": "المنجّمون الذين ينشرون التوقعات.",
    "forecaster.new": "منجّم جديد",
    "forecaster.edit": "تعديل المنجّم",
    "forecaster.name": "الاسم",
    "forecaster.description": "الوصف",
    "forecaster.imagePath": "رابط الصورة",
    "forecaster.rate": "التقييم",
    "prediction.title": "التوقعات",
    "prediction.subtitle": "توقعات يومية وأسبوعية وشهرية وسنوية.",
    "prediction.new": "توقع جديد",
    "prediction.edit": "تعديل التوقع",
    "prediction.forecaster": "المنجّم",
    "prediction.date": "التاريخ",
    "prediction.summary": "الملخص",
    "prediction.description": "التفاصيل",
    "prediction.timeUnit": "الوحدة الزمنية",
    "prediction.zodiac": "البرج",
    "settings.title": "الإعدادات",
    "settings.subtitle": "اربط لوحة التحكم بواجهة الـ API.",
    "settings.apiBase": "رابط الـ API",
    "settings.apiHint": "مثال: https://localhost:7001 — الطلبات تُرسل إلى /api/Forcastor و /api/Prediction.",
    "unit.Day": "يوم",
    "unit.Week": "أسبوع",
    "unit.Month": "شهر",
    "unit.Year": "سنة",
    "sign.Aries": "الحمل",
    "sign.Taurus": "الثور",
    "sign.Gemini": "الجوزاء",
    "sign.Cancer": "السرطان",
    "sign.Leo": "الأسد",
    "sign.Virgo": "العذراء",
    "sign.Libra": "الميزان",
    "sign.Scorpio": "العقرب",
    "sign.Sagittarius": "القوس",
    "sign.Capricorn": "الجدي",
    "sign.Aquarius": "الدلو",
    "sign.Pisces": "الحوت",
  },
} as const;

export type TranslationKey = keyof (typeof dict)["en"];

type I18nValue = {
  lang: Lang;
  dir: Dir;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = React.createContext<I18nValue | null>(null);

const LANG_KEY = "zodiac.lang";

const dirFor = (lang: Lang): Dir => (lang === "ar" ? "rtl" : "ltr");

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("en");
  const dir = dirFor(lang);

  // Read persisted preference after hydration to avoid SSR mismatches.
  React.useEffect(() => {
    const storedLang = localStorage.getItem(LANG_KEY) as Lang | null;
    if (storedLang === "ar" || storedLang === "en") setLangState(storedLang);
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem(LANG_KEY, next);
  }, []);

  const t = React.useCallback(
    (key: TranslationKey) => dict[lang][key] ?? dict.en[key] ?? key,
    [lang],
  );

  const value = React.useMemo(() => ({ lang, dir, setLang, t }), [lang, dir, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
