import React from 'react';

export function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (!ref) continue;

      if (typeof ref === 'function') {
        ref(value);
      } else {
        try {
          ref.current = value;
        } catch {
          throw new Error(`Cannot assign value '${value}' to ref '${ref}'`);
        }
      }
    }
  };
}
