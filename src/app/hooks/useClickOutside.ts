import { RefObject, useEffect, useCallback } from "react";

type ClickOutsideHandler = (event: MouseEvent) => void;

const useClickOutside = (refs: RefObject<HTMLElement>[], handler: ClickOutsideHandler): void => {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (refs.every((ref) => ref.current && !ref.current.contains(event.target as Node))) {
        handler(event);
      }
    },
    [refs, handler]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);
};

export default useClickOutside;