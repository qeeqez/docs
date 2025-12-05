import {FooterBottom} from "./footer-bottom";
import {FooterContent} from "./footer-content";

export function Footer({lang}: {lang: string}) {
  return (
    <footer className="w-full mx-auto py-9 space-y-9 border-t">
      <FooterContent lang={lang} />
      <FooterBottom lang={lang} />
    </footer>
  );
}
