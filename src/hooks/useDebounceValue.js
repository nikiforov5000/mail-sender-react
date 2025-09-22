import { useEffect, useRef, useState } from "react";

export const useDeboundceValue = (value, delay) => {
  let timerId = useRef(null);
  const [debounceValue, setDebounceValue] = useState(value);

  if (timerId.current) {
    clearTimeout(timerId.current);
  }

  useEffect(() => {
    timerId.current = setTimeout(() => setDebounceValue(value), delay);
    return () => clearTimeout(timerId.current);
  }, [value, delay]);

  return debounceValue;
};
