import { cn } from "@/shared/lib/utils";

interface LoaderProps {
  className?: string;
  text?: string;
}

const Loader = ({ className, text = "Загрузка..." }: LoaderProps) => {
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <span>{text}</span>
    </div>
  );
};
export default Loader;
