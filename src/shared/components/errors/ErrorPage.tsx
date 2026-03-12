import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/shared/components/ui/button.tsx";

interface PageErrorProps {
  title: string;
  description?: string;
  onRetry?: () => void;
  buttonLabel?: string;
}

const PageError = ({
  title,
  description,
  onRetry,
  buttonLabel,
}: PageErrorProps) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex max-w-md flex-col items-center text-center gap-4">
        <AlertTriangle className="h-10 w-10 text-destructive" />

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{title}</h2>

          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {buttonLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PageError;
