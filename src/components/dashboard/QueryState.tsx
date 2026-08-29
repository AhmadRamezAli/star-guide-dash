import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type { ReactNode } from "react";

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
  children: ReactNode;
}) {
  const { t } = useI18n();

  // 1. Handle Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="size-8 animate-spin" />
        <p>{t("common.loading")}</p>
      </div>
    );
  }

  // 2. Handle API Errors
  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-destructive">
        <AlertCircle className="size-8" />
        <p>{error instanceof Error ? error.message : t("common.error")}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            {t("common.retry")}
          </Button>
        )}
      </div>
    );
  }

  // 3. Handle Empty Results
  if (isEmpty) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-muted-foreground">
        <p>{t("common.noResults") ?? "No data found."}</p>
      </div>
    );
  }

  // 4. Render Data Successfully (This bypasses the old API Link screen)
  return <>{children}</>;
}   