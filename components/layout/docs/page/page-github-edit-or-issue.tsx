import {I18nLabel} from "fumadocs-ui/contexts/i18n";
import {Edit, TriangleAlert} from "lucide-react";
import type {ComponentProps} from "react";
import {buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/cn";
import type {GithubProps} from "@/components/layout/docs/page/page-github-type";

interface GithubEditOrIssueProps extends GithubProps, ComponentProps<"a"> {
  mode: "edit" | "issue";
}

export function GithubEditOrIssue({mode, owner, repo, sha, path, className}: GithubEditOrIssueProps) {
  const ghPath = path.startsWith("/") ? path.slice(1) : path;
  const href = mode === "edit"
    ? `https://github.com/${owner}/${repo}/blob/${sha}/${ghPath}`
    : `https://github.com/${owner}/${repo}/issues/new?title=Issue%20on%20docs&body=Path:%20${ghPath}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        buttonVariants({
          color: "secondary",
          size: "sm",
          className: "gap-1.5 not-prose",
        }),
        className,
      )}
    >
      {mode === "edit" ? (<>
        <Edit className="size-3.5"/>
        <I18nLabel label="editOnGithub"/> {/* TODO add correct label */}
      </>) : (<>
        <TriangleAlert className="size-3.5"/>
        <I18nLabel label="editOnGithub"/> {/* TODO add correct label */}
      </>)
      }
    </a>
  );
}