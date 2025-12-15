import {notFound} from "@tanstack/react-router";
import {createServerFn} from "@tanstack/react-start";
import {staticFunctionMiddleware} from "@tanstack/start-static-server-functions";
import {source} from "@/lib/source";

export const loader = createServerFn({
  method: "GET",
})
  .inputValidator((params: {slugs: string[]; lang?: string}) => params)
  .middleware([staticFunctionMiddleware]) // used for tanstack static rendering
  .handler(async ({data: {slugs, lang}}) => {
    const page = source.getPage(slugs, lang);
    if (!page) throw notFound();
    return {
      tree: source.getPageTree(lang) as object,
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
