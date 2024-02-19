import { useMemo } from "react";

import { useThreads } from "@/liveblocks.config";

// Retorna o maior valor de z-index de todas as threads
export const useMaxZIndex = () => {
  // obter todas as threads
  const { threads } = useThreads();

  // calcular o máximo z-index
  return useMemo(() => {
    let max = 0;
    for (const thread of threads) {
      // @ts-ignore
      if (thread.metadata.zIndex > max) {
        // @ts-ignore
        max = thread.metadata.zIndex;
      }
    }
    return max;
  }, [threads]);
};
