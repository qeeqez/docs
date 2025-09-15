"use client";

import {createContext} from "fumadocs-core/framework";
import {useActiveAnchor} from "fumadocs-core/toc";
import {useEffectEvent} from "fumadocs-core/utils/use-effect-event";
import {useI18n} from "fumadocs-ui/contexts/i18n";
import {useNav} from "fumadocs-ui/contexts/layout";
import {useSidebar} from "fumadocs-ui/contexts/sidebar";
import {useTreePath} from "fumadocs-ui/contexts/tree";
import {ChevronDown} from "lucide-react";
import {type ComponentProps, useEffect, useMemo, useRef, useState} from "react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {useTOCItems} from "@/components/ui/toc";
import {cn} from "@/lib/cn";

export function PageTOC(props: ComponentProps<"div">) {
  const {collapsed} = useSidebar();
  const items = useTOCItems();

  if(items.length === 0) return null;

  return (
    <div
      id="nd-toc"
      {...props}
      className={cn(
        "",
        // 'fixed bottom-0 pt-12 pb-2 pr-(--removed-body-scroll-bar-size,0) max-xl:hidden',
        props.className,
      )}
      style={{
        ...props.style,
        // top: 'calc(var(--fd-banner-height) + var(--fd-nav-height))',
        // insetInlineEnd: `max(${offset}, calc(50vw - var(--fd-sidebar-width)/2 - var(--fd-page-width)/2))`,
      }}
    >
      {/*<div className="flex h-full w-(--fd-toc-width) max-w-full flex-col pe-4">*/}
      {props.children}
      {/*</div>*/}
    </div>
  );
}


const TocPopoverContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>("TocPopoverContext");

export function PageTOCPopoverTrigger(props: ComponentProps<"button">) {
  const {text} = useI18n();
  const {open} = TocPopoverContext.use();
  const items = useTOCItems();
  const active = useActiveAnchor();
  const selected = useMemo(() => items.findIndex((item) => active === item.url.slice(1)), [items, active]);
  const path = useTreePath().at(-1);
  const showItem = selected !== -1 && !open;

  return (
    <CollapsibleTrigger
      {...props}
      className={cn(
        "flex w-full h-(--fd-tocnav-height) items-center text-sm text-fd-muted-foreground gap-2.5 px-4 py-2.5 text-start focus-visible:outline-none [&_svg]:size-4 md:px-6",
        props.className,
      )}
    >
      <ProgressCircle value={(selected + 1) / Math.max(1, items.length)} max={1}
                      className={cn("shrink-0", open && "text-fd-primary")}/>
      <span className="grid flex-1 *:my-auto *:row-start-1 *:col-start-1">
        <span
          className={cn(
            "truncate transition-all",
            open && "text-fd-foreground",
            showItem && "opacity-0 -translate-y-full pointer-events-none",
          )}
        >
          {path?.name ?? text.toc}
        </span>
        <span className={cn("truncate transition-all", !showItem && "opacity-0 translate-y-full pointer-events-none")}>
          {items[selected]?.title}
        </span>
      </span>
      <ChevronDown className={cn("shrink-0 transition-transform mx-0.5", open && "rotate-180")}/>
    </CollapsibleTrigger>
  );
}


interface ProgressCircleProps extends Omit<React.ComponentProps<"svg">, "strokeWidth"> {
  value: number;
  strokeWidth?: number;
  size?: number;
  min?: number;
  max?: number;
}

function clamp(input: number, min: number, max: number): number {
  if (input < min) return min;
  if (input > max) return max;
  return input;
}

function ProgressCircle({value, strokeWidth = 2, size = 24, min = 0, max = 100, ...restSvgProps}: ProgressCircleProps) {
  const normalizedValue = clamp(value, min, max);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (normalizedValue / max) * circumference;
  const circleProps = {
    cx: size / 2,
    cy: size / 2,
    r: radius,
    fill: "none",
    strokeWidth,
  };

  return (
    <svg
      role="progressbar"
      viewBox={`0 0 ${size} ${size}`}
      aria-valuenow={normalizedValue}
      aria-valuemin={min}
      aria-valuemax={max}
      {...restSvgProps}
    >
      <circle {...circleProps} className="stroke-current/25"/>
      <circle
        {...circleProps}
        stroke="currentColor"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all"
      />
    </svg>
  );
}

export function PageTOCPopoverContent(props: ComponentProps<"div">) {
  return (
    <CollapsibleContent data-toc-popover="" {...props}
                        className={cn("flex flex-col px-4 max-h-[50vh] md:px-6", props.className)}>
      {props.children}
    </CollapsibleContent>
  );
}

export function PageTOCPopover(props: ComponentProps<"div">) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const {collapsed} = useSidebar();
  const {isTransparent} = useNav();

  const onClick = useEffectEvent((e: Event) => {
    if (!open) return;

    if (ref.current && !ref.current.contains(e.target as HTMLElement)) setOpen(false);
  });

  useEffect(() => {
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, [onClick]);

  return (
    <TocPopoverContext.Provider
      value={useMemo(
        () => ({
          open,
          setOpen,
        }),
        [setOpen, open],
      )}
    >
      <Collapsible open={open} onOpenChange={setOpen} asChild>
        <header
          ref={ref}
          id="nd-tocnav"
          {...props}
          className={cn(
            "absolute xl:hidden w-full min-h-10 z-10 border-b backdrop-blur-sm transition-colors ",
            (!isTransparent || open) && "bg-fd-background/80",
            open && "shadow-lg",
            props.className,
          )}
          style={{
            ...props.style,
            top: "calc(var(--fd-banner-height) + var(--fd-nav-height))",
            insetInlineStart: collapsed ? "0px" : "calc(var(--fd-sidebar-width) + var(--fd-layout-offset))",
            insetInlineEnd: 0,
          }}
        >
          {props.children}
        </header>
      </Collapsible>
    </TocPopoverContext.Provider>
  );
}