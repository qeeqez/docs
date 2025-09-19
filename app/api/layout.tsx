import type {ReactNode} from "react";
import {HomeLayout} from "@/components/layout/home";
import {baseOptions} from "@/lib/layout.shared";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
  const options = baseOptions();
  return <HomeLayout {...options} footer={false}>{children}</HomeLayout>;
}
