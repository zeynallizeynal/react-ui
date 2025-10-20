import { createContext } from '@lucide-ui/context';
import React from 'react';
import { mergeRefs } from '@lucide-ui/utils';

interface OTPContextProps {
  disabled?: boolean;
  slots: HTMLElement[];
  activeSlots: HTMLElement[];

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
}

function OTP({
  children,
  disabled,
  pattern = '[^0-9]',
  value: controlledValue,
  onValueChange,
  id,
  name,
  inputMode,
  ...props
}: OTPProps &
  Pick<React.ComponentProps<'input'>, 'id' | 'name' | 'inputMode'>) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string>('');

  const value =
    controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const [slots, setSlots] = React.useState<HTMLElement[]>([]);
  const [activeSlots, setActiveSlots] = React.useState<HTMLElement[]>([]);

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
    setSlots(
      Array.from(
        ref.current.querySelectorAll<HTMLElement>('[data-collection-item]'),
      ),
    );
  }, []);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!ref.current) return;

      const activeSlot =
        ref.current.querySelector<HTMLElement>('[data-active]');
      if (!activeSlot) return;

      const activeIndex = activeSlots.indexOf(activeSlot);
      if (activeIndex === -1) return;

      let nextIndex = activeIndex;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        nextIndex = (activeIndex - 1 + activeSlots.length) % activeSlots.length;
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextIndex = (activeIndex + 1) % activeSlots.length;
      } else {
        return;
      }
      const nextSlot = activeSlots[nextIndex];
      activeSlots.forEach((el) => {
        el.removeAttribute('data-active');
      });
      nextSlot?.setAttribute('data-active', '');
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [slots, activeSlots]);

  React.useEffect(() => {
    const focusableSlots = slots.filter((_, index) => index <= value.length);
    setActiveSlots(focusableSlots);
  }, [value]);

  return (
    <OTPProvider
      onChange={onChange}
      disabled={disabled}
      value={value}
      slots={slots}
      activeSlots={activeSlots}
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
          value={value}
          autoComplete="one-time-code"
          autoCorrect="off"
          onChange={(event) => {
            const sanitized = sanitizeValue(event.target.value, pattern);
            onChange(sanitized);
          }}
          name={name}
          id={id}
          inputMode={inputMode}
          disabled={disabled}
          type="text"
          pattern={pattern}
          maxLength={slots.length}
          onFocus={() => {
            const focusableSlots = slots.filter(
              (_, index) => index <= value.length,
            );
            setActiveSlots(focusableSlots);
          }}
          onBlur={() => {
            setActiveSlots([]);
          }}
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

interface OTPSlotProps extends React.ComponentProps<'input'> {}

function OTPSlot({ children, ...props }: OTPSlotProps) {
  const { value, slots, activeSlots } = useOTP();

  const ref = React.useRef<HTMLElement>(null);

  const currentIndex = ref.current ? slots.indexOf(ref.current) : 0;

  const isActive =
    ref.current &&
    activeSlots.includes(ref.current) &&
    Math.min(activeSlots.length - 1, value.length) === currentIndex;

  return (
    <div
      data-collection-item=""
      data-index={currentIndex}
      data-active={isActive ? '' : null}
      {...props}
      ref={mergeRefs(ref, props.ref)}
    >
      {value[currentIndex] ? value[currentIndex] : isActive && children}
    </div>
  );
}

export { OTP, OTPSlot };
