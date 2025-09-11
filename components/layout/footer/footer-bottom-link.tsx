import Link from "fumadocs-core/link";

interface Props {
  text: string;
  url: string;
}

export function FooterBottomLink({text, url}: Props) {
  return (
    <Link href={url} className="hover:text-fd-foreground transition-colors">
      {text}
    </Link>
  );
}
