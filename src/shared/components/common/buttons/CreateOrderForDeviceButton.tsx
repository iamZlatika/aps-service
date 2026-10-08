import { MonitorSmartphone } from "lucide-react";

interface CreateOrderForDeviceButtonProps {
  onClick: () => void;
  title: string;
}

export const CreateOrderForDeviceButton = ({
  onClick,
  title,
}: CreateOrderForDeviceButtonProps) => {
  return (
    <button
      type="button"
      title={title}
      className="h-9 w-9 sm:h-12 sm:w-12 flex items-center justify-center rounded-md border bg-card text-muted-foreground hover:text-foreground shadow-sm transition-colors"
      onClick={onClick}
    >
      <MonitorSmartphone className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
  );
};
