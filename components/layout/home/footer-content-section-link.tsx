import Link from "fumadocs-core/link";
import type {ElementType} from "react";

export interface FooterSectionLinkProps {
  text: string;
  url: string;
  external?: boolean;
  Icon?: ElementType;
}

export function FooterContentSectionLink({text, url, external, Icon}: FooterSectionLinkProps) {
  return (
    <li className="flex items-center gap-2">
      {Icon && <Icon className="size-3.5 fill-black dark:fill-white" />}
      <Link href={url} external={external} className="text-xs text-fd-foreground hover:text-fd-primary transition-colors">
        {text}
      </Link>
    </li>
  );
}
