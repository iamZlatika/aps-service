import { type KeyboardEvent } from "react";

import { Input } from "@/shared/components/ui/input.tsx";

interface EditInputCellProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  name: string;
}

export const EditInputCell = ({
  value,
  onChange,
  onSave,
  onCancel,
  isEditing,
  name,
}: EditInputCellProps) => {
  if (!isEditing) {
    return <>{name}</>;
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      autoFocus
      className="h-8"
    />
  );
};

export default EditInputCell;
