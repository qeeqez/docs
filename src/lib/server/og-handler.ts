import {generateOGImage} from "@/lib/og";
import {source} from "@/lib/source";
import {notFound} from "@tanstack/react-router";

export const ogImageHandler = async ({params}: {params: {lang: string; _splat?: string}}) => {
  const splat = params._splat || "";
  // The URL is like /path/to/page/image.png

  const segments = splat.split("/");
  // Remove the last segment if it is "image.png"
  if (segments[segments.length - 1] === "image.png") {
    segments.pop();
  }

  const page = source.getPage(segments, params.lang);

  if (!page) {
    throw notFound();
  }

  return await generateOGImage(page);
};
