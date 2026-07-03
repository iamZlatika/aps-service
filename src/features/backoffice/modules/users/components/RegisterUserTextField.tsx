import type { UseFormRegisterReturn } from "react-hook-form";

import { Input } from "@/shared/components/ui/input.tsx";

interface RegisterUserTextFieldProps {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  registration: UseFormRegisterReturn;
  error?: string;
}

const RegisterUserTextField = ({
  id,
  label,
  placeholder,
  type = "text",
  registration,
  error,
}: RegisterUserTextFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className={error ? "border-red-500" : ""}
        {...registration}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default RegisterUserTextField;
