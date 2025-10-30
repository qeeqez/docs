import {notFound} from 'next/navigation';
import LogoWide from '@/assets/logo_wide.svg';
import {generateOGImage} from "@/lib/og";
import {source} from '@/lib/source';

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

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    icon: <LogoWide style={{height: 80, width: 480, fill: "#000000", filter: "invert(100%)"}}/>,
    primaryColor: '#D33F49',
    secondaryColor: '#FFA41C',
  })
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