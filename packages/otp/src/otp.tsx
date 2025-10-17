import { createContext } from '@lucide-ui/context';
import React from 'react';
import { mergeRefs } from '@lucide-ui/utils';

interface OTPContextProps {
  disabled?: boolean;
  slots: HTMLElement[];
  activeSlots: HTMLElement[];
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
    setSlots(
      Array.from(
        ref.current.querySelectorAll<HTMLElement>('[data-collection-item]'),
      ),
    );
  }, []);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!ref.current || !focused) return;

      const activeItem =
        ref.current.querySelector<HTMLElement>('[data-active]');
      if (!activeItem) return;

      const activeIndex = slots.indexOf(activeItem);
      if (activeIndex === -1) return;

      let nextIndex = activeIndex;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        nextIndex = (activeIndex - 1 + slots.length) % slots.length;
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextIndex = (activeIndex + 1) % slots.length;
      } else {
        return;
      }

      slots.forEach((el) => el.removeAttribute('data-active'));

      const nextEl = slots[nextIndex];
      if (nextEl) {
        nextEl.setAttribute('data-active', '');
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focused, slots]);

  return (
    <OTPProvider
      onChange={onChange}
      disabled={disabled}
      value={value}
      slots={slots}
      focused={focused}
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

interface OTPSlotProps extends React.ComponentProps<'input'> {}

function OTPSlot({ children, ...props }: OTPSlotProps) {
  const { value, slots, focused, activeSlots } = useOTP();

  const ref = React.useRef<HTMLElement>(null);

  const currentIndex = ref.current ? slots.indexOf(ref.current) : 0;

  const isActive =
    ref.current &&
    activeSlots.includes(ref.current) &&
    Math.min(activeSlots.length - 1, value.length) === currentIndex;

  return (
    <div
      tabIndex={isActive ? 0 : undefined}
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
