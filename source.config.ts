import {defineConfig, defineDocs, frontmatterSchema, metaSchema} from "fumadocs-mdx/config";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections#define-docs
export const docs = defineDocs({
    dir: 'content/docs', // Be explicit about the directory
    docs: {
        schema: frontmatterSchema,
    },
    meta: {
        schema: metaSchema,
    },
});

export const sdk = defineDocs({
    dir: 'content/sdk',
    docs: {
        schema: frontmatterSchema
    },
    meta: {
        schema: metaSchema
    }
});

export default defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    // MDX options
  },
});
