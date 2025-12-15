export function getPageImage(slugs: string[], locale?: string) {
  const segments = [...slugs, "image.png"];
  const lang = locale ?? "en";

  return {
    segments,
    url: `/${lang}/og/${segments.join("/")}`,
  };
}
