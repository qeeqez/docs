"use client";

import {useState} from "react";
import {useCopyButton} from "fumadocs-ui/utils/use-copy-button";
import {cn} from "@/lib/cn";
import {CopyButton} from "./copy-button";
import {ViewOptions} from "./view-options";

const cache = new Map<string, string>();

export interface LLMCopyButtonProps {
  /**
   * A URL to fetch the raw Markdown/MDX content of page
   */
  markdownUrl: string;
  /**
   * Source file URL on GitHub
   */
  githubUrl: string;
}

export function LLMCopyButton({markdownUrl, githubUrl}: LLMCopyButtonProps) {
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
    <div className={cn("rounded-lg [&_svg]:size-4 cursor-pointer border text-sm flex items-center h-7")}>
      <CopyButton isLoading={isLoading} checked={checked} onClick={onClick} />
      <ViewOptions markdownUrl={markdownUrl} githubUrl={githubUrl} onClick={onClick} />
    </div>
  );
}
