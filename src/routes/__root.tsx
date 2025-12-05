import {createRootRoute, HeadContent, Outlet, Scripts, useParams} from "@tanstack/react-router";
import * as React from "react";
import appCss from "@/styles/app.css?url";
import {Provider} from "@/components/layout/shared/provider.tsx";
import {Body} from "@/components/layout/shared/layout-client.tsx";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Fumadocs on TanStack Start", // TODO check what to set
      },
    ],
    links: [{rel: "stylesheet", href: appCss}],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({children}: {children: React.ReactNode}) {
  const {lang} = useParams({strict: false});

  return (
    <html suppressHydrationWarning className="scroll-smooth overscroll-y-none" style={{fontFamily: "Inter, system-ui, sans-serif"}}>
      <head>
        <HeadContent />
      </head>
      <Body>
        <Provider lang={lang}>{children}</Provider>
        <Scripts />
      </Body>
    </html>
  );
}
