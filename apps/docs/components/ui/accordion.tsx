import * as AccordionPrimitive from '@react-ui/accordion';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

export function Accordion(
  props: React.ComponentProps<typeof AccordionPrimitive.Accordion>,
) {
  return <AccordionPrimitive.Accordion {...props} />;
}
export function AccordionItem(
  props: React.ComponentProps<typeof AccordionPrimitive.AccordionItem>,
) {
  return (
    <AccordionPrimitive.AccordionItem
      {...props}
      className={cn('w-full p-2 border-b last:border-none')}
    />
  );
}
export function AccordionTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.AccordionTrigger>) {
  return (
    <AccordionPrimitive.AccordionTrigger
      {...props}
      className={cn(
        'pl-2 pr-1 h-8 group transition focus-visible:bg-neutral-50 items-center flex rounded hover:bg-neutral-100 active:bg-neutral-200 w-full justify-between [&>svg]:size-4 [&>svg]:text-neutral-500',
        className,
      )}
    >
      {children}
      <ChevronRight className="group-data-[state=open]:rotate-90 transition-transform" />
    </AccordionPrimitive.AccordionTrigger>
  );
}
export function AccordionContent({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.AccordionContent>) {
  return (
    <AccordionPrimitive.AccordionContent className="data-[state=closed]:animate-accordion-close data-[state=closed]:fade-out data-[state=open]:animate-accordion-open data-[state=open]:fade-in overflow-hidden">
      <div className={cn('px-2 p-2 text-sm', className)} {...props} />
    </AccordionPrimitive.AccordionContent>
  );
}
