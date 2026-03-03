const apiDocs = import.meta.glob("../content/*/api/**/*.{mdx,md}", {
  query: {
    collection: "docs",
  },
  eager: true,
});

const eagerApiDocMap = new Map<string, unknown>();

for (const [entryPath, loaded] of Object.entries(apiDocs)) {
  const normalized = entryPath.replace(/^..\/content\//u, "");
  eagerApiDocMap.set(normalized, loaded);
}

export function getEagerApiDoc(path: string) {
  return eagerApiDocMap.get(path);
}
