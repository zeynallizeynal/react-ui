import { createContext } from '@lucide-ui/context';

interface ProgressContextProps {
  value?: number;
  max?: number;
  min?: number;
  state: 'loading' | 'complete' | 'intermediate';
}

const [ProgressProvider, useProgress] =
  createContext<ProgressContextProps>('Progress');

/**
 * Progress
 */

interface ProgressProps extends React.ComponentProps<'div'> {
  value?: number;
  max?: number;
  min?: number;
}

function Progress({ value, max = 100, min = 0, ...props }: ProgressProps) {
  const actualValue = Math.min(max, Math.max(value ?? 0, min));

  const state =
    actualValue === min
      ? 'intermediate'
      : actualValue === max
        ? 'complete'
        : 'loading';

  return (
    <ProgressProvider value={actualValue} max={max} min={min} state={state}>
      <div
        {...props}
        role="progressbar"
        aria-valuenow={actualValue}
        aria-valuemin={min}
        aria-valuetext={`${actualValue}%`}
        aria-valuemax={max}
        data-value={actualValue}
        data-state={state}
      />
    </ProgressProvider>
  );
}

/**
 * Progress Indicator
 */

interface ProgressIndicatorProps extends React.ComponentProps<'div'> {}
function ProgressIndicator({ ...props }: ProgressIndicatorProps) {
  const { value, max, min, state } = useProgress();

  return (
    <div
      {...props}
      data-value={value}
      data-state={state}
      data-max={max}
      data-min={min}
    />
  );
}

export { Progress, ProgressIndicator };
