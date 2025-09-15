import {createRelativeLink} from "fumadocs-ui/mdx";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {PageTOCItems, PageTOCPopoverItems, PageTOCTitle} from "@/components/layout/docs/page";
import {Sidebar} from "@/components/layout/docs/sidebar/sidebar";
import {DocsBody, DocsDescription, DocsPage, DocsTitle} from "@/components/layout/page";
import {TOCProvider} from "@/components/ui/toc";
import {source} from "@/lib/source";
import {getMDXComponents} from "@/mdx-components";
import {
  PageTOC,
  PageTOCPopover,
  PageTOCPopoverContent,
  PageTOCPopoverTrigger
} from "@/components/layout/docs/page/page-toc";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  const MDXContent = page.data.body;

  return (
    // TODO scroll from bottom to top should catch the page
    <div id="nd-page" className="flex flex-1 flex-col relative">
      <div className="flex flex-1 relative">
        <aside className="w-sidebar p-sidebar sticky top-sidebar-top h-screen hidden md:block">
          {/* TODO restore padding for sidebar links*/}
          <Sidebar/>
        </aside>

        <TOCProvider toc={page.data.toc}>
          <main className="flex-1 w-full overflow-y-auto min-h-screen relative">
            {/* TODO correct TOC popover position*/}
            <PageTOCPopover>
              <PageTOCPopoverTrigger/>
              <PageTOCPopoverContent>
                <PageTOCPopoverItems variant="normal"/>
              </PageTOCPopoverContent>
            </PageTOCPopover>
            <DocsPage
              container={{className: "pt-[calc(var(--padding-sidebar)*2.5)]"}}
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
              <DocsTitle>{page.data.title}</DocsTitle>
            <header className="relative space-y-2">
              <div className="space-y-2.5">
                <PageBreadcrumb/>
                <DocsTitle>{page.data.title}</DocsTitle>
              </div>
              <DocsDescription>{page.data.description}</DocsDescription>
              <DocsBody>
                <MDXContent
                  components={getMDXComponents({
                    // this allows you to link to other pages with relative file paths
                    a: createRelativeLink(source, page),
                  })}
                />
              </DocsBody>
            </DocsPage>
          </main>
          <aside className="w-sidebar p-sidebar sticky top-sidebar-top h-screen hidden xl:block">
            <PageTOC>
              <PageTOCTitle/>
              <PageTOCItems variant="normal"/>
            </PageTOC>
          </aside>
        </TOCProvider>
      </div>
            </header>
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
