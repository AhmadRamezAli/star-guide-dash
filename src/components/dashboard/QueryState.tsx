import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, PlugZap, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { getApiBase } from "@/lib/api/client";

/** True once hydrated and an API base URL is configured. */
export function useApiConfigured() {
  const [state, setState] = React.useState<"unknown" | "yes" | "no">("unknown");
  React.useEffect(() => {
    setState(getApiBase() ? "yes" : "no");
  }, []);
  return state;
}

export function QueryState({
  isLoading,
  error,
  isEmpty,
  onRetry,
  children,
}: {
  isLoading: boolean;
  error: unknown;
  isEmpty?: boolean;
  onRetry?: () => void;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const configured = useApiConfigured();

  if (configured === "no") {
    return (
      <div className="panel flex flex-col items-center gap-3 p-12 text-center">
        <PlugZap className="size-6 text-primary" />
        <p className="text-sm font-medium">{t("settings.apiBase")}</p>
        <p className="max-w-md text-xs text-muted-foreground">{t("settings.apiHint")}</p>
        <Button asChild size="sm" variant="outline">
          <Link to="/settings">{t("nav.settings")}</Link>
        </Button>
      </div>
    );
  }

  if (isLoading || configured === "unknown") {
    return (
      <div className="panel flex items-center justify-center gap-3 p-12 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        {t("common.loading")}
      </div>
    );
  }

  if (error) {
    const message = error instanceof Error ? error.message : String(error);
    return (
      <div className="panel flex flex-col items-center gap-3 p-12 text-center">
        <TriangleAlert className="size-6 text-destructive" />
        <p className="text-sm font-medium">{t("common.error")}</p>
        <p className="max-w-lg text-xs break-words text-muted-foreground">{message}</p>
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            {t("common.retry")}
          </Button>
        ) : null}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="panel p-12 text-center text-sm text-muted-foreground">
        {t("common.empty")}
      </div>
    );
  }

  return <>{children}</>;
}
