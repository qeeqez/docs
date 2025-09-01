import {useMemo} from "react";
import {FooterBottomLink} from "@/components/layout/home/footer-bottom-link";
import {FooterBottomLinks} from "@/lib/layout.shared";

export function FooterBottom() {
  const links = useMemo(() => FooterBottomLinks(), []);

  return <div className="flex flex-wrap justify-center space-x-2 text-xs text-fd-muted-foreground">
    <span>{`© ${new Date().getFullYear()} RIXL Inc.`}</span>
    {links.map((link, index) => (
      <div key={`${index}-${link.text}`} className="space-x-2">
        <span>•</span>
        <FooterBottomLink url={link.url} text={link.text}/>
      </div>
    ))}
  </div>
}