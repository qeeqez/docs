import {createRelativeLink} from "fumadocs-ui/mdx";
import {PageTOCItems, PageTOCPopoverItems, PageTOCTitle} from "@/components/layout/docs/page";
import {DocsBody, DocsDescription, DocsPage, DocsTitle} from "@/components/layout/page";
import {TOCProvider} from "@/components/ui/toc";
import {getMDXComponents} from "@/mdx-components";
import {
    PageTOC,
    PageTOCPopover,
    PageTOCPopoverContent,
    PageTOCPopoverTrigger
} from "@/components/layout/docs/page/page-toc";
import {SidebarWrapper} from "@/components/layout/docs/sidebar/sidebar-wrapper";
import {PageBreadcrumb} from "@/components/layout/docs/page/page-breadcrumb";
import type {ComponentType} from "react";

interface DocsPageTemplateProps {
    page: any;
    source: any;
    SidebarComponent: ComponentType;
    githubPath: string;
}

export function DocsPageTemplate({
                                     page,
                                     source,
                                     SidebarComponent,
                                     githubPath
                                 }: DocsPageTemplateProps) {
    const MDXContent = page.data.body;

    return (
        <div id="nd-page" className="flex flex-row gap-8 lg:gap-12 motion-safe:transition-all motion-safe:duration-300">
            <SidebarWrapper className="hidden md:block">
                {/* TODO restore padding for sidebar links*/}
                <SidebarComponent/>
            </SidebarWrapper>

            <TOCProvider toc={page.data.toc}>
                <main className="grow overflow-y-auto min-h-screen relative">
                    {/* TODO correct TOC popover position*/}
                    <PageTOCPopover>
                        <PageTOCPopoverTrigger/>
                        <PageTOCPopoverContent>
                            <PageTOCPopoverItems variant="normal"/>
                        </PageTOCPopoverContent>
                    </PageTOCPopover>
                    <DocsPage
                        container={{className: "pt-[calc(var(--padding-sidebar)*2)]"}}
                        full={page.data.full}
                        footer={{
                            enabled: true,
                            github: {
                                owner: "qeeqez",
                                repo: "docs",
                                path: githubPath,
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
                                    a: createRelativeLink(source, page),
                                })}
                            />
                        </DocsBody>
                    </DocsPage>
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