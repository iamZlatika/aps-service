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

const MAX_COUNT = 5;

interface AdditionalPhotosInputProps {
  label: string;
  error?: FieldError;
  onChange: (files: File[]) => void;
}

type FileEntry = {
  file: File;
  previewUrl: string;
};

export const AdditionalPhotosInput = ({
  label,
  error,
  onChange,
}: AdditionalPhotosInputProps) => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const entriesRef = useRef<FileEntry[]>([]);

  useEffect(() => {
    return () => {
      entriesRef.current.forEach((e) => URL.revokeObjectURL(e.previewUrl));
    };
  }, []);

  const update = (next: FileEntry[]) => {
    entriesRef.current = next;
    setEntries(next);
    onChange(next.map((e) => e.file));
  };

  const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (inputRef.current) inputRef.current.value = "";
    setIsCompressing(true);
    try {
      const blob = await imageCompression(file, COMPRESSION_OPTIONS);
      const compressed = new File([blob], file.name, { type: blob.type });
      update([
        ...entries,
        { file: compressed, previewUrl: URL.createObjectURL(compressed) },
      ]);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemove = (index: number) => {
    URL.revokeObjectURL(entries[index].previewUrl);
    update(entries.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {t("works.photo.max_size", { size: "2 МБ" })}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {entries.map((entry, i) => (
          <div
            key={entry.previewUrl}
            className="flex items-center gap-3 rounded-md border bg-muted/40 px-3 py-2"
          >
            <img
              src={entry.previewUrl}
              alt=""
              className="h-10 w-10 shrink-0 rounded object-cover"
            />
            <span className="min-w-0 flex-1 truncate text-sm text-foreground">
              {entry.file.name}
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatSize(entry.file.size)}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="shrink-0 text-muted-foreground hover:text-destructive"
              aria-label={t("works.photo.clear")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {isCompressing && (
          <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("works.photo.compressing")}
          </div>
        )}

        {!isCompressing && entries.length < MAX_COUNT && (
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
              onChange={handleAdd}
            />
            <ImagePlus className="h-4 w-4" />
            {t("works.photo.select")}
          </label>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
};
