'use client';

import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { Slider, SliderThumb, SliderTrack } from '@lucide-ui/slider';

export default function Home() {
  const [value, setValue] = useState<number>(0);

  return (
    <main className="flex relative items-center justify-center min-h-screen">
      <div className="w-100 mx-auto space-y-2">
        <Progress value={value} />
        <div className="flex items-center gap-2">
          {/*<Button*/}
          {/*  onClick={() => setValue((prevState) => prevState + 10)}*/}
          {/*  variant="outline"*/}
          {/*>*/}
          {/*  <LuPlus /> 10*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  onClick={() => setValue((prevState) => prevState - 10)}*/}
          {/*  variant="outline"*/}
          {/*>*/}
          {/*  <LuMinus /> 10*/}
          {/*</Button>*/}
        </div>
        <Slider className="h-5 w-52 mx-auto relative flex items-center">
          <SliderTrack className="h-1 bg-neutral-200 grow" />
          <SliderThumb className="size-5 rounded-full shadow bg-neutral-900 absolute top-0 transition hover:bg-neutral-700 focus:ring-4 ring-neutral-900/25 active:scale-95 " />
        </Slider>
        <Slider className="h-5 w-52 mx-auto relative flex items-center">
          <SliderTrack className="h-1 bg-neutral-200 grow" />
          <SliderThumb className="size-5 rounded-full shadow bg-neutral-900 absolute top-0 transition hover:bg-neutral-700 focus:ring-4 ring-neutral-900/25 active:scale-95 " />
          <SliderThumb className="size-3 rounded-full shadow bg-zinc-900 absolute top-0 transition hover:bg-zinc-700 focus:ring-4 ring-zinc-900/25 active:scale-95 " />
        </Slider>
        {/*
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Is it unstyled?</AccordionTrigger>
            <AccordionContent>
              Yes. It&#39;s unstyled by default, giving you freedom over the
              look and feel.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Can it be animated?</AccordionTrigger>
            <AccordionContent className="AccordionContent">
              <div className="AccordionContentText">
                Yes! You can animate the Accordion with CSS or JavaScript.
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        */}
      </div>
    </main>
  );
}
