import { createContext } from '@react-ui/context';
import React, { useState } from 'react';
import { Slot } from '@react-ui/slot';

type WithAsChild<Type> = Type & { asChild?: boolean };

type State = 'open' | 'closed' | 'closing';
type Type = 'single' | 'multiple';

interface AccordionContextProps {
  states: Record<string, State>;
  setStates(states: Record<string, State>): void;

  handleOpen(value: string): void;
  handleClosing(value: string): void;
  handleClosed(value: string): void;
}

interface AccordionItemContextProps {
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
  value?: string;
  defaultValue?: string;
  onValueChange?(value: string): void;
  collapsible?: boolean;
  disabled?: boolean;
}

function Accordion(props: AccordionProps) {
  const [states, setStates] = useState<Record<string, State>>({});

  const Comp = props.asChild ? Slot : 'div';

  const handleOpen = React.useCallback(
    (value: string) => {
      switch (props.type) {
        case 'single': {
          const rest = Object.keys(states).reduce(
            (acc, cur) => ({
              ...acc,
              [cur]: states[cur] === 'open' ? 'closing' : states[cur],
            }),
            {},
          );
          setStates({ ...rest, [value]: 'open' });
          break;
        }
        case 'multiple':
          setStates((prevState) => ({ ...prevState, [value]: 'open' }));
          break;
      }
    },
    [setStates, states],
  );
  const handleClosing = React.useCallback(
    (value: string) => {
      setStates((prevState) => ({ ...prevState, [value]: 'closing' }));
    },
    [setStates],
  );
  const handleClosed = React.useCallback(
    (value: string) => {
      setStates((prevState) => ({ ...prevState, [value]: 'closed' }));
    },
    [setStates],
  );

  return (
    <AccordionProvider
      {...props}
      states={states}
      setStates={setStates}
      handleOpen={handleOpen}
      handleClosing={handleClosing}
      handleClosed={handleClosed}
    >
      <Comp {...props} />
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

function AccordionItem(props: AccordionItemProps) {
  const { states } = useAccordion();

  const Comp = props.asChild ? Slot : 'div';

  const state = states[props.value] || 'closed';
  return (
    <AccordionItemProvider
      state={state}
      disabled={props.disabled}
      value={props.value}
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

function AccordionTrigger(props: AccordionTriggerProps) {
  const { handleOpen, handleClosing } = useAccordion();
  const { state, disabled, value } = useAccordionItem();
  const Comp = props.asChild ? Slot : 'button';

  const attrs = {
    disabled,
    'data-state': state === 'open' ? 'open' : 'closed',
    onClick(event) {
      event.preventDefault();
      if (state !== 'open') handleOpen(value);
      else handleClosing(value);
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

function AccordionContent(props: AccordionContentProps) {
  const { handleClosed } = useAccordion();
  const { state, value } = useAccordionItem();
  const Comp = props.asChild ? Slot : 'div';

  const attrs = {
    'data-state': state === 'open' ? 'open' : 'closed',
    onAnimationEnd() {
      if (state !== 'closing') return;
      handleClosed(value);
    },
    style: {
      animationFillMode: state !== 'open' ? 'forwards' : undefined,
      ...props.style,
    },
    ...props,
  } as React.HTMLAttributes<HTMLDivElement>;

  if (state === 'closed') return null;
  return <Comp {...attrs} />;
}

export { Accordion, AccordionItem, AccordionContent, AccordionTrigger };
