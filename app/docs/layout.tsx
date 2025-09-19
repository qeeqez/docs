import type {ReactNode} from "react";
import {baseOptions} from "@/lib/layout.shared";
import {HomeLayout} from "@/components/layout/home";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
  const options = baseOptions();
  options.searchToggle = {
    enabled: true
  };

  return (
    <HomeLayout footer={true} {...options}>{children}</HomeLayout>
  );
}
