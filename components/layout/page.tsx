import type {AnchorProviderProps, TOCItemType} from "fumadocs-core/toc";
import {type ComponentProps, forwardRef, type ReactNode} from "react";
import {PageArticle, PageRoot} from "@/components/layout/docs/page";
import type {BreadcrumbProps} from "@/components/layout/docs/page/page-breadcrumb";
import {type FooterProps, PageFooter} from "@/components/layout/docs/page/page-footer";
import type {GithubBlockProps} from "@/components/layout/docs/page/page-github-block";
import {cn} from "../../lib/cn";

// Removed unused interface EditOnGitHubOptions

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

  github?: GithubBlockProps;
  lastUpdate?: Date | string | number;
}

interface DocsPageProps {
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

const EMPTY_BREADCRUMB: NonNullable<DocsPageProps["breadcrumb"]> = {};
const EMPTY_FOOTER: NonNullable<DocsPageProps["footer"]> = {};
const EMPTY_TOC_POPOVER: NonNullable<DocsPageProps["tableOfContentPopover"]> = {};
const EMPTY_TOC: NonNullable<DocsPageProps["tableOfContent"]> = {};
const EMPTY_TOC_ITEMS: NonNullable<DocsPageProps["toc"]> = [];

export function DocsPage({
  breadcrumb: {enabled: _breadcrumbEnabled = true, component: _breadcrumb, ..._breadcrumbProps} = EMPTY_BREADCRUMB,
  footer = EMPTY_FOOTER,
  container,
  full = false,
  tableOfContentPopover: {enabled: tocPopoverEnabled, component: _tocPopover, ...tocPopoverOptions} = EMPTY_TOC_POPOVER,
  tableOfContent: {enabled: tocEnabled, component: _tocReplace, ...tocOptions} = EMPTY_TOC,
  toc = EMPTY_TOC_ITEMS,
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
        {children}
        {footer.enabled !== false &&
          (footer.component ?? <PageFooter items={footer.items} github={footer.github} lastUpdate={footer.lastUpdate} className="py-8" />)}
      </PageArticle>
    </PageRoot>
  );
}

/**
 * Add typography styles
 */
export const DocsBody = forwardRef<HTMLDivElement, ComponentProps<"div">>((props, ref) => (
  <div ref={ref} {...props} className={cn("mt-8 prose prose-gray dark:prose-gray-invert flex-1", props.className)}>
    {props.children}
  </div>
));

DocsBody.displayName = "DocsBody";

export const DocsDescription = forwardRef<HTMLParagraphElement, ComponentProps<"p">>((props, ref) => {
  // don't render if no description provided
  if (props.children === undefined) return null;

  return (
    <p ref={ref} {...props} className={cn("text-sm text-fd-muted-foreground", props.className)}>
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

