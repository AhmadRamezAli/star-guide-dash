import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Search } from "lucide-react";

// Layout & UI
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { QueryState } from "@/components/dashboard/QueryState"; // Removed useApiConfigured
import { PredictionDialog } from "@/components/dashboard/PredictionDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18n, type TranslationKey } from "@/lib/i18n";

// Domain Services & Types
import { getPredictions } from "@/services/prediction-service";
import { PredictionDto } from "@/types/prediction";
import { TimeUnits, ZodiacSign } from "@/types/enums";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "Predictions — Zodiac Sign Admin" },
      { name: "description", content: "Publish and manage daily, weekly, monthly and yearly zodiac predictions." },
    ],
  }),
  component: PredictionsPage,
});

const PAGE_SIZE = 10;

function PredictionsPage() {
  const { t, lang } = useI18n();
  const [keyword, setKeyword] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [date, setDate] = React.useState("");
  const [timeUnit, setTimeUnit] = React.useState<string>("all");
  const [zodiacSign, setZodiacSign] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState("desc");
  const [pageNumber, setPageNumber] = React.useState(1);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(keyword);
      setPageNumber(1);
    }, 350);
    return () => clearTimeout(id);
  }, [keyword]);

  // 1. Direct integration with the API service
  const list = useQuery({
    queryKey: ["predictions", { debounced, date, timeUnit, zodiacSign, sortBy, pageNumber }],
    queryFn: () => getPredictions.getAll({
      ...(debounced ? { keyword: debounced } : {}),
      ...(date ? { date: new Date(`${date}T00:00:00Z`).toISOString() } : {}),
      // Convert UI strings back to integers for the backend
      ...(timeUnit !== "all" ? { timeUnit: Number(timeUnit) } : {}),
      ...(zodiacSign !== "all" ? { zodiacSign: Number(zodiacSign) } : {}),
      sortBy,
      pageNumber,
      pageSize: PAGE_SIZE,
    }),
  });

  // 2. Fetch single entity for editing
  const editing = useQuery({ 
    queryKey: ["prediction-detail", editingId],
    queryFn: () => getPredictions.getById(editingId!),
    enabled: !!editingId 
  });
  
  // 3. Extract the array from the C# ApiResult wrapper
  const rows = list.data?.value ?? [];

  const resetFilters = () => {
    setKeyword("");
    setDate("");
    setTimeUnit("all");
    setZodiacSign("all");
    setPageNumber(1);
  };

  return (
    <>
      <PageHeader
        title={t("prediction.title")}
        subtitle={t("prediction.subtitle")}
        action={
          <Button
            className="gap-2"
            onClick={() => {
              setEditingId(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="size-4" />
            {t("prediction.new")}
          </Button>
        }
      />

      <div className="panel mb-6 grid gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_160px_150px_170px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t("common.search")}
            className="ps-9"
          />
        </div>
        <Input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setPageNumber(1);
          }}
        />
        <Select
          value={timeUnit}
          onValueChange={(v) => {
            setTimeUnit(v);
            setPageNumber(1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("prediction.timeUnit")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            {/* Safe Typescript Enum Mapping */}
            {Object.entries(TimeUnits)
              .filter(([key]) => isNaN(Number(key)))
              .map(([key, val]) => (
                <SelectItem key={val} value={val.toString()}>
                  {t(`unit.${key}` as TranslationKey)}
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={zodiacSign}
          onValueChange={(v) => {
            setZodiacSign(v);
            setPageNumber(1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("prediction.zodiac")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
             {/* Safe Typescript Enum Mapping */}
             {Object.entries(ZodiacSign)
              .filter(([key]) => isNaN(Number(key)))
              .map(([key, val]) => (
                <SelectItem key={val} value={val.toString()}>
                  {t(`sign.${key}` as TranslationKey)}
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" onClick={resetFilters}>
          {t("common.reset")}
        </Button>
      </div>

      <QueryState
        isLoading={list.isLoading}
        error={list.error}
        isEmpty={rows.length === 0}
        onRetry={() => list.refetch()}
      >
        <div className="panel overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start">{t("prediction.date")}</TableHead>
                <TableHead className="text-start">{t("prediction.zodiac")}</TableHead>
                <TableHead className="text-start">{t("prediction.timeUnit")}</TableHead>
                <TableHead className="text-start">{t("prediction.summary")}</TableHead>
                <TableHead className="text-end">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(p.date).toLocaleDateString(lang === "ar" ? "ar" : "en-GB")}
                  </TableCell>
                  <TableCell>
                    {/* Reverse map the integer back to the string key for translation */}
                    <Badge variant="secondary">{t(`sign.${ZodiacSign[p.zodiacSign]}` as TranslationKey)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{t(`unit.${TimeUnits[p.timeUnit]}` as TranslationKey)}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[28rem] truncate">{p.summary}</TableCell>
                  <TableCell className="text-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={t("common.edit")}
                      onClick={() => {
                        setEditingId(p.id);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

      <PredictionDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingId(null);
        }}
        // 4. Safely extract the single entity value
        prediction={editingId ? ((editing.data?.value as PredictionDto | undefined) ?? null) : null}
      />
    </>
  );
}