import { createContext } from '@lucide-ui/context';
import React, { useState } from 'react';
import { mergeRefs } from '@lucide-ui/utils';

interface OTPContextProps {
  disabled?: boolean;
  inputs: HTMLInputElement[];
  value: string;
  onChange(value: string): void;

  inputValues: Record<number, string>;
  setInputValues: React.Dispatch<React.SetStateAction<Record<number, string>>>;
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

  const [inputs, setInputs] = useState<HTMLInputElement[]>([]);
  const [inputValues, setInputValues] = useState<Record<number, string>>({});

  const value =
    controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const onChange = React.useCallback((value: string) => {
    if (disabled) return;
    if (controlledValue !== undefined) onValueChange?.(value);
    else setUncontrolledValue(value);
  }, []);

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    setInputs(
      Array.from(
        ref.current.querySelectorAll<HTMLInputElement>(
          'input[data-collection-item]',
        ),
      ),
    );
  }, []);

  return (
    <OTPProvider
      setInputValues={setInputValues}
      inputValues={inputValues}
      inputs={inputs}
      disabled={disabled}
      value={value}
    >
      <div {...props} tabIndex={0} ref={mergeRefs(ref, props.ref)}>
        {children}
        <input
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
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

function OTPInput({ ref, ...props }: OTPInputProps) {
  const [inputValue, setInputValue] = React.useState<string>('');
  const { inputs, setInputValues, inputValues, value } = useOTP();
  const currentRef = React.useRef<HTMLInputElement>(null);

  const currentIndex = currentRef.current
    ? inputs.indexOf(currentRef.current)
    : -1;

  const lastAvailableIndex =
    Object.entries(inputValues)
      .filter(([_, v]) => v)
      .map(([i]) => i)
      .slice(-1)[0] ?? -1;

  React.useEffect(() => {
    if (currentIndex === -1) return;
    setInputValues((prevState) => ({
      ...prevState,
      [currentIndex]: inputValue.slice(-1),
    }));

    if (inputValue === '') {
      const prev = inputs[Math.max(currentIndex - 1, 0)];
      if (prev) {
        prev?.focus();
      }
    }
  }, [inputValue]);

  return (
    <input
      data-collection-item=""
      ref={mergeRefs(currentRef, ref)}
      {...props}
      value={value[currentIndex] || inputValue.slice(-1)}
      onChange={(event) => {
        setInputValue(event.target.value);
        if (inputs[currentIndex + 1]) inputs[currentIndex + 1]?.focus();
      }}
      onFocus={(event) => {
        event.currentTarget.select();
      }}
    />
  );
}

export { OTP, OTPInput };
