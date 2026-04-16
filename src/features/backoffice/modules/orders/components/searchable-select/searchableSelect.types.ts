import { type KeyboardEvent } from "react";

export type SearchableSelectOption<TMeta = undefined> = TMeta extends undefined
  ? { id: number; name: string }
  : { id: number; name: string; meta: TMeta };

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
