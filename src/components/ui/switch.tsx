'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const localRef = React.useRef<HTMLElement | null>(null);
  const combinedRef = (node: HTMLElement | null) => {
    localRef.current = node;
    if (typeof ref === 'function') ref(node as any);
    else if (ref)
      (ref as React.MutableRefObject<HTMLElement | null>).current = node;
  };

  const [isActive, setIsActive] = React.useState(false);

  console.log(isActive);

  React.useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      const state = el.getAttribute('data-state');
      setIsActive(state === 'checked');
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-state'] });

    setIsActive(el.getAttribute('data-state') === 'checked');

    return () => observer.disconnect();
  }, []);
  return (
    <SwitchPrimitives.Root
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-input',
        className,
        isActive && 'bg-main',
      )}
      {...props}
      ref={combinedRef}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        )}
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
