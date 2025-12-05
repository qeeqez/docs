import {createFileRoute, notFound} from "@tanstack/react-router";
import {createServerFn} from "@tanstack/react-start";
import {source} from "@/lib/source.ts";
import {DocsBody, DocsDescription, DocsPage, DocsTitle} from "@/components/layout/page";
import browserCollections from "fumadocs-mdx:collections/browser";
import SharedLayout from "@/components/layout/shared/shared-layout.tsx";
import {TOCProvider} from "@/components/ui/toc.tsx";
import {PageBreadcrumb} from "@/components/layout/docs/page/page-breadcrumb.tsx";
import {LLMCopyButton} from "@/components/page-actions.tsx";
import {getMDXComponents} from "@/components/mdx-components.tsx";
import {Footer} from "@/components/layout/footer/footer.tsx";

export const Route = createFileRoute("/$lang/$")({
  component: Page,
  loader: async ({params}) => {
    const slugs = params._splat?.split("/") ?? [];
    const data = await loader({data: {slugs: slugs, lang: params.lang}});
    await clientLoader.preload(data.path);
    return data;
  },
  // head: ({loaderData: _loaderData}) => {
  //   // TODO head
  //   // const {page} = _loaderData;
  //   // const appName = "Rixl";
  //   // const imageUrl = getPageImage(page).url;
  //   //
  //   // return {
  //   //   meta: [
  //   //     {title: `${page.data.title} - ${appName}`},
  //   //     {name: "description", content: page.data.description},
  //   //     {name: "application-name", content: appName},
  //   //     {property: "og:title", content: page.data.title},
  //   //     {property: "og:description", content: page.data.description},
  //   //     {property: "og:image", content: imageUrl},
  //   //     {property: "og:site_name", content: appName},
  //   //     {name: "twitter:card", content: "summary_large_image"},
  //   //     {name: "twitter:title", content: page.data.title},
  //   //     {name: "twitter:description", content: page.data.description},
  //   //     {name: "twitter:image", content: imageUrl},
  //   //   ],
  //   // };
  // },
});

const loader = createServerFn({
  method: "GET",
})
  .inputValidator((params: {slugs: string[]; lang?: string}) => params)
  // .middleware([staticFunctionMiddleware]) TODO check what is this
  .handler(async ({data: {slugs, lang}}) => {
    const page = source.getPage(slugs, lang);
    if (!page) throw notFound();
    return {
      tree: source.getPageTree(lang) as object,
      path: page.path,
    };
  });

const clientLoader = browserCollections.docs.createClientLoader({
  component({toc, frontmatter, default: MDX}) {
    const {lang, _splat} = Route.useParams();
    const slug = _splat;

    return (
      <TOCProvider toc={toc}>
        <main className="grow overflow-y-auto min-h-screen relative">
          <DocsPage
            container={{className: "pt-[calc(var(--padding-sidebar)*2)]"}}
            full={false}
            footer={{
              enabled: true,
              github: {
                owner: "qeeqez",
                repo: "docs",
                path: `content/docs/${lang}/${slug}`,
                sha: "main",
                raiseIssue: true,
              },
              lastUpdate: undefined,
            }}
          >
            <header className="relative space-y-2">
              <div className="space-y-2.5">
                <PageBreadcrumb />

                <div className="flex items-center justify-between gap-2">
                  <DocsTitle>{frontmatter.title}</DocsTitle>
                  <LLMCopyButton
                    markdownUrl={`${_splat}.mdx`}
                    githubUrl={`https://github.com/qeeqez/docs/tree/main/content/docs/${slug}`}
                  />
                </div>
              </div>
              <DocsDescription>{frontmatter.description}</DocsDescription>
            </header>
            <DocsBody>
              <MDX
                components={getMDXComponents({
                  // a: createRelativeLink(source, page), TODO keke
                })}
              />
            </DocsBody>
          </DocsPage>
          <Footer lang={lang} />
        </main>
      </TOCProvider>
    );
  },
});

// const clientLoader = browserCollections.docs.createClientLoader({
//   component({toc, frontmatter, default: MDX}) {
//     return (
//       <DocsPage toc={toc}>
//         <DocsTitle>{frontmatter.title}</DocsTitle>
//         <DocsDescription>{frontmatter.description}</DocsDescription>
//         <DocsBody>
//           <MDX
//             components={{
//               ...defaultMdxComponents,
//             }}
//           />
//         </DocsBody>
//       </DocsPage>
//     );
//   },
// });

function Page() {
  const {lang} = Route.useParams();
  const data = Route.useLoaderData();
  const Content = clientLoader.getComponent(data.path);

  return (
    <SharedLayout lang={lang} dataTree={data.tree}>
      <Content />
    </SharedLayout>
  );
}
