import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPageTemplate } from "@/components/layout/shared/DocsPageTemplate";

interface PageConfig {
    source: any;
    SidebarComponent: React.ComponentType;
    githubPrefix: string;
}

interface PageProps {
    params: Promise<{ slug?: string[] }>;
}

export function createDocsPages(config: PageConfig) {
    const { source, SidebarComponent, githubPrefix } = config;

    async function Page(props: PageProps) {
        const params = await props.params;
        const page = source.getPage(params.slug);

        if (!page) notFound();

        return (
            <DocsPageTemplate
                page={page}
                source={source}
                SidebarComponent={SidebarComponent}
                githubPath={`${githubPrefix}/${page.path}`}
            />
        );
    }

    async function generateStaticParams() {
        return source.generateParams();
    }

    async function generateMetadata(props: PageProps): Promise<Metadata> {
        const params = await props.params;
        const page = source.getPage(params.slug);

        if (!page) notFound();

        return {
            title: page.data.title,
            description: page.data.description,
        };
    }

    return { Page, generateStaticParams, generateMetadata };
}