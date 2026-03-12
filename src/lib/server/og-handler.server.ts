import "@tanstack/react-start/server-only";
import {generateOGImage} from "@/lib/og.server";
import {source} from "@/lib/source.server";
import {notFound} from "@tanstack/react-router";
import {LogoWideWhite} from "@/components/icons";
import {createElement} from "react";

export const ogImageHandler = async ({params, request}: {params: {lang: string; _splat?: string}; request: Request}) => {
  const splat = params._splat || "";
  const segments = splat.split("/");
  if (segments[segments.length - 1] === "image.png") {
    segments.pop();
  }

  const page = source.getPage(segments, params.lang);

  if (!page) {
    throw notFound();
  }

  const image = await generateOGImage(page, {
    icon: createElement(LogoWideWhite, {
      style: {height: 60, width: 360},
    }),
  });

  if (request.headers.get("x-og-prerender") === "base64") {
    const base64 = Buffer.from(await image.arrayBuffer()).toString("base64");
    return new Response(base64, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  return image;
};
