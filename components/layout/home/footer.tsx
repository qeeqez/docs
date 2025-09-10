import {FooterBottom} from "@/components/layout/home/footer-bottom";
import {FooterContent} from "@/components/layout/home/footer-content";
import {cn} from "@/lib/cn";

export function Footer() {
  return (
    <footer className={cn("w-full mx-auto py-9 space-y-9", "border-t bg-fd-background text-fd-foreground")}>
      <FooterContent />
      <FooterBottom />
    </footer>
  );
}
