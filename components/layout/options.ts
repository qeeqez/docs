import type {BreadcrumbOptions} from "fumadocs-core/breadcrumb";
import type {AnchorProviderProps, TOCItemType} from "fumadocs-core/toc";
import type {ComponentProps, ReactNode} from "react";
import type {FooterProps} from "@/components/layout/docs/page/page-footer";
import type {GithubBlockProps} from "@/components/layout/docs/page/page-github-block";

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

  editOnGithub?: GithubBlockProps;
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