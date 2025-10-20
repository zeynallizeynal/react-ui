'use client';

import { Progress } from '@/components/ui/progress';
import { LuMinus, LuPlus } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Home() {
  const [value, setValue] = useState<number>(0);

  return (
    <main className="flex relative items-center justify-center min-h-screen">
      <div className="w-100 mx-auto space-y-2">
        <Progress value={value} />
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setValue((prevState) => prevState + 10)}
            variant="outline"
          >
            <LuPlus /> 10
          </Button>
          <Button
            onClick={() => setValue((prevState) => prevState - 10)}
            variant="outline"
          >
            <LuMinus /> 10
          </Button>
        </div>
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
