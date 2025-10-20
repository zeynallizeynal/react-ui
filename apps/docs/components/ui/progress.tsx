import * as ProgressPrimitive from '@lucide-ui/progress';
import React from 'react';
import { cn } from '@/lib/utils';

export function Progress({
  value,
  className,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Progress>) {
  return (
    <ProgressPrimitive.Progress
      value={value}
      {...props}
      className={cn(
        'w-full overflow-hidden bg-neutral-100 rounded-md',
        className,
      )}
    >
      <ProgressPrimitive.ProgressIndicator
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
        }}
        className="bg-neutral-950 h-2 transition-transform"
      />
    </ProgressPrimitive.Progress>
  );
}
