import {createRelativeLink} from 'fumadocs-ui/mdx';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {DocsBody, DocsDescription, DocsPage, DocsTitle} from "@/components/layout/page";
import {sdkSource} from '@/lib/source';
import {getMDXComponents} from '@/mdx-components';
import {Sidebar} from "@/components/layout/sdk/sidebar/sidebar";
import {
    PageTOC,
    PageTOCPopover,
    PageTOCPopoverContent,
    PageTOCPopoverTrigger
} from "@/components/layout/sdk/page/page-toc";
import {PageTOCItems, PageTOCPopoverItems, PageTOCTitle} from "@/components/layout/sdk/page";
import {TOCProvider} from "@/components/ui/toc";

export default async function Page(props: PageProps<'/docs/sdk/[[...slug]]'>) {
    const params = await props.params;
    const page = sdkSource.getPage(params.slug);
    if (!page) notFound();
    const MDXContent = page.data.body;

    return (
        <main id="nd-page" className="flex flex-1 flex-col relative">
            <div className="flex flex-1">
                <aside className="w-64 px-sidebar sticky top-0 h-screen hidden md:block">
                    <Sidebar/>
                </aside>

                <TOCProvider toc={page.data.toc}>
                    <main className="flex-1 p-6 overflow-y-auto max-h-screen relative">
                        <PageTOCPopover>
                            <PageTOCPopoverTrigger/>
                            <PageTOCPopoverContent>
                                <PageTOCPopoverItems variant="normal"/>
                            </PageTOCPopoverContent>
                        </PageTOCPopover>
                        <div>
                            <DocsPage full={page.data.full}>
                                <DocsTitle>{page.data.title}</DocsTitle>
                                <DocsDescription>{page.data.description}</DocsDescription>
                                <DocsBody>
                                    <MDXContent
                                        components={getMDXComponents({
                                            a: createRelativeLink(sdkSource, page)
                                        })}
                                    />
                                </DocsBody>
                            </DocsPage>
                        </div>
                    </main>
                    <aside className="w-64 p-sidebar hidden xl:block">
                        <PageTOC className="">
                            <PageTOCTitle/>
                            <PageTOCItems variant="normal"/>
                        </PageTOC>
                    </aside>
                </TOCProvider>
            </div>
        </main>
    );
}

export async function generateStaticParams() {
    return sdkSource.generateParams();
}

export async function generateMetadata(
    props: PageProps<'/docs/sdk/[[...slug]]'>,
): Promise<Metadata> {
    const params = await props.params;
    const page = sdkSource.getPage(params.slug);
    if (!page) notFound();

    return {
        title: page.data.title,
        description: page.data.description,
    };
}