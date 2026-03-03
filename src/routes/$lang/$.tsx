import {createFileRoute} from "@tanstack/react-router";
import {getPageImage} from "@/lib/images";
import {DocsBody, DocsDescription, DocsPage, DocsTitle} from "@/components/layout/page";
import browserCollections from "fumadocs-mdx:collections/browser";
import SharedLayout from "@/components/layout/shared/shared-layout";
import {TOCProvider} from "@/components/ui/toc";
import {PageBreadcrumb} from "@/components/layout/docs/page/page-breadcrumb";
import {getMDXComponents} from "@/components/mdx-components";
import {Footer} from "@/components/layout/footer/footer";
import {LLMCopyButton} from "@/components/page-actions/llm-copy-button";
import {preloadAPIRuntime} from "@/lib/api-preload";
import {loader} from "@/lib/server/docs-loader";
import {Suspense} from "react";

export const Route = createFileRoute("/$lang/$")({
  component: Page,
  loader: async ({params}) => {
    const splat = params._splat ?? "";
    const slugs = splat ? splat.split("/") : [];
    if (slugs[0] === "api") {
      await preloadAPIRuntime();
    }
    const data = await loader({data: {slugs, lang: params.lang}});
    await clientLoader.preload(data.path);
    return data;
  },
  head: ({loaderData: _loaderData}) => {
    if (!_loaderData) return {};
    const {page} = _loaderData;
    const appName = "Rixl";
    const imageUrl = getPageImage(page.slugs, page.locale).url;

    return {
      meta: [
        {title: `${page.data.title} - ${appName}`},
        {name: "description", content: page.data.description},
        {name: "application-name", content: appName},
        {property: "og:title", content: page.data.title},
        {property: "og:description", content: page.data.description},
        {property: "og:image", content: imageUrl},
        {property: "og:site_name", content: appName},
        {name: "twitter:card", content: "summary_large_image"},
        {name: "twitter:title", content: page.data.title},
        {name: "twitter:description", content: page.data.description},
        {name: "twitter:image", content: imageUrl},
      ],
    };
  },
});

const clientLoader = browserCollections.docs.createClientLoader({
  component: function DocsContent({toc, frontmatter, default: MDX}) {
    const {lang, _splat} = Route.useParams();

    return (
      <TOCProvider toc={toc}>
        <main className="grow overflow-y-auto min-h-screen relative">
          <DocsPage
            container={{className: "pt-[calc(var(--padding-sidebar)*2)]"}}
            full={false}
            toc={toc}
            footer={{
              enabled: true,
              github: {
                owner: "qeeqez",
                repo: "docs",
                path: `content/${lang}/${_splat}`,
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
                    markdownUrl={`/${lang}/${_splat}.md`}
                    githubUrl={`https://github.com/qeeqez/docs/tree/main/content/${lang}/${_splat}`}
                  />
                </div>
              </div>
              <DocsDescription>{frontmatter.description}</DocsDescription>
            </header>
            <DocsBody>
              <Suspense fallback={null}>
                <MDX
                  components={getMDXComponents({
                    // a: createRelativeLink(source, page), TODO keke
                  })}
                />
              </Suspense>
            </DocsBody>
          </DocsPage>
          <Footer lang={lang} />
        </main>
      </TOCProvider>
    );
  },
});

function Page() {
  const {lang, _splat} = Route.useParams();
  const data = Route.useLoaderData();
  const Content = clientLoader.getComponent(data.path);
  const section = _splat?.split("/")[0] ?? "root";

  return (
    <SharedLayout lang={lang} dataTree={data.tree} treeKey={`${lang}:${section}`}>
      <Content />
    </SharedLayout>
  );
}
