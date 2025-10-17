import { createContext } from '@lucide-ui/context';
import React from 'react';
import { useKeyboardNavigation } from '@lucide-ui/hooks';
import { mergeRefs } from '@lucide-ui/utils';

interface OTPContextProps {
  value: string;
  onChange(value: string): void;

  inputRef: React.RefObject<HTMLInputElement | null>;

  disabled?: boolean;
  activeItem: React.RefObject<HTMLElement | null>;
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

  const value = controlledValue ?? uncontrolledValue;

  const onChange = React.useCallback((value: string) => {
    if (disabled) return;
    if (controlledValue) onValueChange?.(value);
    else setUncontrolledValue(value);
  }, []);

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
      activeItem={activeRef}
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
        <input
          ref={inputRef}
          tabIndex={-1}
          autoComplete="one-time-code"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          style={{
            all: 'unset',
            position: 'absolute',
            inset: 0,
            caretColor: 'transparent',
            textAlign: 'center',
            color: 'transparent',
          }}
        />
      </div>
    </OTPProvider>
  );
}

/**
 * OTP Input
 */

interface OTPInputProps extends React.ComponentProps<'div'> {}

function OTPInput({ ...props }: OTPInputProps) {
  const { activeItem, registeredItems, disabled, value, onChange, inputRef } =
    useOTP();

  return (
    <div
      onClick={() => {
        inputRef.current?.focus();
      }}
      data-collection-item=""
      {...props}
    />
  );
}

export { OTP, OTPInput };
