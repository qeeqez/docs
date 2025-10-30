import './global.css';
import {NextProvider} from 'fumadocs-core/framework/next';
import {TreeContextProvider} from 'fumadocs-ui/contexts/tree';
import {Inter} from 'next/font/google';
import type {ReactNode} from 'react';
import {Body} from '@/app/layout.client';
import {cn} from "@/lib/cn";
import {baseOptions} from "@/lib/layout.shared";
import {source} from '@/lib/source';
import {Provider} from './provider';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

interface LayoutProps {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}

export default async function RootLayout({children, params}: LayoutProps) {
  const lang = (await params).lang ?? 'en';
  const tree = source.pageTree[lang] ?? source.pageTree;

  return (
    <html
      lang={lang}
      className={cn(
        "scroll-smooth overscroll-y-none",
        inter.className
      )}
      suppressHydrationWarning
    >
    <Body>
      <NextProvider>
        <TreeContextProvider tree={tree}>
          <Provider lang={lang}>
            {children}
          </Provider>
        </TreeContextProvider>
      </NextProvider>
    </Body>
    </html>
  );
}
