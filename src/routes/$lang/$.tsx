import {createFileRoute} from "@tanstack/react-router";
import {getPageImage} from "@/lib/images";
import {DocsBody, DocsDescription, DocsPage, DocsTitle} from "fumadocs-ui/page";
import browserCollections from "fumadocs-mdx:collections/browser";
import SharedLayout from "@/components/layout/shared/shared-layout";
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
      void preloadAPIRuntime();
    }
    const data = await loader({data: {slugs, lang: params.lang}});
    void clientLoader.preload(data.path);
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
    const pageSlug = _splat ?? "";
    const isApiPage = pageSlug === "api" || pageSlug.startsWith("api/");
    const category = getCategoryFromSlug(pageSlug);
    const markdownPath = pageSlug ? `/${lang}/${pageSlug}.md` : `/${lang}.md`;
    const githubPath = pageSlug ? `content/${lang}/${pageSlug}` : `content/${lang}`;

    return (
      <>
        <DocsPage
          className="pt-4 md:pt-4 xl:pt-4"
          full={false}
          toc={toc}
          footer={{
            children: <Footer lang={lang} />,
          }}
        >
          <header className="relative space-y-2">
            <div className="space-y-2.5">
              {!isApiPage ? <p className="text-sm font-medium text-fd-primary">{category}</p> : null}

              <div className="flex items-center justify-between gap-2">
                <DocsTitle>{frontmatter.title}</DocsTitle>
                <LLMCopyButton markdownUrl={markdownPath} githubUrl={`https://github.com/qeeqez/docs/tree/main/${githubPath}`} />
              </div>
            </div>
            <DocsDescription>{frontmatter.description}</DocsDescription>
          </header>
          <DocsBody>
            <Suspense fallback={<DocsBodyFallback isApiPage={isApiPage} />}>
              <MDX
                components={getMDXComponents({
                  // a: createRelativeLink(source, page), TODO keke
                })}
              />
            </Suspense>
          </DocsBody>
        </DocsPage>
      </>
    );
  },
});

function Page() {
  const {lang, _splat} = Route.useParams();
  const data = Route.useLoaderData();
  const Content = clientLoader.getComponent(data.path);
  const section = _splat?.split("/")[0] ?? "root";

  return (
    <SharedLayout lang={lang} dataTree={data.tree} sectionLinks={data.sectionLinks} treeKey={`${lang}:${section}`}>
      <Content />
    </SharedLayout>
  );
}

function getCategoryFromSlug(pageSlug: string): string {
  const segments = pageSlug.split("/").filter(Boolean);
  const category = segments[1] ?? segments[0] ?? "Documentation";

  return category
    .split("-")
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}

function DocsBodyFallback({isApiPage}: {isApiPage: boolean}) {
  if (isApiPage) {
    return (
      <div className="space-y-4 py-2">
        <div className="h-8 w-2/3 animate-pulse rounded-md bg-fd-muted" />
        <div className="h-8 w-full animate-pulse rounded-md bg-fd-muted" />
        <div className="h-64 w-full animate-pulse rounded-xl bg-fd-muted/80" />
      </div>
    );
  }

  return <div className="h-24 animate-pulse rounded-lg bg-fd-muted/60" />;
}
