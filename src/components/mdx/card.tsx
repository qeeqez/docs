import {Link} from "@tanstack/react-router";
import {ArrowUpRight} from "lucide-react";
import type {IconName} from "lucide-react/dynamic";
import type {HTMLAttributes, ReactNode} from "react";
import {Icon} from "@/components/mdx/icon";
import {cn} from "@/lib/cn";

type ArrowType = boolean | "true" | "false";

type Props = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  icon?: IconName;
  title: ReactNode;
  description?: ReactNode;

  href?: string;
  arrow?: ArrowType;
  cta?: string;
};

const isExternalLink = (href: string): boolean => {
  return href.startsWith("http://") || href.startsWith("https://");
};

const showArrow = (href?: string, arrow?: ArrowType) => {
  if (!href) return false;

  if (arrow === true || arrow === "true") return true;
  if (arrow === false || arrow === "false") return false;

  return isExternalLink(href);
};

export const Card = ({icon, title, description: _description, href, arrow, cta: _cta, ...props}: Props) => {
  const isExternal = !!href && isExternalLink(href);
  const E: any = href ? (isExternal ? "a" : Link) : "div";

  return (
    <E
      {...props}
      {...(href ? {href} : {})}
      {...(isExternal ? {target: "_blank", rel: "noopener noreferrer"} : {})}
      className={cn(
        "block group relative overflow-hidden w-full",
        "my-2 p-6 rounded-2xl",
        "font-normal",
        "bg-fd-card border border-fd-border",
        href && "no-underline cursor-pointer",
        href && "focus-within:ring-2 focus-within:ring-fd-primary focus-within:ring-offset-2 focus-within:ring-offset-fd-background",
        href && "hover:-translate-y-0.5 hover:border-fd-primary/30 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-200",
        props.className
      )}
      aria-label={href ? `Navigate to ${title}` : undefined}
    >
      {showArrow(href, arrow) && (
        <ArrowUpRight
          className={cn("absolute top-5 right-5 h-4 w-4", "text-fd-muted-foreground group-hover:text-fd-primary transition-colors")}
        />
      )}
      {/*{icon && Icon && ( TODO fix icon*/}
      {/*  <div*/}
      {/*    className={cn(*/}
      {/*      "w-fit h-fit p-2 rounded-lg",*/}
      {/*      "border shadow-sm",*/}
      {/*      href*/}
      {/*        ? "border-fd-primary/10 shadow-fd-primary/10 dark:border-fd-primary/20 dark:shadow-fd-primary/20 bg-fd-primary/10 dark:bg-fd-primary/20"*/}
      {/*        : "border-fd-border shadow-fd-border bg-fd-background"*/}
      {/*    )}*/}
      {/*  >*/}
      {/*    <Icon name={icon} className={cn("h-5 w-5 text-fd-primary", href ? "text-fd-primary" : "text-fd-muted-foreground")} />*/}
      {/*  </div>*/}
      {/*)}*/}
      <h2
        className={cn(
          "not-prose text-lg font-semibold text-fd-foreground",
          icon && "mt-4",
          href && "group-hover:text-fd-primary transition-colors"
        )}
      >
        {title}
      </h2>
      <div className="mt-1 font-normal text-sm leading-6 text-gray-600 dark:text-gray-400 [&>p]:mb-2 [&>p:last-child]:mb-0">
        {props.children}
      </div>
    </E>
  );
};
