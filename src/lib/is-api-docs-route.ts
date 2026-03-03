export function isApiDocsRoute(href?: string): boolean {
  if (!href) return false;
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("#")) {
    return false;
  }

  const pathname = href.split("#")[0]?.split("?")[0] ?? "";
  const parts = pathname.split("/").filter(Boolean);

  return parts.length >= 2 && parts[1] === "api";
}
