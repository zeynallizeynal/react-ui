import { createContext } from '@lucide-ui/context';
import React from 'react';
import { mergeRefs } from '@lucide-ui/utils';

interface OTPContextProps {
  disabled?: boolean;
  inputs: HTMLElement[];
  focused: boolean;

  value: string;
  onChange(value: string): void;
}

const [OTPProvider, useOTP] = createContext<OTPContextProps>('OTP');

/**
 * OTP Root
 */
interface OTPProps extends React.ComponentProps<'div'> {
  disabled?: boolean;
  pattern?: string;

  value?: string;

  onValueChange?(value: string): void;

  autoSubmit?: boolean;

  onAutoSubmit?(value: string): void;

  inputProps?: React.ComponentProps<'input'>;
}

function OTP({
  children,
  disabled,
  pattern = '[^0-9]',
  value: controlledValue,
  onValueChange,
  inputProps,
  ...props
}: OTPProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string>('');

  const value =
    controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const [inputs, setInputs] = React.useState<HTMLElement[]>([]);
  const [focused, setFocused] = React.useState<boolean>(false);

  const ref = React.useRef<HTMLDivElement>(null);

  const onChange = React.useCallback(
    (value: string) => {
      if (disabled) return;
      if (controlledValue !== undefined) onValueChange?.(value);
      else setUncontrolledValue(value);
    },
    [disabled, controlledValue, onValueChange],
  );

  function sanitizeValue(raw: string, pattern: string) {
    try {
      const regex = new RegExp(pattern, 'g');
      return raw.replace(regex, '');
    } catch {
      return raw;
    }
  }

  React.useEffect(() => {
    if (!ref.current) return;
    setInputs(
      Array.from(
        ref.current.querySelectorAll<HTMLElement>('[data-collection-item]'),
      ),
    );
  }, []);

  return (
    <OTPProvider
      onChange={onChange}
      disabled={disabled}
      value={value}
      inputs={inputs}
      focused={focused}
    >
      <div
        {...props}
        style={{
          position: 'relative',
          ...props.style,
        }}
        ref={mergeRefs(ref, props.ref)}
      >
        {children}

        <input
          {...inputProps}
          value={value}
          autoComplete="one-time-code"
          autoCorrect="off"
          onChange={(event) => {
            const sanitized = sanitizeValue(event.target.value, pattern);
            onChange(sanitized);
          }}
          maxLength={inputs.length}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            color: 'transparent',
            caretColor: 'transparent',
            outline: 'none',
          }}
        />
      </div>
    </OTPProvider>
  );
}

/**
 * OTP Input
 */

interface OTPInputProps extends React.ComponentProps<'input'> {}

function OTPInput({ children, ...props }: OTPInputProps) {
  const { value, inputs, focused } = useOTP();

  const ref = React.useRef<HTMLElement>(null);

  const currentIndex = ref.current ? inputs.indexOf(ref.current) : 0;

  const isActive =
    focused && Math.min(inputs.length - 1, value.length) === currentIndex;

  return (
    <div
      data-collection-item=""
      data-index={currentIndex}
      data-active={isActive ? '' : null}
      {...props}
      ref={mergeRefs(ref, props.ref)}
    >
      {value[currentIndex]}
      {isActive && children}
    </div>
  );
}

export { OTP, OTPInput };
