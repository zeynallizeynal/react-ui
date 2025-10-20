import { createContext } from '@lucide-ui/context';
import React from 'react';
import { mergeRefs } from '@lucide-ui/utils';
import { useControllableState } from '@lucide-ui/hooks';

interface SliderContextProps {
  defaultValue?: number[];
  min: number;
  max: number;
  step?: number;

  trackRef: React.RefObject<HTMLElement | null>;
  trackWidth: number;

  sliderRef: React.RefObject<HTMLElement | null>;

  value: number[];
  onChange(value: number[]): void;
}

const [SliderProvider, useSlider] = createContext<SliderContextProps>('Slider');

/**
 * Slider
 */

interface SliderProps
  extends Omit<React.ComponentProps<'div'>, 'defaultValue'> {
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  onValueChange?(value: number[]): void;
}

function Slider({
  ref,
  max = 100,
  min = 0,
  step = 1,
  defaultValue,
  value,
  onValueChange,
  ...props
}: SliderProps) {
  const [trackWidth, setTrackWidth] = React.useState<number>(0);

  const sliderRef = React.useRef<HTMLElement>(null);
  const trackRef = React.useRef<HTMLElement>(null);

  const [currentValue, setCurrentValue] = useControllableState<number[]>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  React.useLayoutEffect(() => {
    if (!trackRef.current) return;
    setTrackWidth(trackRef.current.offsetWidth);
  }, []);

  return (
    <SliderProvider
      max={max}
      min={min}
      step={step}
      trackRef={trackRef}
      trackWidth={trackWidth}
      sliderRef={sliderRef}
      value={currentValue || []}
      onChange={setCurrentValue}
      defaultValue={defaultValue}
    >
      <div {...props} ref={mergeRefs(ref, sliderRef)} />
    </SliderProvider>
  );
}

/**
 * Slider Track
 */
interface SliderTrackProps extends React.ComponentProps<'div'> {}

function SliderTrack({ ref, ...props }: SliderTrackProps) {
  const { max, min, trackRef, sliderRef } = useSlider();

  return <div {...props} ref={mergeRefs(ref, trackRef)} />;
}

/**
 * Slider Thumb
 */
interface SliderThumbProps extends React.ComponentProps<'div'> {}

function SliderThumb({
  ref,
  onPointerDown,
  style,
  ...props
}: SliderThumbProps) {
  const { max, min, step, trackWidth, sliderRef, value, onChange } =
    useSlider();

  const [thumbWidth, setThumbWidth] = React.useState<number>(0);
  const [draggingStart, setDraggingStart] = React.useState<number>(0);
  const [dragging, setDragging] = React.useState<boolean>(false);
  const [delta, setDelta] = React.useState<number>(0);
  const [thumbIndex, setThumbIndex] = React.useState<number>(-1);

  const thumbRef = React.useRef<HTMLElement>(null);

  const maxDelta = trackWidth - thumbWidth;
  const minDelta = 0;

  React.useEffect(() => {
    function handleMove(event: MouseEvent) {
      if (!dragging) return;

      const nextDelta = Math.min(
        Math.max(minDelta, event.clientX - draggingStart),
        maxDelta,
      );
      setDelta(nextDelta);

      const percent = nextDelta / maxDelta;
      const newValue = [...value];
      newValue[thumbIndex] = Math.round(min + percent * (max - min));

      onChange(newValue);
    }

    function handleUp() {
      setDragging(false);
    }

    if (dragging) {
      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    }

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [
    dragging,
    draggingStart,
    maxDelta,
    minDelta,
    thumbIndex,
    min,
    max,
    onChange,
    value,
  ]);

  React.useEffect(() => {
    if (!sliderRef.current || !thumbRef.current) return;
    const thumbs = sliderRef.current.querySelectorAll<HTMLElement>(
      '[data-slider-thumb]',
    );
    const index = Array.from(thumbs).indexOf(thumbRef.current);
    setThumbIndex(index);
  }, []);

  React.useEffect(() => {
    if (value[thumbIndex] === undefined) return;
    const percent =
      (Math.max(min, Math.min(value[thumbIndex], max)) - min) / (max - min);
    const newDelta = Math.round(percent * maxDelta);
    setDelta(newDelta);
  }, [value, thumbIndex, min, max, maxDelta]);

  React.useLayoutEffect(() => {
    if (!thumbRef.current) return;
    setThumbWidth(thumbRef.current.offsetWidth);
  }, []);

  return (
    <div
      {...props}
      ref={mergeRefs(ref, thumbRef)}
      tabIndex={0}
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.focus();
        setDragging(true);
        setDraggingStart(event.clientX - delta);
        onPointerDown?.(event);
      }}
      data-slider-thumb=""
      style={{
        ...style,
        left: `${delta}px`,
      }}
    />
  );
}

export { Slider, SliderTrack, SliderThumb };
