import { useEffect, useRef } from "react";

// Calls onOutside when a mousedown lands outside every element in `refs`.
export function useClickOutside(refs, onOutside, enabled = true) {
  const refsRef = useRef(refs);
  const handlerRef = useRef(onOutside);
  refsRef.current = refs;
  handlerRef.current = onOutside;

  useEffect(() => {
    if (!enabled) return;
    const handle = (event) => {
      const inside = refsRef.current.some((ref) => ref.current?.contains(event.target));
      if (!inside) handlerRef.current();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [enabled]);
}
