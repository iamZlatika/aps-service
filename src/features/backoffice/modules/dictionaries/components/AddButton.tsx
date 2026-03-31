import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button.tsx";

interface AddButtonProps {
  onClick: () => void;
}

export const AddButton = ({ onClick }: AddButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      className="bg-green-600 hover:bg-green-700 text-white"
      onClick={onClick}
    >
      <Plus className="mr-2 h-4 w-4" />
      {t("table.add_button")}
    </Button>
  );
};
