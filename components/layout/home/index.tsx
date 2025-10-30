"use client";

import {NavProvider} from "fumadocs-ui/contexts/layout";
import type {HTMLAttributes} from "react";
import {Sidebar} from "@/components/layout/docs/sidebar/sidebar";
import {SidebarWrapper} from "@/components/layout/docs/sidebar/sidebar-wrapper";
import {Header} from "@/components/layout/header/header";
import {Background} from "@/components/layout/home/background";
import {cn} from "@/lib/cn";
import type {BaseLayoutProps, NavOptions} from "../shared/index";

export interface HomeLayoutProps extends BaseLayoutProps, HTMLAttributes<HTMLElement> {
  nav?: Partial<
    NavOptions & {
    /**
     * Open mobile menu when hovering the trigger
     */
    enableHoverToOpen?: boolean;
  }
  >;
  sidebar?: boolean;
}

export function HomeLayout({nav = {}, links, githubUrl, i18n, searchToggle, sidebar = true, ...rest}: HomeLayoutProps) {
  return (
    <NavProvider transparentMode={nav?.transparentMode}>
      <div id="nd-home-layout" {...rest} className={cn("relative z-10 flex min-h-svh flex-col", rest.className)}>
        <Background/>
        <Header links={links} nav={nav} searchToggle={searchToggle} i18n={i18n} githubUrl={githubUrl}/>
        <div className="relative w-full max-w-368 mx-auto lg:px-8">
          {!sidebar
            ? rest.children
            : (
              <div id="nd-page" className="flex flex-row lg:gap-8 motion-safe:transition-all motion-safe:duration-300">
                <SidebarWrapper className="hidden xl:block">
                  <Sidebar/>
                </SidebarWrapper>
                {rest.children}
              </div>
            )}
        </div>
      </div>
    </NavProvider>
  );
}
