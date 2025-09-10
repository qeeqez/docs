import "@/app/global.css";
import {Inter} from "next/font/google";
import {HomeLayout} from "@/components/layout/home";
import {baseOptions} from "@/lib/layout.shared";
import {Provider} from "@/provider";
import {cn} from "@/lib/cn";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({children}: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn()} suppressHydrationWarning>
      <body className={cn(
        "group/body",
        "overflow-hidden h-screen",
        "text-foreground font-sans antialiased",
      )}>
        <div className="fixed left-0 right-0 top-0 bottom-0 h-screen w-screen overflow-auto overscroll-none"  >
          <Provider>
            <HomeLayout {...baseOptions()}>{children}</HomeLayout>
          </Provider>
        </div>
      </body>
    </html>
  );
}
