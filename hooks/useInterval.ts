import { useEffect, useRef } from "react";

// Do blog do Dan Abramov: https://overreacted.io/making-setinterval-declarative-with-react-hooks/

export default function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>(callback);

  // Lembrar o último callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Configurar o intervalo.
  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
