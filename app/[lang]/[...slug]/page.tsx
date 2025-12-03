import {createRelativeLink} from "fumadocs-ui/mdx";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {PageTOCItems, PageTOCTitle} from "@/components/layout/docs/page";
import {PageBreadcrumb} from "@/components/layout/docs/page/page-breadcrumb";
import {PageTOC} from "@/components/layout/docs/page/page-toc";
import {SidebarWrapper} from "@/components/layout/docs/sidebar/sidebar-wrapper";
import {Footer} from "@/components/layout/footer/footer";
import {DocsBody, DocsDescription, DocsPage, DocsTitle} from "@/components/layout/page";
import {TOCProvider} from "@/components/ui/toc";
import {getPageImage, source} from "@/lib/source";
import {getMDXComponents} from "@/mdx-components";
import {LLMCopyButton} from "@/components/page-actions";
import {getBaseUrl} from "@/lib/base-url";

interface PageProps {
  params: {
    lang: string;
    slug: string[];
  };
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  const lang = params.lang;

  if (!page) notFound();
  const MDXContent = page.data.body;

  const insertLlmsSegment = (pageUrl: string) => pageUrl.replace(/^\/(\w{2})\//, "/$1/llms/");

  // TODO rework page layouts
  const isFullWidth = page.data.full === true;

  if (isFullWidth) {
    // Full-width layout for API pages - no flex-row, no TOC sidebar
    return (
      <TOCProvider toc={page.data.toc}>
        <main className="w-full min-h-screen relative">
          <DocsPage
            container={{className: "pt-[calc(var(--padding-sidebar)*2)]"}}
            full={true}
            article={{className: "max-w-none"}}
            footer={{
              enabled: true,
              github: {
                owner: "qeeqez",
                repo: "docs",
                path: `content/docs/${lang}/${page.path}`,
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
                  <DocsTitle>{page.data.title}</DocsTitle>

                  <LLMCopyButton
                    markdownUrl={`${insertLlmsSegment(page.url)}.mdx`}
                    githubUrl={`https://github.com/qeeqez/docs/tree/main/content/docs/${page.path}`}
                  />
                </div>
              </div>
              <DocsDescription>{page.data.description}</DocsDescription>
            </header>
            <DocsBody>
              <MDXContent
                components={getMDXComponents({
                  // this allows you to link to other pages with relative file paths
                  a: createRelativeLink(source, page),
                })}
              />
            </DocsBody>
          </DocsPage>
          <Footer lang={lang} />
        </main>
      </TOCProvider>
    );
  }

  // Standard layout with TOC sidebar
  return (
    <TOCProvider toc={page.data.toc}>
      <div className="flex flex-row lg:gap-8">
        <main className="grow overflow-y-auto min-h-screen relative">
          <DocsPage
            container={{className: "pt-[calc(var(--padding-sidebar)*2)]"}}
            full={false}
            footer={{
              enabled: true,
              github: {
                owner: "qeeqez",
                repo: "docs",
                path: `content/docs/${lang}/${page.path}`,
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
                  <DocsTitle>{page.data.title}</DocsTitle>

                  <LLMCopyButton
                    markdownUrl={`${insertLlmsSegment(page.url)}.mdx`}
                    githubUrl={`https://github.com/qeeqez/docs/tree/main/content/docs/${page.path}`}
                  />
                </div>
              </div>
              <DocsDescription>{page.data.description}</DocsDescription>
            </header>
            <DocsBody>
              <MDXContent
                components={getMDXComponents({
                  // this allows you to link to other pages with relative file paths
                  a: createRelativeLink(source, page),
                })}
              />
            </DocsBody>
          </DocsPage>
          <Footer lang={lang} />
        </main>
        <SidebarWrapper className="hidden xl:block">
          <PageTOC>
            <PageTOCTitle />
            <PageTOCItems variant="normal" />
          </PageTOC>
        </SidebarWrapper>
      </div>
    </TOCProvider>
  );
}

export async function generateStaticParams() {
  const params = source.generateParams("slug", "lang");

  return params.map((param) => ({
    lang: param.lang,
    slug: Array.isArray(param.slug) ? param.slug : [param.slug],
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const appName = "Rixl";

  const imageUrl = getPageImage(page).url;

  return {
    metadataBase: getBaseUrl(),
    title: `${page.data.title} - ${appName}`,
    description: page.data.description,
    applicationName: appName,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      images: imageUrl,
      siteName: appName,
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
      images: imageUrl,
    },
  };
}
