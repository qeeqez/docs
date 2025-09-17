import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {Sidebar} from "@/components/layout/docs/sidebar/sidebar";
import {source} from "@/lib/source";
import {DocsPageTemplate} from "@/components/layout/shared/DocsPageTemplate";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
    const params = await props.params;
    const page = source.getPage(params.slug);

    if (!page) notFound();

    return (
        <DocsPageTemplate
            page={page}
            source={source}
            SidebarComponent={Sidebar}
            githubPath={`content/docs/${page.path}`}
        />
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