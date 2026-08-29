import * as React from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";

interface ImagePickerProps {
  value: File | string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export function ImagePicker({ value, onChange, disabled }: ImagePickerProps) {
  // Reference to hijack the hidden native file input
  const inputRef = React.useRef<HTMLInputElement>(null);

  const preview = React.useMemo(() => {
    if (!value) return null;
    if (typeof value === "string") return getImageUrl(value);
    return URL.createObjectURL(value);
  }, [value]);

  React.useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
    // Clear the input value so selecting the exact same file twice still triggers the event
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex items-end gap-4">
      {/* 1. Static Preview Area */}
      <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
        {preview ? (
          <img src={preview} alt="Upload preview" className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="size-8 text-muted-foreground/30" />
        )}
      </div>

      {/* 2. Action Buttons */}
      <div className="flex flex-col gap-2">
        {/* Invisible native input */}
        <input
          type="file"
          ref={inputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
        
        {/* The highly visible trigger icon button */}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-2"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-4" />
          Upload Image
        </Button>
        
        {/* Only show remove option if an image exists */}
        {preview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-2 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={disabled}
            onClick={() => onChange(null)}
          >
            <X className="size-4" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}