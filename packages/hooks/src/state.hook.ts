import React from 'react';

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}): [T | undefined, (value: T) => void] {
  const [uncontrollableState, setUncontrollableState] =
    React.useState(defaultValue);

  const isControlled = value !== undefined;

  const currentValue = isControlled ? value : uncontrollableState;

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) {
        setUncontrollableState(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [currentValue, setValue];
}
