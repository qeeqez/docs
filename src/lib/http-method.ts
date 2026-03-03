const HTTP_METHODS = new Set(["get", "post", "put", "delete", "patch", "head", "options"]);

export function getHttpMethodFromPath(path?: string): string | undefined {
  if (!path) return undefined;
  const pathname = path.split("#")[0]?.split("?")[0] ?? "";
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 3 || parts[1] !== "api") return undefined;

  const leaf = parts.at(-1);
  if (!leaf) return undefined;

  const method = leaf.split("-")[0]?.toLowerCase();
  if (!method || !HTTP_METHODS.has(method)) return undefined;
  return method.toUpperCase();
}
