import {source} from '@/lib/source';
import {notFound} from 'next/navigation';
import {ImageResponse} from 'next/og';
import {generate as generateOG} from 'fumadocs-ui/og';
import LogoWide from '@/assets/logo_wide.svg';

export const revalidate = false;

interface RouteContext {
    params: Promise<{
        lang: string;
        slug: string[];
    }>;
}


export async function GET(
    _req: Request, context: RouteContext
) {
    const {lang, slug} = await context.params;

    const pageSlug = slug.slice(0, -1);

    const page = source.getPage(pageSlug, lang);

    if (!page) notFound();

    return new ImageResponse(
        generateOG({
            title: <div style={{ fontSize: 64, lineHeight: 1.08, marginTop: '90px', }}>{page.data.title}</div>,
            description: page.data.description,
            icon: <LogoWide style={{ height: 72, width: 360 }} />,
            primaryColor: '#ffa41cbf',
        }),
        {width: 1200, height: 630},
    );
}

export function generateStaticParams() {
    return source.getPages().map((page) => {
        const segments = [...page.slugs, 'image.png'];

        return {
            lang: page.locale,
            slug: segments,
        };
    });
}