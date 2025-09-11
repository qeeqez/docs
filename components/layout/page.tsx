import type {TOCItemType} from "fumadocs-core/server";
import type {AnchorProviderProps} from "fumadocs-core/toc";
import {I18nLabel} from "fumadocs-ui/contexts/i18n";
import {Edit, TriangleAlert} from "lucide-react";
import {type ComponentProps, forwardRef, type ReactNode} from "react";
import {cn} from "../../lib/cn";
import {buttonVariants} from "../ui/button";
import {
  type BreadcrumbProps,
  type FooterProps,
  PageArticle,
  PageBreadcrumb,
  PageFooter,
  PageLastUpdate,
  PageRoot,
  PageTOC,
  PageTOCItems,
  PageTOCPopover,
  PageTOCPopoverContent,
  PageTOCPopoverItems,
  PageTOCPopoverTrigger,
  PageTOCTitle,
} from "./docs/page";

interface EditOnGitHubOptions extends Omit<ComponentProps<"a">, "href" | "children"> {
  owner: string;
  repo: string;

  /**
   * SHA or ref (branch or tag) name.
   *
   * @defaultValue main
   */
  sha?: string;

  /**
   * File path in the repo
   */
  path: string;
  raiseIssue?: boolean
}

interface BreadcrumbOptions extends BreadcrumbProps {
  enabled: boolean;
  component: ReactNode;

  /**
   * Show the full path to the current page
   *
   * @defaultValue false
   * @deprecated use `includePage` instead
   */
  full?: boolean;
}

interface FooterOptions extends FooterProps {
  enabled: boolean;
  component: ReactNode;
}

export interface DocsPageProps {
  toc?: TOCItemType[];
  tableOfContent?: Partial<TableOfContentOptions>;
  tableOfContentPopover?: Partial<TableOfContentPopoverOptions>;

  /**
   * Extend the page to fill all available space
   *
   * @defaultValue false
   */
  full?: boolean;

  /**
   * Replace or disable breadcrumb
   */
  breadcrumb?: Partial<BreadcrumbOptions>;

  /**
   * Footer navigation, you can disable it by passing `false`
   */
  footer?: Partial<FooterOptions>;

  editOnGithub?: EditOnGitHubOptions;
  lastUpdate?: Date | string | number;

  container?: ComponentProps<"div">;
  article?: ComponentProps<"article">;
  children?: ReactNode;
}

type TableOfContentOptions = Pick<AnchorProviderProps, "single"> & {
  /**
   * Custom content in TOC container, before the main TOC
   */
  header?: ReactNode;

  /**
   * Custom content in TOC container, after the main TOC
   */
  footer?: ReactNode;

  enabled: boolean;
  component: ReactNode;

  /**
   * @defaultValue 'normal'
   */
  style?: "normal" | "clerk";
};

type TableOfContentPopoverOptions = Omit<TableOfContentOptions, "single">;

export function DocsPage({
                           editOnGithub,
                           breadcrumb: {
                             enabled: breadcrumbEnabled = true,
                             component: breadcrumb,
                             ...breadcrumbProps
                           } = {},
                           footer = {},
                           lastUpdate,
                           container,
                           full = false,
                           tableOfContentPopover: {
                             enabled: tocPopoverEnabled,
                             component: tocPopover,
                             ...tocPopoverOptions
                           } = {},
                           tableOfContent: {enabled: tocEnabled, component: tocReplace, ...tocOptions} = {},
                           toc = [],
                           article,
                           children,
                         }: DocsPageProps) {
  // disable TOC on full mode, you can still enable it with `enabled` option.
  tocEnabled ??= !full && (toc.length > 0 || tocOptions.footer !== undefined || tocOptions.header !== undefined);

  tocPopoverEnabled ??= toc.length > 0 || tocPopoverOptions.header !== undefined || tocPopoverOptions.footer !== undefined;

  return (
    <PageRoot
      toc={
        tocEnabled || tocPopoverEnabled
          ? {
            toc,
            single: tocOptions.single,
          }
          : false
      }
      {...container}
      className={cn(!tocEnabled && "[--fd-toc-width:0px]", container?.className)}
    >
      <PageArticle {...article}>
        {breadcrumbEnabled && (breadcrumb ?? <PageBreadcrumb {...breadcrumbProps} />)}
        {children}
        <div className="flex flex-row flex-wrap items-center justify-between gap-4 empty:hidden">
          {editOnGithub && (
            <div className="flex flex-row gap-2">
              <EditOnGitHub mode="edit" owner="qeeqez" repo="docs" sha="main" path={editOnGithub.path}/>
              {editOnGithub.raiseIssue && <EditOnGitHub mode="issue" owner="qeeqez" repo="docs" sha="main" path={editOnGithub.path}/>}
            </div>
          )}
          {lastUpdate && <PageLastUpdate date={new Date(lastUpdate)}/>}
        </div>
        {footer.enabled !== false && (footer.component ?? <PageFooter items={footer.items}/>)}
      </PageArticle>
    </PageRoot>
  );
}

interface GithubHelperProps extends ComponentProps<"a"> {
  mode: "edit" | "issue";
  owner: string;
  repo: string;
  sha: string;
  path: string;
  className?: string;
}

export function EditOnGitHub({mode, owner, repo, sha, path, className}: GithubHelperProps) {
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

/**
 * Add typography styles
 */
export const DocsBody = forwardRef<HTMLDivElement, ComponentProps<"div">>((props, ref) => (
  <div ref={ref} {...props} className={cn("prose flex-1", props.className)}>
    {props.children}
  </div>
));

DocsBody.displayName = "DocsBody";

export const DocsDescription = forwardRef<HTMLParagraphElement, ComponentProps<"p">>((props, ref) => {
  // don't render if no description provided
  if (props.children === undefined) return null;

  return (
    <p ref={ref} {...props} className={cn("mb-8 text-lg text-fd-muted-foreground", props.className)}>
      {props.children}
    </p>
  );
});

DocsDescription.displayName = "DocsDescription";

export const DocsTitle = forwardRef<HTMLHeadingElement, ComponentProps<"h1">>((props, ref) => {
  return (
    <h1 ref={ref} {...props} className={cn("text-[1.75em] font-semibold", props.className)}>
      {props.children}
    </h1>
  );
});

DocsTitle.displayName = "DocsTitle";

/**
 * For separate MDX page
 */
export function withArticle(props: ComponentProps<"main">): ReactNode {
  return (
    <main {...props} className={cn("container py-12", props.className)}>
      <article className="prose">{props.children}</article>
    </main>
  );
}
