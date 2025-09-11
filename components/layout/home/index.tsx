"use client";

import {NavProvider} from "fumadocs-ui/contexts/layout";
import type {HTMLAttributes} from "react";
import {Footer} from "@/components/layout/home/footer";
import {cn} from "../../../lib/cn";
import type {BaseLayoutProps, NavOptions} from "../shared/index";
import {Header} from "@/components/layout/header/header";

export interface HomeLayoutProps extends BaseLayoutProps {
  nav?: Partial<
    NavOptions & {
    /**
     * Open mobile menu when hovering the trigger
     */
    enableHoverToOpen?: boolean;
  }
  >;
}

export function HomeLayout(props: HomeLayoutProps & HTMLAttributes<HTMLElement>) {
  const {nav = {}, links, githubUrl, i18n, searchToggle, ...rest} = props;

  return (
    <NavProvider transparentMode={nav?.transparentMode}>
      <div id="nd-home-layout" {...rest} className={cn("relative z-10 flex min-h-svh flex-col", rest.className)}>
        <Header links={links} nav={nav} searchToggle={searchToggle} i18n={i18n} githubUrl={githubUrl}/>
        <div className="max-w-[92rem] mx-auto px-8">
          {props.children}
        </div>
        <Footer/>
      </div>
    </NavProvider>
  );
}
