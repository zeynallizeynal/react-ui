import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from '@react-ui/accordion';

export default function Home() {
  return (
    <main className="flex relative items-center justify-center min-h-screen">
      <Accordion>
        <AccordionTrigger>Trigger</AccordionTrigger>
        <AccordionContent className="absolute top-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out data-[state=open]:animate-in data-[state=open]:zoom-in">
          Content
        </AccordionContent>
      </Accordion>
    </main>
  );
}
