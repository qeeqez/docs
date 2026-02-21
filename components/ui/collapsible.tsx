"use client";
import {Collapsible as Primitive} from "radix-ui";
import {forwardRef, useRef, useSyncExternalStore} from "react";
import {cn} from "../../lib/cn";

const CollapsibleTrigger = Primitive.CollapsibleTrigger;

const subscribe = () => () => {};

const CollapsibleContent = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Primitive.CollapsibleContent>>(
  ({children, ...props}, ref) => {
    const mounted = useSyncExternalStore(subscribe, () => true, () => false);
    const hasRenderedRef = useRef(false);
    if (mounted) hasRenderedRef.current = true;
    const animationsEnabled = hasRenderedRef.current;

    return (
      <Primitive.CollapsibleContent
        ref={ref}
        {...props}
        className={cn(
          "overflow-hidden",
          animationsEnabled && "data-[state=closed]:animate-fd-collapsible-up data-[state=open]:animate-fd-collapsible-down",
          props.className
        )}
      >
        {children}
      </Primitive.CollapsibleContent>
    );
  }
);

CollapsibleContent.displayName = Primitive.CollapsibleContent.displayName;

export {CollapsibleTrigger};
