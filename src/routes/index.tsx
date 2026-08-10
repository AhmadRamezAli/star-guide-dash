import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Stars, Star, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { QueryState } from "@/components/dashboard/QueryState";
import { Badge } from "@/components/ui/badge";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { forecastersQuery, predictionsQuery } from "@/lib/api/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Zodiac Sign Admin" },
      {
        name: "description",
        content: "Overview of zodiac forecasters, ratings and the latest published predictions.",
      },
      { property: "og:title", content: "Overview — Zodiac Sign Admin" },
      {
        property: "og:description",
        content: "Overview of zodiac forecasters, ratings and the latest published predictions.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { t, lang } = useI18n();
  const forecasters = useQuery(forecastersQuery({ pageNumber: 1, pageSize: 100 }));
  const predictions = useQuery(predictionsQuery({ pageNumber: 1, pageSize: 10, sortBy: "desc" }));

  const rates = (forecasters.data ?? []).map((f) => f.rate ?? 0).filter((r) => r > 0);
  const avg = rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : 0;

  return (
    <>
      <PageHeader title={t("overview.title")} subtitle={t("overview.subtitle")} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Users className="size-5" />}
          label="overview.forecasters"
          value={String(forecasters.data?.length ?? 0)}
        />
        <StatCard
          icon={<Stars className="size-5" />}
          label="overview.predictions"
          value={String(predictions.data?.length ?? 0)}
        />
        <StatCard
          icon={<Star className="size-5" />}
          label="overview.avgRate"
          value={avg ? avg.toFixed(1) : "—"}
        />
      </div>

      <h2 className="mt-10 mb-4 font-display text-2xl font-semibold">{t("overview.latest")}</h2>
      <QueryState
        isLoading={predictions.isLoading}
        error={predictions.error}
        isEmpty={(predictions.data ?? []).length === 0}
        onRetry={() => predictions.refetch()}
      >
        <ul className="grid gap-3">
          {(predictions.data ?? []).map((p) => (
            <li key={p.id} className="panel flex flex-col gap-2 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{t(`sign.${p.zodiacSign}` as TranslationKey)}</Badge>
                <Badge variant="outline">{t(`unit.${p.timeUnit}` as TranslationKey)}</Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(p.date).toLocaleDateString(lang === "ar" ? "ar" : "en-GB")}
                </span>
              </div>
              <p className="text-sm">{p.summary}</p>
            </li>
          ))}
        </ul>
      </QueryState>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/forecasters"
          className="rounded-full border border-border px-4 py-2 text-sm hover:bg-accent"
        >
          {t("nav.forecasters")}
        </Link>
        <Link
          to="/predictions"
          className="rounded-full border border-border px-4 py-2 text-sm hover:bg-accent"
        >
          {t("nav.predictions")}
        </Link>
      </div>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: TranslationKey;
  value: string;
}) {
  const { t } = useI18n();
  return (
    <div className="panel flex items-center gap-4 p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-gold text-primary-foreground">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs tracking-wide text-muted-foreground uppercase">{t(label)}</p>
        <p className="font-display text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
