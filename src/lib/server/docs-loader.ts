import {notFound} from "@tanstack/react-router";
import {createServerFn} from "@tanstack/react-start";
import {staticFunctionMiddleware} from "@tanstack/start-static-server-functions";
import type {Folder, Node, Root} from "fumadocs-core/page-tree";
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
    const normalizedTree = slugs[0] === "api" && lang ? extractApiTree(tree, lang) : tree;

    return {
      tree: normalizedTree as object,
      path: page.path,
      page: {
        slugs: page.slugs,
        locale: page.locale,
        data: {
          title: page.data.title,
          description: page.data.description,
        },
      },
    };
  });

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
