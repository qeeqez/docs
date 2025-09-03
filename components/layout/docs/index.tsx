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
    <HomeLayout {...baseOptions()} >
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
          <LayoutBody
            {...props.containerProps}
            className={cn(
              "flex flex-row *:max-w-fd-container",
              'md:[&_#nd-page_article]:pt-12 xl:[--fd-toc-width:286px] xl:[&_#nd-page_article]:px-8',
              !nav.component &&
              nav.enabled !== false &&
              '[--fd-nav-height:56px] md:[--fd-nav-height:0px]',
              props.containerProps?.className,
            )}
          >
            <div className="w-60"><Sidebar/></div>
            <div className="min-w-0 max-w-prose">{children}</div>
          </LayoutBody>
        </NavProvider>
      </TreeContextProvider>
    </HomeLayout>
  );
}