"use client";

import {NavProvider} from "fumadocs-ui/contexts/layout";
import {type HTMLAttributes, useCallback, useEffect, useRef} from "react";
import {Footer} from "@/components/layout/footer/footer";
import {Header} from "@/components/layout/header/header";
import {cn} from "@/lib/cn";
import type {BaseLayoutProps, NavOptions} from "../shared/index";
import {Background} from "@/components/layout/home/background";

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

  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();

  const calculateDynamicHeight = useCallback(() => {
    if (!headerRef.current || !footerRef.current) return;

    const headerHeight = headerRef.current.offsetHeight;
    const footerRect = footerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    let height = viewportHeight - headerHeight;
    if (footerRect.top < viewportHeight) {
      height -= Math.min(footerRect.height, viewportHeight - footerRect.top)
    }

    document.documentElement.style.setProperty("--sidebar-top", `${headerHeight}px`);
    document.documentElement.style.setProperty("--sidebar-height", `${height}px`);
  }, []);

  // TODO rework throttle update to prevent flickering
  useEffect(() => {
    const throttledUpdate = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(calculateDynamicHeight);
    };

    calculateDynamicHeight();

    window.addEventListener('scroll', throttledUpdate, {passive: true});
    window.addEventListener('resize', throttledUpdate, {passive: true});
    const observer = new MutationObserver(() => {
        requestAnimationFrame(calculateDynamicHeight)
      }
    );
    observer.observe(document.documentElement, {
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"]
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", throttledUpdate);
      window.removeEventListener("resize", throttledUpdate);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }
  }, [headerRef, footerRef]);

  return (
    <NavProvider transparentMode={nav?.transparentMode}>
      <div id="nd-home-layout" {...rest} className={cn("relative z-10 flex min-h-svh flex-col", rest.className)}>
        <Background />
        <Header links={links} nav={nav} searchToggle={searchToggle} i18n={i18n} githubUrl={githubUrl} ref={headerRef}/>
        <div className="w-full max-w-[92rem] mx-auto lg:px-8">
          {props.children}
        </div>
        <Footer ref={footerRef}/>
      </div>
    </NavProvider>
  );
}
