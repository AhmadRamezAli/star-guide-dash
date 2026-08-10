import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { getApiBase, setApiBase } from "@/lib/api/client";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Zodiac Sign Admin" },
      { name: "description", content: "Point the admin dashboard at your Forcasting API." },
      { property: "og:title", content: "Settings — Zodiac Sign Admin" },
      {
        property: "og:description",
        content: "Point the admin dashboard at your Forcasting API.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t } = useI18n();
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    setValue(getApiBase());
  }, []);

  return (
    <>
      <PageHeader title={t("settings.title")} subtitle={t("settings.subtitle")} />
      <form
        className="panel max-w-2xl space-y-4 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setApiBase(value.trim());
          toast.success(t("common.saved"));
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="apiBase">{t("settings.apiBase")}</Label>
          <Input
            id="apiBase"
            dir="ltr"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://localhost:7001"
          />
          <p className="text-xs text-muted-foreground">{t("settings.apiHint")}</p>
        </div>
        <Button type="submit">{t("common.save")}</Button>
      </form>
    </>
  );
}
