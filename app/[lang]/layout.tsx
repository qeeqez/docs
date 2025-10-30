import type {ReactNode} from 'react';
import SharedLayout from "@/components/layout/shared/shared-layout";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function RootLayout({children, params}: LayoutProps) {
  const lang = (await params).lang ?? 'en';
  return <SharedLayout lang={lang}>{children}</SharedLayout>
}
