import { useEffect, useState } from "react";

type UseCountdownReturn = {
  seconds: number;
  isRunning: boolean;
  reset: () => void;
};

export const useCountdown = (initialSeconds: number): UseCountdownReturn => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  return {
    seconds,
    isRunning: seconds > 0,
    reset: () => setSeconds(initialSeconds),
  };
};
