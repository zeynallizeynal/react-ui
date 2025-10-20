import * as OTPPrimitive from '@lucide-ui/otp';
import { cn } from '@/lib/utils';

export function OTP(props: React.ComponentProps<typeof OTPPrimitive.OTP>) {
  return (
    <OTPPrimitive.OTP
      {...props}
      className={cn('flex items-center gap-2 w-fit', props.className)}
    />
  );
}
export function OTPSlot(
  props: React.ComponentProps<typeof OTPPrimitive.OTPSlot>,
) {
  return (
    <OTPPrimitive.OTPSlot
      {...props}
      className={cn(
        'inline-flex items-center justify-center text-sm h-9 w-6 rounded border text-center outline-none transition data-[active]:ring-2 focus-visible:ring-2',
      )}
    >
      <div className="animate-caret-blink w-px h-4 bg-black" />
    </OTPPrimitive.OTPSlot>
  );
}

export function OTPSeparator(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn('w-3 h-0.5 rounded-md bg-neutral-300', props.className)}
    />
  );
}
