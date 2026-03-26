import { MutatingDots } from "react-loader-spinner";

import { cn } from "@/shared/lib/utils";

interface LoaderProps {
  className?: string;
}

const Loader = ({ className }: LoaderProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center p-4 w-full min-h-[50vh]",
        className,
      )}
    >
      <MutatingDots
        visible={true}
        height="150"
        width="150"
        color="#4fa94d"
        secondaryColor="#4fa94d"
        radius="15"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};
export default Loader;
