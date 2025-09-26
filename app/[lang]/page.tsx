import {redirect} from "next/navigation";

interface RedirectProps {
    params: Promise<{ lang: string }>;
}

export default async function Redirect(props: RedirectProps) {
    const params = await props.params;
    redirect(`/${params.lang}/getting-started/overview`);
}
