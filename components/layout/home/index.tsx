"use client";

import {NavProvider} from "fumadocs-ui/contexts/layout";
import type {HTMLAttributes} from "react";
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
}

export function HomeLayout({nav = {}, links, githubUrl, i18n, searchToggle, ...rest}: HomeLayoutProps) {
  return (
    <NavProvider transparentMode={nav?.transparentMode}>
      <div id="nd-home-layout" {...rest} className={cn("relative z-10 flex min-h-svh flex-col", rest.className)}>
        <Background />
        <Header links={links} nav={nav} searchToggle={searchToggle} i18n={i18n} githubUrl={githubUrl}/>
        <div className="relative w-full max-w-[92rem] mx-auto lg:px-8">
          {rest.children}
        </div>
      </div>
    </NavProvider>
  );
}
