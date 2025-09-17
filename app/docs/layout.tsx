import type {ReactNode} from "react";
import {DocsLayout} from "@/components/layout/docs";
import {baseOptions} from "@/lib/layout.shared";
import {source} from "@/lib/source";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
  return (
    <DocsLayout tree={source.pageTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
