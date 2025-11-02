import { useEffect, useRef } from "react"


export default function useInterval(callback: () => void | Promise<void>, delay: number | null): void {
  const savedCallback = useRef<() => void | Promise<void> | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => {
      if (!savedCallback.current) return;

      const result = savedCallback.current();
      if (result instanceof Promise) {
        result.catch(console.error);
      }
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
}
