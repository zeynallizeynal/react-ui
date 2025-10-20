'use client';

import { useState } from 'react';
import { OTP, OTPSlot } from '@/components/ui/otp';

export default function Home() {
  const [value, setValue] = useState('');

  return (
    <main className="flex relative items-center justify-center min-h-screen">
      <div className="w-100 mx-auto">
        <OTP value={value} onValueChange={setValue}>
          <OTPSlot />
          <OTPSlot />
          <OTPSlot />
          <OTPSlot />
          <OTPSlot />
          <OTPSlot />
        </OTP>
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
