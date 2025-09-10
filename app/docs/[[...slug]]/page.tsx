import {createRelativeLink} from "fumadocs-ui/mdx";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {PageTOCItems, PageTOCPopoverItems, PageTOCTitle} from "@/components/layout/docs/page";
import {PageTOC, PageTOCPopover, PageTOCPopoverContent, PageTOCPopoverTrigger} from "@/components/layout/docs/page-client";
import {Sidebar} from "@/components/layout/docs/sidebar/sidebar";
import {DocsBody, DocsDescription, DocsPage, DocsTitle} from "@/components/layout/page";
import {TOCProvider} from "@/components/ui/toc";
import {source} from "@/lib/source";
import {getMDXComponents} from "@/mdx-components";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  const MDXContent = page.data.body;

  return (
    // TODO scroll from bottom to top should catch the page
    <main id="nd-page" className="flex flex-1 flex-col relative">
      <div className="flex flex-1">
        <aside className="w-64 px-sidebar sticky top-0 h-screen hidden md:block">
          {/* TODO restore padding for sidebar links*/}
          <Sidebar />
        </aside>

        <TOCProvider toc={page.data.toc}>
          <main className="flex-1 p-6 overflow-y-auto max-h-screen relative">
            {/* TODO correct TOC popover position*/}
            <PageTOCPopover>
              <PageTOCPopoverTrigger />
              <PageTOCPopoverContent>
                <PageTOCPopoverItems variant="normal" />
              </PageTOCPopoverContent>
            </PageTOCPopover>
            <div>
              {/* TODO hide scrollbar when TOC is open*/}
              <DocsPage full={page.data.full} lastUpdate={page.data.lastModified}>
                <DocsTitle>{page.data.title}</DocsTitle>
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
            </div>
          </main>
          <aside className="w-64 p-sidebar hidden xl:block">
            <PageTOC className="">
              <PageTOCTitle />
              <PageTOCItems variant="normal" />
            </PageTOC>
          </aside>
        </TOCProvider>
      </div>
    </main>
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
