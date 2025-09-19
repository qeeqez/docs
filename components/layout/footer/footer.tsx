import {cn} from "@/lib/cn";
import {FooterBottom} from "./footer-bottom";
import {FooterContent} from "./footer-content";

export function Footer() {
  return (
    <footer className={cn("w-full mx-auto py-9 space-y-9 h-footer", "border-t bg-fd-background text-fd-foreground")}>
      <FooterContent/>
      <FooterBottom/>
    </footer>
  );
}
