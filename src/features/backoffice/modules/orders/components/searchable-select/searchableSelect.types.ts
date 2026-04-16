import { type KeyboardEvent } from "react";

export type SearchableSelectOption = {
  id: number;
  name: string;
  meta?: Record<string, unknown>;
};

export type SearchableSelectInputProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
  hasError: boolean;
};
