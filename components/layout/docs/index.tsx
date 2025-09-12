import type {PageTree} from 'fumadocs-core/server';
import type {SidebarComponents, SidebarProps} from "fumadocs-ui/components/layout/sidebar";
import {TreeContextProvider} from 'fumadocs-ui/contexts/tree';
import type {GetSidebarTabsOptions} from "fumadocs-ui/utils/get-sidebar-tabs";
import type {ComponentProps, HTMLAttributes, ReactNode,} from 'react';
import {Sidebar} from "@/components/layout/docs/sidebar/sidebar";

import {HomeLayout} from "@/components/layout/home";
import {baseOptions} from "@/lib/layout.shared";
import {cn} from '../../../lib/cn';
import type {BaseLayoutProps} from '../shared/index';
import {LayoutBody} from './client';
import {Option} from "fumadocs-ui/components/layout/root-toggle";
import {NavProvider} from "fumadocs-ui/contexts/layout";
import {
  PageTOC,
  PageTOCPopover,
  PageTOCPopoverContent,
  PageTOCPopoverTrigger
} from "@/components/layout/docs/page-client";
import {PageTOCItems, PageTOCPopoverItems, PageTOCTitle} from "@/components/layout/docs/page";
import {TOCProvider} from "@/components/ui/toc";

interface SidebarOptions
  extends ComponentProps<'aside'>,
    Pick<SidebarProps, 'defaultOpenLevel' | 'prefetch'> {
  enabled?: boolean;
  component?: ReactNode;
  components?: Partial<SidebarComponents>;

  /**
   * Root Toggle options
   */
  tabs?: Option[] | GetSidebarTabsOptions | false;

  banner?: ReactNode;
  footer?: ReactNode;

  /**
   * Support collapsing the sidebar on desktop mode
   *
   * @defaultValue true
   */
  collapsible?: boolean;
}

export interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;

  sidebar?: SidebarOptions;

  /**
   * Props for the `div` container
   */
  containerProps?: HTMLAttributes<HTMLDivElement>;
}


export function DocsLayout({
                             nav: {transparentMode, ...nav} = {},
                             searchToggle = {},
                             i18n = false,
                             children,
                             ...props
                           }: DocsLayoutProps) {
  return (
    <TreeContextProvider tree={props.tree}>
      <NavProvider transparentMode={transparentMode}>
        {/*{nav.enabled !== false &&*/}
        {/*  (nav.component ?? (*/}
        {/*    <Navbar className="h-14 md:hidden">*/}
        {/*      <Link*/}
        {/*        href={nav.url ?? '/'}*/}
        {/*        className="inline-flex items-center gap-2.5 font-semibold"*/}
        {/*      >*/}
        {/*        {nav.title}*/}
        {/*      </Link>*/}
        {/*      <div className="flex-1">{nav.children}</div>*/}
        {/*      {searchToggle.enabled !== false &&*/}
        {/*        (searchToggle.components?.sm ?? (*/}
        {/*          <SearchToggle className="p-2" hideIfDisabled />*/}
        {/*        ))}*/}
        {/*      {sidebarEnabled && (*/}
        {/*        <SidebarTrigger*/}
        {/*          className={cn(*/}
        {/*            buttonVariants({*/}
        {/*              color: 'ghost',*/}
        {/*              size: 'icon-sm',*/}
        {/*              className: 'p-2',*/}
        {/*            }),*/}
        {/*          )}*/}
        {/*        >*/}
        {/*          <SidebarIcon />*/}
        {/*        </SidebarTrigger>*/}
        {/*      )}*/}
        {/*    </Navbar>*/}
        {/*  ))}*/}
        {/*<div className="flex flex-col min-h-screen">*/}
        {/*  <LayoutBody*/}
        {/*    {...props_reference.mdx.containerProps}*/}
        {/*    className={cn(*/}
        {/*      // "max-w-fd-container mx-auto w-full flex flex-1",*/}
        {/*      "flex flex-1",*/}
        {/*      // 'md:[&_#nd-page_article]:pt-12 xl:[--fd-toc-width:286px] xl:[&_#nd-page_article]:px-8',*/}
        {/*      // !nav.component &&*/}
        {/*      // nav.enabled !== false &&*/}
        {/*      // '[--fd-nav-height:56px] md:[--fd-nav-height:0px]',*/}
        {/*      // props_reference.mdx.containerProps?.className,*/}
        {/*    )}*/}
        {/*  >*/}
        {/*    <div className="w-64 bg-gray-100 p-4 sticky top-0 h-screen">*/}
        {/*      <Sidebar/>*/}
        {/*    </div>*/}
        {/*    <div className="flex-1 p-6 overflow-y-auto max-h-screen">{children}</div>*/}
        {/*    <div className="w-64 bg-gray-50 p-4 sticky top-0 h-screen">right sidebar</div>*/}
        {/*  </LayoutBody>*/}
        {/*</div>*/}
        {children}
      </NavProvider>
    </TreeContextProvider>
  );
}