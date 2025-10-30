import {loader,  type InferPageType } from 'fumadocs-core/source';
import {docs} from '@/.source';
import {icons} from "lucide-react";
import {createElement} from "react";
import { i18n } from '@/lib/i18n';

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
    i18n,
  // it assigns a URL to your pages
  baseUrl: '/',
  icon(icon) {
    if (icon && icon in icons)
      return createElement(icons[icon as keyof typeof icons]);
  },
  source: docs.toFumadocsSource(),
});

export function getPageImage(page: InferPageType<typeof source>) {
    const segments = [...page.slugs, 'image.png'];
    const lang = page.locale || 'en';

    return {
        segments,
        url: `/${lang}/og/docs/${segments.join('/')}`,
    };
}
