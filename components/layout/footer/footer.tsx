import type {ForwardedRef} from "react";
import {cn} from "@/lib/cn";
import {FooterBottom} from "./footer-bottom";
import {FooterContent} from "./footer-content";

interface Props {
  ref: ForwardedRef<HTMLElement>;
}

export function Footer({ref}: Props) {
  return (
    <footer className={cn("w-full mx-auto py-9 space-y-9", "border-t bg-fd-background text-fd-foreground")} ref={ref}>
      <FooterContent/>
      <FooterBottom/>
    </footer>
  );
}
