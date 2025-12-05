import {createFileRoute, notFound} from "@tanstack/react-router";
import {PageBreadcrumb} from "@/components/layout/docs/page/page-breadcrumb";
import {Footer} from "@/components/layout/footer/footer";
import {DocsBody, DocsDescription, DocsPage, DocsTitle} from "@/components/layout/page";
import {source} from "@/lib/source.ts";
import {getMDXComponents} from "@/components/mdx-components";
import {LLMCopyButton} from "@/components/page-actions";
import browserCollections from "fumadocs-mdx:collections/browser.ts";
import {createServerFn} from "@tanstack/start-client-core";
import {TOCProvider} from "@/components/ui/toc.tsx";
import SharedLayout from "@/components/layout/shared/shared-layout.tsx";

//
// beforeLoad: ({ params }) => {
//   // Validate lang param
//   const validLangs = ["en"]; // Add more as needed
//   if (!validLangs.includes(params.lang)) {
//     throw Navigate({ to: "/en" });
//   }
// },

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

// function PageComponent() {
//   const {page, slugArray} = Route.useLoaderData();
//   const {lang} = Route.useParams();
//
//   const MDXContent = page.data.body;
//   const components = getMDXComponents();
//
//   const insertLlmsSegment = (pageUrl: string) => pageUrl.replace(/^\/(\w{2})\//, "/$1/llms/");
//
//   const isFullWidth = page.data.full === true;
//
//   if (isFullWidth) {
//     return (
//       <SharedLayout lang={lang} components>
//         <TOCProvider toc={page.data.toc}>
//           <main className="w-full min-h-screen relative">
//             <DocsPage
//               container={{className: "pt-[calc(var(--padding-sidebar)*2)]"}}
//               full={true}
//               article={{className: "max-w-none"}}
//               footer={{
//                 enabled: true,
//                 github: {
//                   owner: "qeeqez",
//                   repo: "docs",
//                   path: `content/docs/${lang}/${page.path}`,
//                   sha: "main",
//                   raiseIssue: true,
//                 },
//                 lastUpdate: undefined,
//               }}
//             >
//               <header className="relative space-y-2">
//                 <div className="space-y-2.5">
//                   <PageBreadcrumb/>
//
//                   <div className="flex items-center justify-between gap-2">
//                     <DocsTitle>{page.data.title}</DocsTitle>
//
//                     <LLMCopyButton
//                       markdownUrl={`${insertLlmsSegment(page.url)}.mdx`}
//                       githubUrl={`https://github.com/qeeqez/docs/tree/main/content/docs/${page.path}`}
//                     />
//                   </div>
//                 </div>
//                 <DocsDescription>{page.data.description}</DocsDescription>
//               </header>
//               <DocsBody>
//                 <MDXContent
//                   components={getMDXComponents({
//                     a: createRelativeLink(source, page),
//                   })}
//                 />
//               </DocsBody>
//             </DocsPage>
//             <Footer lang={lang}/>
//           </main>
//         </TOCProvider>
//       </SharedLayout>
//     );
//   }
//
//   return (
//     <SharedLayout lang={lang} components>
//
//       <TOCProvider toc={page.data.toc}>
//         <div className="flex flex-row lg:gap-8">
//
//           <SidebarWrapper className="hidden xl:block">
//             <PageTOC>
//               <PageTOCTitle/>
//               <PageTOCItems variant="normal"/>
//             </PageTOC>
//           </SidebarWrapper>
//         </div>
//       </TOCProvider>
//     </SharedLayout>
//   );
// }

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
    const insertLLMSegments = (pageUrl: string) => pageUrl.replace(/^\/(\w{2})\//, "/$1/llms/");

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
                    markdownUrl={`${insertLLMSegments(slug)}.mdx`} // TODO check what to insert here
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

// TODO REMOVE

// import {createFileRoute, notFound} from '@tanstack/react-router';
// import {DocsLayout} from 'fumadocs-ui/layouts/docs';
// import {createServerFn} from '@tanstack/react-start';
// import {source} from '@/lib/source';
// import type * as PageTree from 'fumadocs-core/page-tree';
// import {useMemo} from 'react';
// import browserCollections from 'fumadocs-mdx:collections/browser';
// import {DocsBody, DocsDescription, DocsPage, DocsTitle,} from 'fumadocs-ui/layouts/docs/page';
// import defaultMdxComponents from 'fumadocs-ui/mdx';
// import {baseOptions} from '@/lib/layout.shared';
//
// export const Route = createFileRoute('/$lang/$')({
//   component: Page,
//   // loader: async ({ params }) => {
//   //   const slugs = params._splat?.split('/') ?? [];
//   //   const data = await loader({ data: slugs });
//   //   await clientLoader.preload(data.path);
//   //   return data;
//   // },
//
//   loader: async ({params}) => {
//     const data = await loader({
//       data: {
//         slugs: params._splat?.split('/') ?? [],
//         lang: params.lang,
//       },
//     });
//     await clientLoader.preload(data.path);
//     return data;
//   },
// });
//
// const loader = createServerFn({
//   method: 'GET',
// })
//   .inputValidator((params: { slugs: string[]; lang?: string }) => params)
//   .handler(async ({data: {slugs, lang}}) => {
//     const page = source.getPage(slugs, lang);
//     if (!page) throw notFound();
//     return {
//       tree: source.getPageTree(lang) as object,
//       path: page.path,
//     };
//   });
//
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
//
// function Page() {
//   const {lang} = Route.useParams();
//   const data = Route.useLoaderData();
//   const Content = clientLoader.getComponent(data.path);
//   const tree = useMemo(
//     () => transformPageTree(data.tree as PageTree.Folder),
//     [data.tree],
//   );
//
//   return (
//     <DocsLayout {...baseOptions(lang)} tree={tree}>
//       <Content/>
//     </DocsLayout>
//   );
// }
//
// function transformPageTree(root: PageTree.Root): PageTree.Root {
//   function mapNode<T extends PageTree.Node>(item: T): T {
//     if (typeof item.icon === 'string') {
//       item = {
//         ...item,
//         icon: (
//           <span
//             dangerouslySetInnerHTML={{
//               __html: item.icon,
//             }}
//           />
//         ),
//       };
//     }
//
//     if (item.type === 'folder') {
//       return {
//         ...item,
//         index: item.index ? mapNode(item.index) : undefined,
//         children: item.children.map(mapNode),
//       };
//     }
//
//     return item;
//   }
//
//   return {
//     ...root,
//     children: root.children.map(mapNode),
//     fallback: root.fallback ? transformPageTree(root.fallback) : undefined,
//   };
// }
