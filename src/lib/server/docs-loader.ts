import {notFound} from "@tanstack/react-router";
import {createServerFn} from "@tanstack/react-start";
import {staticFunctionMiddleware} from "@tanstack/start-static-server-functions";
import type {Folder, Node, Root} from "fumadocs-core/page-tree";
import type {ApiPageProps} from "fumadocs-openapi/ui";
import {source} from "@/lib/source";

export const loader = createServerFn({
  method: "GET",
})
  .inputValidator((params: {slugs: string[]; lang?: string}) => params)
  .middleware([staticFunctionMiddleware]) // used for tanstack static rendering
  .handler(async ({data: {slugs, lang}}) => {
    const page = source.getPage(slugs, lang);
    if (!page) throw notFound();

    const tree = source.getPageTree(lang) as Root;
    const sectionLinks = getSectionLinks(tree, page.locale);
    const normalizedTree = slugs[0] === "api" && lang ? extractApiTree(tree, lang) : tree;
    const apiPage = getApiPage(page.data);

    return {
      tree: await source.serializePageTree(normalizedTree),
      sectionLinks,
      path: page.path,
      page: {
        slugs: page.slugs,
        locale: page.locale,
        data: {
          title: page.data.title,
          description: page.data.description,
        },
      },
      apiPage,
    };
  });

interface StaticOpenApiSchema {
  id: string;
  bundled: unknown;
  dereferenced: unknown;
}

interface StaticOpenApiPage {
  props: ApiPageProps;
  schema: StaticOpenApiSchema;
  toc: unknown;
}

function getApiPage(data: unknown): StaticOpenApiPage | undefined {
  if (!isOpenApiData(data)) return;

  const schema = data.getSchema();
  return {
    props: data.getAPIPageProps(),
    schema: {
      id: schema.id,
      bundled: schema.bundled,
      dereferenced: schema.dereferenced,
    },
    toc: data.toc,
  };
}

function isOpenApiData(data: unknown): data is {
  getAPIPageProps: () => ApiPageProps;
  getSchema: () => {
    id: string;
    bundled: unknown;
    dereferenced: unknown;
  };
  toc: unknown;
} {
  return (
    typeof data === "object" &&
    data !== null &&
    "getAPIPageProps" in data &&
    typeof data.getAPIPageProps === "function" &&
    "getSchema" in data &&
    typeof data.getSchema === "function"
  );
}

function getSectionLinks(tree: Root, lang: string) {
  const fallback = {
    home: `/${lang}/home/getting-started/overview`,
    sdk: `/${lang}/sdk/getting-started/overview`,
    api: `/${lang}/api`,
  };

  return {
    home: findFirstPageUrlByPrefix(tree, `/${lang}/home`) ?? fallback.home,
    sdk: findFirstPageUrlByPrefix(tree, `/${lang}/sdk`) ?? fallback.sdk,
    api: findFirstPageUrlByPrefix(tree, `/${lang}/api`) ?? fallback.api,
  };
}

function findFirstPageUrlByPrefix(root: Root, prefix: string): string | undefined {
  for (const node of root.children) {
    const match = findFirstNodePageUrlByPrefix(node, prefix);
    if (match) return match;
  }
}

function findFirstNodePageUrlByPrefix(node: Node, prefix: string): string | undefined {
  if (node.type === "page") return node.url.startsWith(prefix) ? node.url : undefined;
  if (node.type !== "folder") return;

  for (const child of node.children) {
    const match = findFirstNodePageUrlByPrefix(child, prefix);
    if (match) return match;
  }
}

function extractApiTree(root: Root, lang: string): Root {
  const apiPrefix = `/${lang}/api`;
  const apiFolder = root.children.find((item): item is Folder => item.type === "folder" && hasPrefixInNode(item, apiPrefix));
  if (!apiFolder) return root;

  // On API pages, show categories directly (Feeds/Images/Videos) without the extra API wrapper.
  return {
    ...root,
    children: apiFolder.children,
  };
}

function hasPrefixInNode(node: Node, prefix: string): boolean {
  if (node.type === "page") return node.url.startsWith(prefix);
  if (node.type !== "folder") return false;

  if (node.index?.url.startsWith(prefix)) return true;
  return node.children.some((item) => hasPrefixInNode(item, prefix));
}
