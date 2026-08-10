import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Settings, Sparkles, Stars, Users } from "lucide-react";
import type { ReactNode } from "react";
import { LanguageControls } from "./LanguageControls";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const nav: { to: string; label: TranslationKey; icon: typeof Users }[] = [
  { to: "/", label: "nav.overview", icon: LayoutDashboard },
  { to: "/forecasters", label: "nav.forecasters", icon: Users },
  { to: "/predictions", label: "nav.predictions", icon: Stars },
  { to: "/settings", label: "nav.settings", icon: Settings },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background bg-celestial text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-gold text-primary-foreground shadow-glow">
              <Sparkles className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-lg leading-tight font-semibold tracking-tight">
                {t("app.name")}
              </span>
              <span className="block truncate text-xs text-muted-foreground">{t("app.admin")}</span>
            </span>
          </Link>
          <LanguageControls />
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-2 pb-2 sm:px-5">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              <item.icon className="size-4" />
              {t(item.label)}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
