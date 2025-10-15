import React from 'react';

export function useKeyboardNavigation(selectors: string) {
  const ref = React.useRef<HTMLElement>(null);
  const activeRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;

    const items = Array.from(
      ref.current.querySelectorAll<HTMLElement>(selectors),
    );

    function handleKeyDown(event: KeyboardEvent) {
      if (!items.length || !activeRef.current) return;

      const activeIndex = items.indexOf(activeRef.current);
      if (activeIndex === -1) return;

      let nextIndex = activeIndex;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        nextIndex = (activeIndex + 1) % items.length;
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        nextIndex = (activeIndex - 1 + items.length) % items.length;
      }

      const next = items[nextIndex];
      if (next) {
        next.focus();
        activeRef.current = next;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref]);

  return { ref, activeRef };
}
