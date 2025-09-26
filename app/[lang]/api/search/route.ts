import {createFromSource} from "fumadocs-core/search/server";
import {source} from "@/lib/source";
// it should be cached forever
export const revalidate = false;
export const {staticGET: GET} = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: "english",
});

export async function generateStaticParams() {
    const params = source.generateParams('slug', 'lang');

    return params.map(param => ({
        lang: param.lang,
        slug: Array.isArray(param.slug) ? param.slug : [param.slug]
    }));
}
