import { useEffect, useRef } from "react";

/* Custom hook to automatically scroll to a specific element when certain dependencies change.*/
/**
 * Custom hook para awtomatikong mag-scroll pababa sa dulo ng chat.
 * @param {Array} dependencies - Ang mga data na binabantayan (e.g., all_messages)
 * @param {string} currentView - (Optional) Kung may partikular na view state (e.g., "ticket")
 * @param {string} targetView - (Optional) Ang view name kung kailan lang dapat mag-scroll (default: "ticket")
 */

export function useAutoScroll(
  dependencies = [],
  currentView = null,
  targetView = "ticket",
) {
  const elementRef = useRef(null);

  useEffect(() => {
    if (currentView === null || currentView === targetView) {
      elementRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [...dependencies, currentView, targetView]);

  return elementRef;
}
