"use client";

import {cva} from "class-variance-authority";
import {Popover, PopoverContent} from "fumadocs-ui/components/ui/popover";
import {useCopyButton} from "fumadocs-ui/utils/use-copy-button";
import {Check, ChevronDown, Copy, ExternalLinkIcon} from "lucide-react";
import Link from "next/link";
import {type MouseEvent, type MouseEventHandler, type ReactNode, useCallback, useMemo, useState} from "react";
import {cn} from "../lib/cn";
import {PopoverTrigger} from "@/components/ui/popover";

const cache = new Map<string, string>();

// TODO Provide translation strings
export function LLMCopyButton({
  /**
   * A URL to fetch the raw Markdown/MDX content of page
   */
  markdownUrl,
  githubUrl,
}: {
  markdownUrl: string;
  githubUrl: string;
}) {
  const [isLoading, setLoading] = useState(false);
  const [checked, onClick] = useCopyButton(async () => {
    const cached = cache.get(markdownUrl);
    if (cached) return navigator.clipboard.writeText(cached);

    setLoading(true);

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": fetch(markdownUrl).then(async (res) => {
            const content = await res.text();
            cache.set(markdownUrl, content);

            return content;
          }),
        }),
      ]);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className={cn("rounded-lg [&_svg]:size-4 cursor-pointer border text-sm " + "flex items-center h-7")}>
      <button
        type={`button`}
        disabled={isLoading}
        onClick={onClick}
        className={cn(
          "flex items-center rounded-l-lg gap-2 cursor-pointer h-full px-2 border-r text-fd-accent-foreground hover:bg-fd-muted-foreground/10"
        )}
      >
        {checked ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        <span className="text-xs font-medium">{checked ? "Copied" : "Copy"}</span>
      </button>

      <ViewOptions markdownUrl={markdownUrl} githubUrl={githubUrl} onClick={onClick} />
    </div>
  );
}

const optionVariants = cva(
  cn("group p-2 [&_svg]:size-4 rounded-lg inline-flex items-center gap-2 cursor-pointer", "hover:bg-fd-muted-foreground/5", "text-sm")
);

function OptionContent({title, desc, icon, href}: {title: string; desc: string; icon: ReactNode; href?: string}) {
  return (
    <>
      <span className="w-10 h-10 border text-fd-muted-foreground/75 group-hover:text-fd-accent-foreground/80 flex items-center justify-center rounded-lg">
        {icon}
      </span>
      <span className={cn("block")}>
        <span className={cn("flex gap-2 items-center font-medium")}>
          {title}
          {href ? <ExternalLinkIcon className="text-fd-muted-foreground size-3.5" /> : null}
        </span>
        <span className={cn("text-xs text-fd-muted-foreground")}>{desc}</span>
      </span>
    </>
  );
}

interface Props {
  /**
   * A URL to the raw Markdown/MDX content of page
   */
  markdownUrl: string;

  /**
   * Source file URL on GitHub
   */
  githubUrl: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

function ViewOptions({markdownUrl, githubUrl: _githubUrl, onClick}: Props) {
  const [open, setOpen] = useState(false);

  const handleCopyClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      setOpen(false);
    },
    [onClick]
  );

  const options = useMemo(() => {
    const fullMarkdownUrl = typeof window !== "undefined" ? new URL(markdownUrl, window.location.origin).toString() : markdownUrl;
    const q = `Read ${fullMarkdownUrl}, I want to ask questions about it.`;

    return [
      {
        key: "copy",
        title: "Copy page",
        desc: "Copy page as Markdown for LLMs",
        icon: <Copy />,
        onClick: handleCopyClick,
      },
      {
        key: "chatgpt",
        title: "Open in ChatGPT",
        href: `https://chatgpt.com/?${new URLSearchParams({hints: "search", q})}`,
        icon: (
          <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <title>OpenAI</title>
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
          </svg>
        ),
        desc: "Ask questions about this page",
      },
      {
        key: "claude",
        title: "Open in Claude",
        href: `https://claude.ai/new?${new URLSearchParams({q})}`,
        icon: (
          <svg fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title>Anthropic</title>
            <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
          </svg>
        ),
        desc: "Ask questions about this page",
      },
    ];
  }, [handleCopyClick, markdownUrl]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="cursor-pointer text-fd-accent-foreground hover:bg-fd-muted-foreground/10 rounded-r-lg px-2 h-full">
        <ChevronDown className="w-3.5 h-3.5" />
      </PopoverTrigger>
      <PopoverContent align="end" className="flex flex-col overflow-auto border mt-2 bg-fd-background">
        {options.map((option) =>
          option.href ? (
            <Link key={option.key} href={option.href} rel="noreferrer noopener" target="_blank" className={cn(optionVariants())}>
              <OptionContent title={option.title} desc={option.desc} icon={option.icon} href={option.href} />
            </Link>
          ) : (
            <button key={option.key} type="button" className={cn(optionVariants())} onClick={option.onClick}>
              <OptionContent title={option.title} desc={option.desc} icon={option.icon} />
            </button>
          )
        )}
      </PopoverContent>
    </Popover>
  );
}
