import {useMemo} from "react";
import {FooterBottomLinks} from "@/lib/layout.shared";
import {FooterBottomLink} from "./footer-bottom-link";

export function FooterBottom({lang}: {lang: string}) {
  const links = useMemo(() => FooterBottomLinks(lang), [lang]);

  return (
    <div className="flex flex-wrap justify-center space-x-2 text-xs text-fd-muted-foreground">
      <span>{`© ${new Date().getFullYear()} RIXL Inc.`}</span>
      {links.map((link, index) => (
        <div key={`${index}-${link.text}`} className="space-x-2">
          <span>•</span>
          <FooterBottomLink url={link.url} text={link.text} />
        </div>
      ))}
    </div>
  );
}
