import { useLanding } from "@/features/website/hooks/useLanding";

type UseActiveCountResult = {
  activeCount: number | undefined;
};

export const useActiveCount = (): UseActiveCountResult => {
  const { landing } = useLanding();
  return { activeCount: landing?.activeCount };
};
