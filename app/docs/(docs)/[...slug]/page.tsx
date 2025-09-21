import {createRelativeLink} from "fumadocs-ui/mdx";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {PageTOCItems, PageTOCTitle} from "@/components/layout/docs/page";
import {PageBreadcrumb} from "@/components/layout/docs/page/page-breadcrumb";
import {PageTOC} from "@/components/layout/docs/page/page-toc";
import {Sidebar} from "@/components/layout/docs/sidebar/sidebar";
import {SidebarWrapper} from "@/components/layout/docs/sidebar/sidebar-wrapper";
import {DocsBody, DocsDescription, DocsPage, DocsTitle} from "@/components/layout/page";
import {TOCProvider} from "@/components/ui/toc";
import {source} from "@/lib/source";
import {getMDXComponents} from "@/mdx-components";
import {Footer} from "@/components/layout/footer/footer";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();
  const MDXContent = page.data.body;

  return (
    <div id="nd-page" className="flex flex-row lg:gap-12 motion-safe:transition-all motion-safe:duration-300">
      <SidebarWrapper className="hidden lg:block">
        <Sidebar/>
      </SidebarWrapper>

      <TOCProvider toc={page.data.toc}>
        <main className="grow overflow-y-auto min-h-screen relative">
          <DocsPage
            container={{className: "pt-[calc(var(--padding-sidebar)*2)]"}}
            full={page.data.full}
            footer={{
              enabled: true,
              github: {
                owner: "qeeqez",
                repo: "docs",
                path: `content/docs/${page.path}`,
                sha: "main",
                raiseIssue: true,
              },
              lastUpdate: page.data.lastModified,
            }}
          >
            <header className="relative space-y-2">
              <div className="space-y-2.5">
                <PageBreadcrumb/>
                <DocsTitle>{page.data.title}</DocsTitle>
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
          <Footer/>
        </main>
        <SidebarWrapper className="hidden xl:block">
          <PageTOC>
            <PageTOCTitle/>
            <PageTOCItems variant="normal"/>
          </PageTOC>
        </SidebarWrapper>
      </TOCProvider>
    </div>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
