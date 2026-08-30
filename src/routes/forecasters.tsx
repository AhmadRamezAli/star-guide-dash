import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { getImageUrl } from "../lib/utils";
import { showToast } from "@/components/ui/app-toast";

// Layout & UI
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { QueryState } from "@/components/dashboard/QueryState"; 
import { ForecasterDialog } from "@/components/dashboard/ForecasterDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// New Infrastructure Imports
import { useForcastorList } from "@/hooks/use-forcastor"; 
import { getForcastors, deleteForcastor } from "@/services/forcastor-service"; 
import { ForcastorDto } from "@/types/forcastor"; 

export const Route = createFileRoute("/forecasters")({
  head: () => ({
    meta: [
      { title: "Forecasters — Zodiac Sign Admin" },
      { name: "description", content: "Create, edit and search the astrologers of your platform." },
    ],
  }),
  component: () => <ForecastersPage />,
});

const PAGE_SIZE = 12;

export function ForecastersPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  
  // State
  const [keyword, setKeyword] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [rate, setRate] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState("asc");
  const [pageNumber, setPageNumber] = React.useState(1);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Debounce logic
  React.useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(keyword);
      setPageNumber(1);
    }, 350);
    return () => clearTimeout(id);
  }, [keyword]);

  // Data Fetching
  const list = useForcastorList({
    ...(debounced ? { keyword: debounced } : {}),
    ...(rate !== "all" ? { rate: Number(rate) } : {}),
    sortBy,
    pageNumber,
    pageSize: PAGE_SIZE,
  });

  const editing = useQuery({
    queryKey: ["forcastor-detail", editingId],
    queryFn: () => getForcastors.getById(editingId!),
    enabled: !!editingId, 
  });

  // Deletion Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteForcastor(id),
    onSuccess: () => {
      showToast.success(t("common.deleted") ?? "Deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["forcastors"] });
    },
    onError: (error: any) => {
      const backendMessage = error.response?.data?.message;
      showToast.error(t("common.error") ?? "Error", backendMessage);
    },
  });

  const openCreate = () => {
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setDialogOpen(true);
  };

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
              <div className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-secondary font-display text-lg">
                {f.imageName ? (
                  <img 
                    src={getImageUrl(f.imageName)} 
                    alt={f.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span>{f.name?.charAt(0)?.toUpperCase() ?? "?"}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{f.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3 text-primary" />
                  {f.rate ?? "—"}
                </p>
              </div>
              
              {/* Grouped Actions */}
              <div className="flex shrink-0 gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={t("common.edit")}
                  onClick={() => openEdit(f.id)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  aria-label={t("common.delete")}
                  disabled={deleteMutation.isPending}
                  onClick={() => setDeletingId(f.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
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
        forcastor={editingId ? ((editing.data?.value as ForcastorDto | undefined) ?? null) : null}
      />

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader className="text-start">
            <AlertDialogTitle>
              {t("common.confirmDelete") ?? "Are you absolutely sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the forecaster from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              {t("common.cancel") ?? "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault(); 
                if (deletingId) {
                  deleteMutation.mutate(deletingId, {
                    onSettled: () => setDeletingId(null) 
                  });
                }
              }}
            >
              {t("common.delete") ?? "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}