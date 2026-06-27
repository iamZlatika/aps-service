import { Users } from "lucide-react";

interface CreateOrderForCustomerButtonProps {
  onClick: () => void;
}

export const CreateOrderForCustomerButton = ({
  onClick,
}: CreateOrderForCustomerButtonProps) => {
  return (
    <button
      type="button"
      className="h-9 w-9 sm:h-12 sm:w-12 flex items-center justify-center rounded-md border bg-card text-muted-foreground hover:text-foreground shadow-sm transition-colors"
      onClick={onClick}
    >
      <Users className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
  );
};
