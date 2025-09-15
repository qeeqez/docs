import type {ComponentProps} from "react";
import {GithubEditOrIssue} from "@/components/layout/docs/page/page-github-edit-or-issue";
import type {GithubProps} from "@/components/layout/docs/page/page-github-type";
import {cn} from "@/lib/cn";

export interface GithubBlockProps extends GithubProps, ComponentProps<'div'> {
  raiseIssue?: boolean;
}

export function GithubBlock({owner, repo, sha = "main", path, raiseIssue = true, className}: GithubBlockProps) {
  return <div className={cn("flex flex-row gap-2", className)}>
    <GithubEditOrIssue mode="edit" owner={owner} repo={repo} sha={sha} path={path}/>
    {raiseIssue && <GithubEditOrIssue mode="issue" owner={owner} repo={repo} sha={sha} path={path}/>}
  </div>
}