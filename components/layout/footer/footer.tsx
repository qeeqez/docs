import {FooterBottom} from "./footer-bottom";
import {FooterContent} from "./footer-content";

export function Footer() {
  return (
    <footer className="w-full mx-auto py-9 space-y-9 border-t">
      <FooterContent/>
      <FooterBottom/>
    </footer>
  );
}
