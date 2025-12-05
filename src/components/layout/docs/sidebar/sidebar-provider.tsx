"use client";

import {useMediaQuery} from "fumadocs-core/utils/use-media-query";
import {createContext, type ReactNode, useContext, useMemo} from "react";

interface SidebarProviderProps {
  children: ReactNode;
}

interface InternalContext {
  defaultOpenLevel: number;
  prefetch: boolean;
  level: number;
  isMobile: boolean;
}

export function useInternalContext(): InternalContext {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("<Sidebar /> component required.");

  return ctx;
}

export const SidebarContext = createContext<InternalContext | null>(null);

export function SidebarProvider({children}: SidebarProviderProps) {
  const isMobile = useMediaQuery("(width < 768px)") ?? false;
  const context = useMemo<InternalContext>(() => {
    return {
      defaultOpenLevel: 0,
      prefetch: true,
      level: 1,
      isMobile,
    };
  }, [isMobile]);

  return <SidebarContext.Provider value={context}>{children}</SidebarContext.Provider>;
}
