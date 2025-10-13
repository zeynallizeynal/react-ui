import { createContext } from '@react-ui/context';
import React from 'react';

interface AccordionContextProps {
  state: 'open' | 'closed' | 'closing';
  handleOpen(): void;
  handleClose(): void;
  handleClosed(): void;
}

const COMPONENT_NAME = 'Accordion';

const [AccordionProvider, useAccordion] =
  createContext<AccordionContextProps>(COMPONENT_NAME);

function Accordion(props: React.PropsWithChildren) {
  const [state, setState] = React.useState<'open' | 'closed' | 'closing'>(
    'closed',
  );

  function handleOpen() {
    console.log('Opened');
    setState('open');
  }

  function handleClose() {
    console.log('Closing');
    setState('closing');
  }

  function handleClosed() {
    console.log('Unmounted');
    setState('closed');
  }

  return (
    <AccordionProvider
      state={state}
      handleOpen={handleOpen}
      handleClose={handleClose}
      handleClosed={handleClosed}
    >
      {props.children}
    </AccordionProvider>
  );
}

/**
 * AccordionTrigger
 */
interface AccordionTriggerProps extends React.ComponentProps<'button'> {}

function AccordionTrigger(props: AccordionTriggerProps) {
  const { state, handleOpen, handleClose } = useAccordion();

  const attrs = {
    onClick(event) {
      event.preventDefault();
      if (state === 'open') {
        handleClose();
      } else {
        handleOpen();
      }
    },
    'data-state': state === 'open' ? 'open' : 'closed',
    ...props,
  } as React.HTMLAttributes<HTMLButtonElement>;
  return <button {...attrs} />;
}

/**
 * AccordionContent
 */
interface AccordionContentProps extends React.ComponentProps<'div'> {}

function AccordionContent(props: AccordionContentProps) {
  const { state, handleClosed } = useAccordion();

  const attrs = {
    'data-state': state === 'open' ? 'open' : 'closed',
    onAnimationEnd() {
      if (state !== 'closing') return;
      handleClosed();
    },
    style: {
      animationFillMode: state !== 'open' ? 'forwards' : undefined,
      ...props.style,
    },
    ...props,
  } as React.HTMLAttributes<HTMLDivElement>;

  if (state === 'closed') return null;
  return <div {...attrs} />;
}

export { Accordion, AccordionContent, AccordionTrigger };
