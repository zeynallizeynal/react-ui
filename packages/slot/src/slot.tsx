import React from 'react';

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  if (!React.isValidElement(props.children)) return null;
  return React.cloneElement(props.children, {
    ...props,
    ref: (node: HTMLElement) => {
      const { ref } = props.children as any;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    className: [(props.children.props as any).className, props.className]
      .filter(Boolean)
      .join(' '),
  } as React.HTMLAttributes<HTMLElement>);
});

Slot.displayName = 'Slot';

export { Slot };
