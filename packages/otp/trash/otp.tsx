import { createContext } from '@lucide-ui/context';
import React from 'react';
import { useKeyboardNavigation } from '@lucide-ui/hooks';
import { mergeRefs } from '@lucide-ui/utils';

interface OTPContextProps {
  value: string;
  onChange(value: string): void;

  inputRef: React.RefObject<HTMLInputElement | null>;

  disabled?: boolean;
  activeItem: React.RefObject<HTMLInputElement | null>;
  registeredItems: HTMLInputElement[];
}

const [OTPProvider, useOTP] = createContext<OTPContextProps>('OTP');

/**
 * OTP Root
 */
interface OTPProps extends React.ComponentProps<'div'> {
  disabled?: boolean;

  value?: string;

  onValueChange?(value: string): void;

  autoSubmit?: boolean;

  onAutoSubmit?(value: string): void;
}

function OTP({
  children,
  disabled,
  value: controlledValue,
  onValueChange,
  ...props
}: OTPProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string>('');
  const registeredItems = React.useRef<HTMLInputElement[]>([]);
  const { ref, activeRef } = useKeyboardNavigation(
    '[data-collection-item]:not([disabled])',
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  const value = controlledValue || uncontrolledValue;

  const onChange = React.useCallback(
    (value: string) => {
      if (disabled) return;
      if (controlledValue !== undefined) onValueChange?.(value);
      else setUncontrolledValue(value);
    },
    [controlledValue],
  );

  console.log(controlledValue);

  React.useEffect(() => {
    if (!ref.current) return;

    registeredItems.current = Array.from(
      ref.current.querySelectorAll<HTMLInputElement>(
        'input[data-collection-item]',
      ),
    );
  }, []);

  return (
    <OTPProvider
      inputRef={inputRef}
      registeredItems={registeredItems.current}
      activeItem={activeRef as React.RefObject<HTMLInputElement | null>}
      disabled={disabled}
      value={value}
      onChange={onChange}
    >
      <div
        {...props}
        ref={mergeRefs(ref, props.ref)}
        style={{
          position: 'relative',
          ...props.style,
        }}
      >
        {children}
      </div>
    </OTPProvider>
  );
}

/**
 * OTP Input
 */

interface OTPInputProps extends React.ComponentProps<'input'> {}

function OTPInput({ ...props }: OTPInputProps) {
  const { activeItem, registeredItems, disabled, value, onChange, inputRef } =
    useOTP();

  const currentIndex = activeItem.current
    ? registeredItems.indexOf(activeItem.current)
    : -1;

  const currentValue = value[currentIndex];
  return (
    <input
      data-collection-item=""
      {...props}
      tabIndex={registeredItems[currentIndex] === activeItem.current ? 0 : -1}
      value={currentValue}
      onFocus={(event) => {
        activeItem.current = event.currentTarget;
      }}
      onChange={(event) => {
        if (value.length > registeredItems.length - 1)
          console.log('Exceeded! ', value);
        onChange(event.target.value);
      }}
    />
  );
}

export { OTP, OTPInput };
