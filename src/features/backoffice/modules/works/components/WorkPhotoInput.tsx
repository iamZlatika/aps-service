import imageCompression from "browser-image-compression";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type FieldError } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  COMPRESSION_OPTIONS,
  formatSize,
} from "@/features/backoffice/modules/works/lib/photo-utils";
import { cn } from "@/shared/lib/utils";

interface WorkPhotoInputProps {
  label: string;
  error?: FieldError;
  onChange: (file: File | undefined) => void;
}

export const WorkPhotoInput = ({
  label,
  error,
  onChange,
}: WorkPhotoInputProps) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const previewUrlRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setIsCompressing(true);
    try {
      const blob = await imageCompression(selected, COMPRESSION_OPTIONS);
      const compressed = new File([blob], selected.name, { type: blob.type });
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      const url = URL.createObjectURL(compressed);
      previewUrlRef.current = url;
      setFile(compressed);
      setPreviewUrl(url);
      onChange(compressed);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setFile(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
    onChange(undefined);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {t("works.photo.max_size", { size: "2 МБ" })}
        </span>
      </div>

      {isCompressing ? (
        <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("works.photo.compressing")}
        </div>
      ) : file ? (
        <div className="flex items-center gap-3 rounded-md border bg-muted/40 px-3 py-2">
          {previewUrl && (
            <img
              src={previewUrl}
              alt=""
              className="h-10 w-10 shrink-0 rounded object-cover"
            />
          )}
          <span className="min-w-0 flex-1 truncate text-sm text-foreground">
            {file.name}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatSize(file.size)}
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 text-muted-foreground hover:text-destructive"
            aria-label={t("works.photo.clear")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          className={cn(
            "flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary",
            error && "border-destructive text-destructive",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleChange}
          />
          <ImagePlus className="h-4 w-4" />
          {t("works.photo.select")}
        </label>
      )}

      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
};
