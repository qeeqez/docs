import '@/app/global.css';
import {Inter} from 'next/font/google';
import {HomeLayout} from "@/components/layout/home";
import {baseOptions} from "@/lib/layout.shared";
import {Provider} from "@/provider";

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({children}: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
    <body className="text-foreground group/body overscroll-none font-sans antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]">
    <Provider>
      <HomeLayout {...baseOptions()}>{children}</HomeLayout>
    </Provider>
    </body>
    </html>
  );
}
