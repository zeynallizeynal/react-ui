import { createContext } from '@lucide-ui/context';
import React from 'react';
import { mergeRefs } from '@lucide-ui/utils';

interface SliderContextProps {
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;

  trackRef: React.RefObject<HTMLElement | null>;
  trackWidth: number;

  sliderRef: React.RefObject<HTMLElement | null>;
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
}

function Slider({
  max = 100,
  min = 0,
  step = 1,
  defaultValue,
  ref,
  ...props
}: SliderProps) {
  const [trackWidth, setTrackWidth] = React.useState<number>(0);

  const sliderRef = React.useRef<HTMLElement>(null);
  const trackRef = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    if (!trackRef.current) return;
    setTrackWidth(trackRef.current.offsetWidth);
  }, []);

  return (
    <SliderProvider
      defaultValue={defaultValue}
      max={max}
      min={min}
      step={step}
      trackRef={trackRef}
      trackWidth={trackWidth}
      sliderRef={sliderRef}
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
  const { max, min, step, trackWidth, sliderRef } = useSlider();
  const [thumbWidth, setThumbWidth] = React.useState<number>(0);

  const [draggingStart, setDraggingStart] = React.useState<number>(0);
  const [dragging, setDragging] = React.useState<boolean>(false);
  const [delta, setDelta] = React.useState<number>(0);

  const thumbRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    function handleMove(event: MouseEvent) {
      if (!dragging) return;
      setDelta(
        Math.min(
          Math.max(0, event.clientX - draggingStart),
          trackWidth - thumbWidth,
        ),
      );
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
  }, [dragging, draggingStart, delta, trackWidth, thumbWidth]);

  // React.useEffect(() => {
  //   if (!sliderRef.current || !thumbRef.current) return;
  //
  //   const handlePointerDown = (event: PointerEvent) => {
  //     if (
  //       event.currentTarget !== sliderRef.current ||
  //       !sliderRef.current ||
  //       !thumbRef.current
  //     )
  //       return;
  //
  //     const rect = sliderRef.current.getBoundingClientRect();
  //     const clickX = event.clientX - rect.left;
  //     const newDelta = Math.min(
  //       Math.max(0, clickX - thumbRef.current.offsetWidth / 2),
  //       trackWidth - thumbRef.current.offsetWidth,
  //     );
  //
  //     setDelta(newDelta);
  //     setDragging(true);
  //     setDraggingStart(event.clientX - newDelta);
  //   };
  //
  //   sliderRef.current.addEventListener('pointerdown', handlePointerDown);
  //   return () => {
  //     sliderRef.current?.removeEventListener('pointerdown', handlePointerDown);
  //   };
  // }, [sliderRef, thumbRef, trackWidth]);

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
      style={{
        ...style,
        left: `${(delta / trackWidth) * 100}%`,
      }}
    />
  );
}

export { Slider, SliderTrack, SliderThumb };
