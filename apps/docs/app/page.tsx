import { OTP, OTPInput } from '@lucide-ui/otp';

export default function Home() {
  return (
    <main className="flex relative items-center justify-center min-h-screen">
      <div className="w-100 mx-auto">
        <OTP className="flex items-center gap-2 mx-auto w-fit">
          <OTPInput className="inline-flex items-center justify-center text-sm h-9 w-6 rounded border text-center data-[active]:ring-2 outline-none transition">
            <div className="animate-caret-blink w-px h-4 bg-black" />
          </OTPInput>
          <OTPInput className="inline-flex items-center justify-center text-sm h-9 w-6 rounded border text-center data-[active]:ring-2 outline-none transition" />
          <OTPInput className="inline-flex items-center justify-center text-sm h-9 w-6 rounded border text-center data-[active]:ring-2 outline-none transition" />
          <div className="w-3 h-0.5 rounded-md bg-neutral-300" />
          <OTPInput className="inline-flex items-center justify-center text-sm h-9 w-6 rounded border text-center data-[active]:ring-2 outline-none transition" />
          <OTPInput className="inline-flex items-center justify-center text-sm h-9 w-6 rounded border text-center data-[active]:ring-2 outline-none transition" />
          <OTPInput className="inline-flex items-center justify-center text-sm h-9 w-6 rounded border text-center data-[active]:ring-2 outline-none transition" />
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
