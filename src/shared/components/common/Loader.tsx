import { useTranslation } from "react-i18next";

import { cn } from "@/shared/lib/utils";

interface LoaderProps {
  className?: string;
  text?: string;
}

const Loader = ({ className, text }: LoaderProps) => {
  const { t } = useTranslation();
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <span>{text || t("loader.default")}</span>
    </div>
  );
};
export default Loader;
