import type {ReactNode} from "react";
import SharedLayout from "@/components/layout/shared/shared-layout";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
  return <SharedLayout lang="en" sidebar={false} searchToggle={false}>{children}</SharedLayout>
}
