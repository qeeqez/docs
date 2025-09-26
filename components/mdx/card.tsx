import Link from "fumadocs-core/link";
import {ArrowUpRight} from "lucide-react";
import type {IconName} from "lucide-react/dynamic";
import type {HTMLAttributes, ReactNode} from "react";
import {Icon} from "@/components/mdx/icon";
import {cn} from "@/lib/cn";

type Props = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  icon?: IconName;
  title: ReactNode;
  description?: ReactNode;

  href?: string;
  arrow?: boolean;
  cta?: string;
};

export const Card = ({icon, title, description, href, arrow, cta, ...props}: Props) => {
  const E = href ? Link : 'div';

  return <E
    {...props}
    className={cn(
      "block group relative overflow-hidden w-full",
      "my-2 p-6 rounded-2xl",
      "font-normal",
      "bg-fd-card border border-fd-border",
      href && "no-underline cursor-pointer",
      href && "focus-within:ring-2 focus-within:ring-fd-primary focus-within:ring-offset-2 focus-within:ring-offset-fd-background",
      href && "hover:-translate-y-0.5 hover:border-fd-primary/30 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-200",
      props.className,
    )}
    aria-label={href ? `Navigate to ${title}` : undefined}
  >
    {href && arrow &&
      <ArrowUpRight
        className={cn(
          "absolute top-5 right-5 h-4 w-4",
          "text-fd-muted-foreground group-hover:text-fd-primary transition-colors"
        )}
      />
    }
    {icon && Icon && (
      <div className={cn(
        "w-fit h-fit p-2 rounded-lg",
        "border shadow-sm",
        href ? "border-fd-primary/10 shadow-fd-primary/10 dark:border-fd-primary/20 dark:shadow-fd-primary/20 bg-fd-primary/10 dark:bg-fd-primary/20" : "border-fd-border shadow-fd-border bg-fd-background"
      )}>
        <Icon
          name={icon}
          className={cn(
            "h-5 w-5 text-fd-primary",
            href ? "text-fd-primary" : "text-fd-muted-foreground"
          )}
        />
      </div>
    )}
    <h2 className={cn(
      "not-prose text-lg font-semibold text-fd-foreground",
      icon && "mt-4",
      href && "group-hover:text-fd-primary transition-colors"
    )}>
      {title}
    </h2>
    <div
      className="mt-1 font-normal text-sm leading-6 text-gray-600 dark:text-gray-400 [&>p]:mb-2 [&>p:last-child]:mb-0">
      {props.children}
    </div>
  </E>;
};