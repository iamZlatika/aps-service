import { Camera, ImagePlus } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button";

const HistorySidebar = () => {
  const { t } = useTranslation();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="w-[20%] min-w-80 max-w-[800px] shrink-0 border-l bg-background flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-3 border-b">
        <h2 className="font-semibold text-base">{t("orders.history.title")}</h2>
      </div>
      <div className="flex-1 px-4 py-3" />
      <div className="border-t px-4 py-3 flex items-center gap-2">
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => galleryInputRef.current?.click()}
        >
          <ImagePlus />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera />
        </Button>
      </div>
    </aside>
  );
};

export default HistorySidebar;
