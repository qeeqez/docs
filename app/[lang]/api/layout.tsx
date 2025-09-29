import type {ReactNode} from "react";
import {HomeLayout} from "@/components/layout/home";
import {baseOptions} from "@/lib/layout.shared";

interface LayoutProps {
    children: ReactNode;
    params: Promise<{ lang: string }>; // Add this
}

export default async function Layout({children, params}: LayoutProps) {
    const { lang } = await params;
  const options = baseOptions(lang);
  return <HomeLayout {...options}>{children}</HomeLayout>;
}
