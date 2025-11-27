import {notFound} from "next/navigation";
import type {NextRequest} from "next/server";
import {getLLMText} from "@/lib/get-llm-text";
import {source} from "@/lib/source";

export const revalidate = false;

/**
 * API route that serves documentation pages as plain text/markdown for LLMs.
 *
 * WORKAROUND: We append .mdx extension to URLs to avoid static export conflicts.
 *
 * Problem: With Next.js static export (output: "export"), route handlers generate
 * files at paths like /en/llms/platform/account-teams. However, these paths
 * conflict with existing directory structures in the docs, causing EISDIR errors
 * during build (Next.js tries to write a file where a directory exists).
 *
 * Solution: Add .mdx extension to the last slug segment in generateStaticParams,
 * creating URLs like /en/llms/platform/account-teams.mdx. This ensures the
 * generated files don't conflict with directories. We then strip the extension
 * in the GET handler to look up the correct page.
 */
export async function GET(_req: NextRequest, {params}: {params: Promise<{slug?: string[]; lang: string}>}) {
  const {slug, lang} = await params;

  // Remove the .mdx extension from the last segment to get the actual page slug
  const cleanSlug = slug?.map((segment, index) => {
    if (index === slug.length - 1 && segment.endsWith(".mdx")) {
      return segment.slice(0, -4);
    }
    return segment;
  });

  const page = source.getPage(cleanSlug, lang);

  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export function generateStaticParams() {
  const params = source.generateParams();

  // Add .mdx extension to avoid directory conflicts during static export
  // This creates URLs like /en/llms/platform/account-teams.mdx instead of
  // /en/llms/platform/account-teams (which would conflict with the directory)
  return params.map((param) => {
    const slug = param.slug as string[] | undefined;
    if (slug && slug.length > 0) {
      const newSlug = [...slug];
      newSlug[newSlug.length - 1] = `${newSlug[newSlug.length - 1]}.mdx`;
      return {
        ...param,
        slug: newSlug,
      };
    }
    return param;
  });
}
