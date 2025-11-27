import Link from "fumadocs-core/link";
import {ReactNode} from "react";

interface LogoProps {
  title: ReactNode;
  url?: string;
  className?: string;
}

export function Logo({title, url, className}: LogoProps) {
  return (
    <Link href={url ?? "/"} className={className}>
      {title}
    </Link>
  );
}
