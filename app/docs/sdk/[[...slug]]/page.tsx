import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {Sidebar} from "@/components/layout/docs/sidebar/sidebar";
import {sdkSource} from "@/lib/source";
import {DocsPageTemplate} from "@/components/shared/DocsPageTemplate";

export default async function Page(props: PageProps<'/docs/sdk/[[...slug]]'>) {
    const params = await props.params;
    const page = sdkSource.getPage(params.slug);

    if (!page) notFound();

    return (
        <DocsPageTemplate
            page={page}
            source={sdkSource}
            SidebarComponent={Sidebar}
            githubPath={`content/sdk/${page.path}`}
        />
    );
}

export async function generateStaticParams() {
    return sdkSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/sdk/[[...slug]]'>): Promise<Metadata> {
    const params = await props.params;
    const page = sdkSource.getPage(params.slug);
    if (!page) notFound();

    return {
        title: page.data.title,
        description: page.data.description,
    };
}