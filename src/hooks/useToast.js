import { useCallback, useEffect, useRef, useState } from "react";

export function useToast(duration = 4000) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const dismissToast = useCallback(() => {
    clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  const showToast = useCallback(
    (message, tone = "error") => {
      clearTimeout(timerRef.current);
      setToast({ id: Date.now(), message, tone });
      timerRef.current = setTimeout(() => setToast(null), duration);
    },
    [duration]
  );

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { toast, showToast, dismissToast };
}
