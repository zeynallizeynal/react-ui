import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@react-ui/accordion';

export default function Home() {
  return (
    <main className="flex relative items-center justify-center min-h-screen">
      <Accordion type="single">
        <AccordionItem value="test">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent className="data-[state=closed]:animate-out data-[state=closed]:zoom-out data-[state=open]:animate-in data-[state=open]:zoom-in">
            Content
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="test1">
          <AccordionTrigger>Trigger2</AccordionTrigger>
          <AccordionContent className="data-[state=closed]:animate-out data-[state=closed]:zoom-out data-[state=open]:animate-in data-[state=open]:zoom-in">
            Content2
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
