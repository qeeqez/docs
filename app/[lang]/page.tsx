import {redirect} from "next/navigation";
import {source} from "@/lib/source";

interface RedirectProps {
    params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
    const params = source.generateParams('slug', 'lang');

    return params.map(param => ({
        lang: param.lang,
        slug: Array.isArray(param.slug) ? param.slug : [param.slug]
    }));
}

export default async function Redirect(props: RedirectProps) {
    const params = await props.params;
    redirect(`/${params.lang}/getting-started/overview`);
}
