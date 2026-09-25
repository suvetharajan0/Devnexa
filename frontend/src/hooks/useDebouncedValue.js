import { useEffect, useState } from 'react';


// Returns `value`, but delayed — only updates after the user has stopped
// changing it for `delay` ms. Prevents firing an API call on every keystroke.
export function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);


  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cancel the previous timer if value changes again
  }, [value, delay]);


  return debounced;
}
