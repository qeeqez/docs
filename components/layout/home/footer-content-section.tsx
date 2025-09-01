import Link from "fumadocs-core/link";

export interface FooterSection {
  title: string;
  links: Array<{
    text: string;
    url: string;
    external?: boolean;
  }>;
}

export function FooterContentSection({title, links}: FooterSection) {
  return <div>
    <h3 className="font-medium text-xs text-fd-muted-foreground mb-3 uppercase tracking-wide">
      {title}
    </h3>
    <ul className="space-y-2">
      {links.map((link, linkIndex) => (
        <li key={linkIndex}>
          <Link
            href={link.url}
            external={link.external}
            className="text-xs text-fd-foreground hover:text-fd-primary transition-colors"
          >
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  </div>
}