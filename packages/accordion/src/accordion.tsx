import { createContext } from '@react-ui/context';
import React, { useState } from 'react';
import { Slot } from '@react-ui/slot';
import { mergeRefs } from '@react-ui/utils';
import { useKeyboardNavigation } from '@react-ui/hooks';

type WithAsChild<Type> = Type & { asChild?: boolean };

type State = 'open' | 'closed' | 'closing';
type Type = 'single' | 'multiple';

interface AccordionContextProps {
  activeItem: React.RefObject<HTMLElement | null>;
  collapsible?: boolean;
  disabled?: boolean;
  states: Record<string, State>;

  handleOpen(value: string): void;
  handleClosing(value: string): void;
  handleClosed(value: string): void;
}

interface AccordionItemContextProps {
  id: string;
  state: State;
  disabled?: boolean;
  value: string;
}

const [AccordionProvider, useAccordion] =
  createContext<AccordionContextProps>('Accordion');
const [AccordionItemProvider, useAccordionItem] =
  createContext<AccordionItemContextProps>('AccordionItem');

interface AccordionProps extends WithAsChild<React.ComponentProps<'div'>> {
  type: Type;
  defaultValue?: string;
  value?: string;
  onValueChange?(value: string): void;
  collapsible?: boolean;
  disabled?: boolean;
}

function Accordion({
  type,
  value: controlledValue,
  defaultValue,
  onValueChange,
  collapsible = true,
  disabled,
  ...props
}: AccordionProps) {
  const [states, setStates] = React.useState<Record<string, State>>(() => {
    if (controlledValue) return { [controlledValue]: 'open' };
    if (defaultValue) return { [defaultValue]: 'open' };
    return {};
  });

  const { ref, activeRef: activeItem } = useKeyboardNavigation(
    '[data-collection-item]:not([disabled])',
  );

  const Comp = props.asChild ? Slot : 'div';

  const isControlled = controlledValue !== undefined;

  const handleOpen = React.useCallback(
    (value: string) => {
      if (disabled) return;
      switch (type) {
        case 'single': {
          const rest = Object.keys(states).reduce(
            (acc, cur) => ({
              ...acc,
              [cur]: states[cur] === 'open' ? 'closing' : states[cur],
            }),
            {},
          );
          const obj = {
            ...rest,
            [value]: 'open',
          } as Record<string, State>;

          onValueChange?.(value);
          setStates(obj);
          break;
        }
        case 'multiple':
          setStates((prevState) => ({ ...prevState, [value]: 'open' }));
          break;
      }
    },
    [setStates, disabled, states, isControlled, onValueChange, type],
  );
  const handleClosing = React.useCallback(
    (val: string) => {
      if (disabled) return;
      if (collapsible)
        setStates((prevState) => ({ ...prevState, [val]: 'closing' }));
      else return;
    },
    [setStates, disabled],
  );
  const handleClosed = React.useCallback(
    (val: string) => {
      if (disabled) return;
      setStates((prevState) => ({ ...prevState, [val]: 'closed' }));
    },
    [setStates, disabled],
  );

  React.useEffect(() => {
    if (controlledValue) handleOpen(controlledValue);
  }, [controlledValue]);

  return (
    <AccordionProvider
      activeItem={activeItem}
      states={states}
      handleOpen={handleOpen}
      handleClosing={handleClosing}
      handleClosed={handleClosed}
      disabled={disabled}
    >
      <Comp {...props} ref={mergeRefs(ref, props.ref)} />
    </AccordionProvider>
  );
}

/**
 * AccordionItem
 */
interface AccordionItemProps extends WithAsChild<React.ComponentProps<'div'>> {
  value: string;
  disabled?: boolean;
}

function AccordionItem({
  value,
  disabled,
  asChild,
  ...props
}: AccordionItemProps) {
  const { states } = useAccordion();
  const id = React.useId();

  const Comp = asChild ? Slot : 'div';

  const state = states[value] || 'closed';
  return (
    <AccordionItemProvider
      id={id}
      state={state}
      disabled={disabled}
      value={value}
    >
      <Comp {...props} />
    </AccordionItemProvider>
  );
}

/**
 * AccordionTrigger
 */
interface AccordionTriggerProps
  extends WithAsChild<React.ComponentProps<'button'>> {}

function AccordionTrigger({
  asChild,
  onFocus,
  onBlur,
  ...props
}: AccordionTriggerProps) {
  const {
    handleOpen,
    handleClosing,
    activeItem,
    disabled: accordionDisabled,
  } = useAccordion();
  const { state, disabled, value, id } = useAccordionItem();

  const Comp = asChild ? Slot : 'button';

  const attrs = {
    'aria-controls': id,
    'data-state': state === 'open' ? 'open' : 'closed',
    'data-collection-item': '',
    disabled: disabled || accordionDisabled,
    type: 'button',
    onClick(event) {
      event.preventDefault();
      if (state !== 'open') handleOpen(value);
      else handleClosing(value);
    },
    onFocus(event) {
      activeItem.current = event.currentTarget;
      onFocus?.(event);
    },
    onBlur(event) {
      activeItem.current = null;
      onBlur?.(event);
    },
    ...props,
  } as React.HTMLAttributes<HTMLButtonElement>;

  return <Comp {...attrs} />;
}

/**
 * AccordionContent
 */
interface AccordionContentProps
  extends WithAsChild<React.ComponentProps<'div'>> {}

function AccordionContent({
  children,
  asChild,
  ...props
}: AccordionContentProps) {
  const { handleClosed } = useAccordion();
  const { state, value, id } = useAccordionItem();
  const [variables, setVariables] = useState<
    React.CSSProperties & Record<string, string | number>
  >();

  const ref = React.useRef<HTMLDivElement>(null);
  const lastVars = React.useRef<{ height?: string; width?: string }>({});

  const Comp = asChild ? Slot : 'div';

  const attrs = {
    id,
    'data-state': state === 'open' ? 'open' : 'closed',
    onAnimationEnd() {
      if (state !== 'closing') return;
      handleClosed(value);
    },
    style: {
      animationFillMode: state == 'closing' ? 'forwards' : undefined,
      display: state == 'closed' ? 'none' : undefined,
      ...variables,
      ...props.style,
    },
    ...props,
  } as React.HTMLAttributes<HTMLDivElement>;

  React.useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    if (!el) return;

    const height = el.scrollHeight || el.clientHeight;
    const width = el.scrollWidth || el.clientWidth;
    if (height > 0) lastVars.current.height = `${height}px`;
    if (width > 0) lastVars.current.width = `${width}px`;

    setVariables({
      '--ui-accordion-content-height': lastVars.current.height ?? '0px',
      '--ui-accordion-content-width': lastVars.current.width ?? '0px',
    });
  }, [state]);

  React.useLayoutEffect(() => {
    if (!ref.current || state !== 'closing') return;
    if (ref.current.getAnimations().length === 0) handleClosed(value);
  }, [state]);

  return (
    <Comp {...attrs} ref={mergeRefs(ref, props.ref)}>
      {state === 'closed' ? null : children}
    </Comp>
  );
}

export { Accordion, AccordionItem, AccordionContent, AccordionTrigger };
