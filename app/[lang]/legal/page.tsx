import {redirect} from "next/navigation"
import {source} from "@/lib/source";

export async function generateStaticParams() {
    const params = source.generateParams( 'lang');

    return params.map(param => ({
        lang: param.lang,
    }));
}

interface RedirectProps {
    params: Promise<{ lang: string }>;
}

export default async function Redirect(props: RedirectProps) {
    const params = await props.params;
  redirect(`/${params.lang}/legal/privacy-policy`);
}
