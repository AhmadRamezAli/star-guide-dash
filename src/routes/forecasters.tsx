import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Search, Star } from "lucide-react";

// Layout & UI
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { QueryState } from "@/components/dashboard/QueryState"; // Removed useApiConfigured
import { ForecasterDialog } from "@/components/dashboard/ForecasterDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";

// New Infrastructure Imports
import { useForcastorList } from "@/hooks/use-forcastor"; // Adjust path if needed
import { getForcastors } from "@/services/forcastor-service"; 
import { ForcastorDto } from "@/types/forcastor"; // Corrected spelling to Forcastor

export const Route = createFileRoute("/forecasters")({
  head: () => ({
    meta: [
      { title: "Forecasters — Zodiac Sign Admin" },
      { name: "description", content: "Create, edit and search the astrologers of your platform." },
    ],
  }),
  component: ForecastersPage,
});

const PAGE_SIZE = 12;

function ForecastersPage() {
  const { t } = useI18n();
  const [keyword, setKeyword] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [rate, setRate] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState("asc");
  const [pageNumber, setPageNumber] = React.useState(1);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Debounce logic to prevent spamming the backend on every keystroke
  React.useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(keyword);
      setPageNumber(1);
    }, 350);
    return () => clearTimeout(id);
  }, [keyword]);

  // 1. Replaced raw useQuery with your custom Domain Hook
  const list = useForcastorList({
    ...(debounced ? { keyword: debounced } : {}),
    ...(rate !== "all" ? { rate: Number(rate) } : {}),
    sortBy,
    pageNumber,
    pageSize: PAGE_SIZE,
  });

  // 2. Fetch single entity for editing directly via the service
  const editing = useQuery({
    queryKey: ["forcastor-detail", editingId],
    queryFn: () => getForcastors.getById(editingId!),
    enabled: !!editingId, // Only fires when a specific ID is selected
  });

  const openCreate = () => {
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setDialogOpen(true);
  };

  // 3. Extract the array from your standardized C# ApiResult wrapper
  const rows = list.data?.value ?? [];

  return (
    <>
      <PageHeader
        title={t("forecaster.title")}
        subtitle={t("forecaster.subtitle")}
        action={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="size-4" />
            {t("forecaster.new")}
          </Button>
        }
      />

      <div className="panel mb-6 grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_150px_150px]">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t("common.search")}
            className="ps-9"
          />
        </div>
        <Select
          value={rate}
          onValueChange={(value) => {
            setRate(value);
            setPageNumber(1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("forecaster.rate")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            {[1, 2, 3, 4, 5].map((r) => (
              <SelectItem key={r} value={String(r)}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder={t("common.sort")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">{t("sort.asc")}</SelectItem>
            <SelectItem value="desc">{t("sort.desc")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <QueryState
        isLoading={list.isLoading}
        error={list.error}
        isEmpty={rows.length === 0}
        onRetry={() => list.refetch()}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((f) => (
            <div key={f.id} className="panel flex items-center gap-4 p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary font-display text-lg">
                {f.name?.charAt(0)?.toUpperCase() ?? "?"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{f.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3 text-primary" />
                  {f.rate ?? "—"}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                aria-label={t("common.edit")}
                onClick={() => openEdit(f.id)}
              >
                <Pencil className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </QueryState>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
        >
          {t("common.prev")}
        </Button>
        <span className="text-sm text-muted-foreground">
          {t("common.page")} {pageNumber}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={rows.length < PAGE_SIZE}
          onClick={() => setPageNumber((p) => p + 1)}
        >
          {t("common.next")}
        </Button>
      </div>

      <ForecasterDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingId(null);
        }}
        // 4. Safely extract the single entity value for the dialog
        forcastor={editingId ? ((editing.data?.value as ForcastorDto | undefined) ?? null) : null}
      />
    </>
  );
}