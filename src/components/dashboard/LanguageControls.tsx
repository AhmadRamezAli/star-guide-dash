import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useEffect } from "react";
const SUPPORTED_LANGS = ["en", "ar"] as const;

export function LanguageControls() {
  const { lang, setLang, t } = useI18n();
useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);
  return (
    <div className="flex shrink-0 items-center gap-2">
      <div
        className="flex items-center gap-1 rounded-full border border-border/70 bg-card/60 p-1"
        aria-label={t("lang.label")}
      >
        {SUPPORTED_LANGS.map((code) => (
          <Button
            key={code}
            size="sm"
            variant={lang === code ? "secondary" : "ghost"}
            className="h-7 rounded-full px-3 text-xs font-semibold"
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
          >
            {code === "en" ? "EN" : "ع"}
          </Button>
        ))}
      </div>
    </div>
  );
}