import { getPageImage, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';

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
    const { lang, slug } = await context.params;

    const pageSlug = slug.slice(0, -1);

    const page = source.getPage(pageSlug, lang);

    if (!page) notFound();

    return new ImageResponse(
        (
            <DefaultImage
                title={page.data.title}
                description={page.data.description}
                site="RIXL"
            />
        ),
        {
            width: 1200,
            height: 630,
        },
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