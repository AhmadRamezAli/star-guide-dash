// components/dashboard/ForecasterDialog.tsx
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { showToast } from "@/components/ui/app-toast";
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
import { getImageUrl } from "@/lib/utils"; // Ensure this is imported
import { ForcastorDto, ForcastorCreateOrUpdateDto } from "../../types/forcastor";
import { updateForcastor, createForcastor } from "../../services/forcastor-service";

const schema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(2).max(2000),
  imageFile: z.any().optional().nullable(),
  rate: z.coerce.number().min(1).max(5),
});

type FormValues = z.infer<typeof schema>;

// Helper to convert an existing URL back into a File object
async function convertUrlToFile(fileName: string): Promise<File> {
  const url = getImageUrl(fileName);
  const response = await fetch(url);
  const blob = await response.blob();
  // Defaulting to image/jpeg if the blob type is missing
  return new File([blob], fileName, { type: blob.type || "image/jpeg" });
}

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
    values: {
      name: forcastor?.name ?? "",
      description: forcastor?.description ?? "",
      imageFile: forcastor?.imageName ?? null, 
      rate: forcastor?.rate ?? 3,
    },
  });

  const mutation = useMutation({
    // 1. Make the mutation function async
    mutationFn: async (values: FormValues) => {
      let finalFile: File | null = null;

      if (values.imageFile instanceof File) {
        // User uploaded a brand new file
        finalFile = values.imageFile;
      } else if (typeof values.imageFile === "string" && values.imageFile.trim() !== "") {
        // User kept the existing image. Fetch it from the API and convert it to a File.
        try {
          finalFile = await convertUrlToFile(values.imageFile);
        } catch (error) {
          console.error("Failed to fetch existing image for re-upload", error);
          throw new Error("Failed to process the existing image.");
        }
      }
      // If values.imageFile is null (user clicked 'Remove'), finalFile remains null.

      const payload: ForcastorCreateOrUpdateDto = {
        id: isEdit ? forcastor!.id : null,
        name: values.name.trim(),
        description: values.description.trim(),
        imageFile: finalFile,
        rate: values.rate,
      };
      
      return isEdit ? updateForcastor(payload) : createForcastor(payload);
    },
    onSuccess: () => {
      showToast.success(t("common.saved"));
      queryClient.invalidateQueries({ queryKey: ["forcastors"] });
      queryClient.invalidateQueries({ queryKey: ["forcastor-detail"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      const backendMessage = error.response?.data?.message || error.message;
      showToast.error(t("common.error") ?? "Error", backendMessage);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {/* ... Rest of your JSX remains exactly the same ... */}
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
                value={form.watch("imageFile")} 
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