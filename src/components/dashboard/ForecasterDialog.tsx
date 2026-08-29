// components/dashboard/ForecasterDialog.tsx
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImagePicker } from "@/components/ui/image-picker";
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
import { ForcastorDto, ForcastorCreateOrUpdateDto } from "../../types/forcastor";
import { updateForcastor, createForcastor } from "../../services/forcastor-service";

const schema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(2).max(2000),
  imageFile: z.instanceof(File).optional().nullable(),
  rate: z.coerce.number().min(1).max(5),
});

type FormValues = z.infer<typeof schema>;

export function ForecasterDialog({
  open,
  onOpenChange,
  forcastor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forcastor?: ForcastorDto | null;
}) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const isEdit = !!forcastor?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", imageFile: null, rate: 3 },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset({
      name: forcastor?.name ?? "",
      description: forcastor?.description ?? "",
      imageFile: null, // Always starts null. Only populated if user selects a new file.
      rate: forcastor?.rate ?? 3,
    });
  }, [open, forcastor, form]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload: ForcastorCreateOrUpdateDto = {
        id: isEdit ? forcastor!.id : null,
        name: values.name.trim(),
        description: values.description.trim(),
        imageFile: values.imageFile,
        rate: values.rate,
      };
      return isEdit ? updateForcastor(payload) : createForcastor(payload);
    },
    onSuccess: () => {
      toast.success(t("common.saved"));
      queryClient.invalidateQueries({ queryKey: ["forcastors"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      const backendMessage = error.response?.data?.message;
      toast.error(backendMessage || t("common.error"));
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
            <Input id="name" {...form.register("name")} disabled={mutation.isPending} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t("forecaster.description")}</Label>
            <Textarea 
              id="description" 
              rows={4} 
              {...form.register("description")} 
              disabled={mutation.isPending} 
            />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_120px]">
            <div className="space-y-2">
              <Label>
                {t("forecaster.imagePath")} <span className="text-xs text-muted-foreground">({t("common.optional")})</span>
              </Label>
              
              <ImagePicker 
                // Pass the current selected file, OR the existing string from the database
                value={form.watch("imageFile") || forcastor?.imagePath || null} 
                onChange={(file) => form.setValue("imageFile", file, { shouldValidate: true })}
                disabled={mutation.isPending}
              />
              
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">{t("forecaster.rate")}</Label>
              <Input 
                id="rate" 
                type="number" 
                min={1} 
                max={5} 
                step={1} 
                {...form.register("rate")} 
                disabled={mutation.isPending} 
              />
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