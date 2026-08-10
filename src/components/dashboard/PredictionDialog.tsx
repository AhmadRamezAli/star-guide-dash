import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import {
  createPrediction,
  forecastersQuery,
  predictionKeys,
  updatePrediction,
} from "@/lib/api/queries";
import { TIME_UNITS, ZODIAC_SIGNS } from "@/lib/api/types";
import type { PredictionDto, TimeUnit, ZodiacSign } from "@/lib/api/types";

const schema = z.object({
  forcastorId: z.string().uuid(),
  date: z.string().min(1),
  summary: z.string().min(2).max(300),
  description: z.string().min(2).max(4000),
  timeUnit: z.enum(TIME_UNITS),
  zodiacSign: z.enum(ZODIAC_SIGNS),
});

type FormValues = z.infer<typeof schema>;

function toDateInput(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? new Date().toISOString().slice(0, 10)
    : d.toISOString().slice(0, 10);
}

export function PredictionDialog({
  open,
  onOpenChange,
  prediction,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prediction?: PredictionDto | null;
}) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const isEdit = !!prediction?.id;
  const forecasters = useQuery(forecastersQuery({ pageNumber: 1, pageSize: 200 }));

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      forcastorId: "",
      date: toDateInput(),
      summary: "",
      description: "",
      timeUnit: "Day",
      zodiacSign: "Aries",
    },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset({
      forcastorId: prediction?.forcastorId ?? "",
      date: toDateInput(prediction?.date),
      summary: prediction?.summary ?? "",
      description: prediction?.description ?? "",
      timeUnit: (prediction?.timeUnit as TimeUnit) ?? "Day",
      zodiacSign: (prediction?.zodiacSign as ZodiacSign) ?? "Aries",
    });
  }, [open, prediction, form]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        forcastorId: values.forcastorId,
        date: new Date(`${values.date}T00:00:00Z`).toISOString(),
        summary: values.summary.trim(),
        description: values.description.trim(),
        timeUnit: values.timeUnit,
        zodiacSign: values.zodiacSign,
      };
      return isEdit ? updatePrediction({ ...payload, id: prediction!.id }) : createPrediction(payload);
    },
    onSuccess: () => {
      toast.success(t("common.saved"));
      queryClient.invalidateQueries({ queryKey: predictionKeys.all });
      onOpenChange(false);
    },
    onError: (error: unknown) =>
      toast.error(error instanceof Error ? error.message : t("common.error")),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-start">
          <DialogTitle className="font-display text-2xl">
            {isEdit ? t("prediction.edit") : t("prediction.new")}
          </DialogTitle>
          <DialogDescription>{t("prediction.subtitle")}</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("prediction.forecaster")}</Label>
              <Select
                value={form.watch("forcastorId")}
                onValueChange={(value) =>
                  form.setValue("forcastorId", value, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("prediction.forecaster")} />
                </SelectTrigger>
                <SelectContent>
                  {(forecasters.data ?? []).map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.forcastorId ? (
                <p className="text-xs text-destructive">{t("prediction.forecaster")}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">{t("prediction.date")}</Label>
              <Input id="date" type="date" {...form.register("date")} />
            </div>
            <div className="space-y-2">
              <Label>{t("prediction.timeUnit")}</Label>
              <Select
                value={form.watch("timeUnit")}
                onValueChange={(value) => form.setValue("timeUnit", value as TimeUnit)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {t(`unit.${unit}` as const)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("prediction.zodiac")}</Label>
              <Select
                value={form.watch("zodiacSign")}
                onValueChange={(value) => form.setValue("zodiacSign", value as ZodiacSign)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ZODIAC_SIGNS.map((sign) => (
                    <SelectItem key={sign} value={sign}>
                      {t(`sign.${sign}` as const)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">{t("prediction.summary")}</Label>
            <Input id="summary" {...form.register("summary")} />
            {form.formState.errors.summary ? (
              <p className="text-xs text-destructive">{form.formState.errors.summary.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="pdescription">{t("prediction.description")}</Label>
            <Textarea id="pdescription" rows={6} {...form.register("description")} />
            {form.formState.errors.description ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
