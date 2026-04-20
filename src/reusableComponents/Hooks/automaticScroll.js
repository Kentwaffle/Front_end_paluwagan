// automaticScroll.js
import { useCallback, useRef } from "react";

export const useInfiniteAutoScroll = (
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  itemCount,
) => {
  // Gagamit tayo ng useRef para itago ang IntersectionObserver instance
  const observer = useRef();

  // Ito ang "callback ref"
  const sentinelRef = useCallback(
    (node) => {
      // 1. Kung naglo-load pa, wag muna
      if (isFetchingNextPage) return;

      // 2. Linisin ang dating observer kung meron man
      if (observer.current) observer.current.disconnect();

      // 3. Gumawa ng bagong observer
      observer.current = new IntersectionObserver(
        (entries) => {
          // 4. Trigger logic
          if (entries[0].isIntersecting && hasNextPage) {
            console.log("Sentinel seen! Loading more...");
            fetchNextPage();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "150px", // Mas malayo, mas smooth
        },
      );

      if (node) observer.current.observe(node);
    },
    // Dependency array: re-create ang callback pag nagbago ang mga 'to
    [fetchNextPage, hasNextPage, isFetchingNextPage, itemCount],
  );

  return sentinelRef;
};
