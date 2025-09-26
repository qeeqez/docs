import type {ReactNode} from "react";
import {baseOptions} from "@/lib/layout.shared";
import {HomeLayout} from "@/components/layout/home";

interface LayoutProps {
    children: ReactNode;
    params: Promise<{ lang: string }>; // Add this
}

export default async function Layout({children, params}: LayoutProps) {
    const { lang } = await params;
    const options = baseOptions(lang);

      options.searchToggle = {
        enabled: true
      };

  return (
    <HomeLayout {...options}>{children}</HomeLayout>
  );
}
