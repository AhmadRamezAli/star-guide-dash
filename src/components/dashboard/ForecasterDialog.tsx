import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useI18n } from "@/lib/i18n";
import { createForecaster, forecasterKeys, updateForecaster } from "@/lib/api/queries";
import type { ForecasterDto } from "@/lib/api/types";

const schema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(2).max(2000),
  imagePath: z.string().max(500).optional().or(z.literal("")),
  rate: z.coerce.number().min(1).max(5),
});

type FormValues = z.infer<typeof schema>;

export function ForecasterDialog({
  open,
  onOpenChange,
  forecaster,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forecaster?: ForecasterDto | null;
}) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const isEdit = !!forecaster?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", imagePath: "", rate: 3 },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset({
      name: forecaster?.name ?? "",
      description: forecaster?.description ?? "",
      imagePath: forecaster?.imagePath ?? "",
      rate: forecaster?.rate ?? 3,
    });
  }, [open, forecaster, form]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      // create -> no id in payload; update -> id included.
      const payload = {
        name: values.name.trim(),
        description: values.description.trim(),
        imagePath: values.imagePath?.trim() || "",
        rate: values.rate,
      };
      return isEdit
        ? updateForecaster({ ...payload, id: forecaster!.id })
        : createForecaster(payload);
    },
    onSuccess: () => {
      toast.success(t("common.saved"));
      queryClient.invalidateQueries({ queryKey: forecasterKeys.all });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : t("common.error"));
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle className="font-display text-2xl">
            {isEdit ? t("forecaster.edit") : t("forecaster.new")}
          </DialogTitle>
          <DialogDescription>{t("forecaster.subtitle")}</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <div className="space-y-2">
            <Label htmlFor="name">{t("forecaster.name")}</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t("forecaster.description")}</Label>
            <Textarea id="description" rows={4} {...form.register("description")} />
            {form.formState.errors.description ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_120px]">
            <div className="space-y-2">
              <Label htmlFor="imagePath">
                {t("forecaster.imagePath")}{" "}
                <span className="text-xs text-muted-foreground">({t("common.optional")})</span>
              </Label>
              <Input id="imagePath" placeholder="https://…" {...form.register("imagePath")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">{t("forecaster.rate")}</Label>
              <Input id="rate" type="number" min={1} max={5} step={1} {...form.register("rate")} />
            </div>
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
