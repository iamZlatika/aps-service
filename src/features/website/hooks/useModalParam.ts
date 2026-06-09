import { useSearchParams } from "react-router-dom";

type UseModalParamReturn = {
  value: string | null;
  set: (value: string) => void;
  clear: () => void;
};

export function useModalParam(key: string): UseModalParamReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.get(key);

  const set = (val: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(key, val);
      return next;
    });
  };

  const clear = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(key);
        return next;
      },
      { replace: true },
    );
  };

  return { value, set, clear };
}
