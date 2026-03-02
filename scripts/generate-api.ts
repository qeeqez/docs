import {mkdir, rm} from "node:fs/promises";
import {generateFiles} from "fumadocs-openapi";
import {openapi} from "../src/lib/openapi";

const output = "./content/en/api";
const apiDescription = "Generated API reference from OpenAPI schema";

function stripMdxExtension(filePath: string) {
  return filePath.endsWith(".mdx") ? filePath.slice(0, -4) : filePath;
}

function toApiUrl(filePath: string) {
  const pagePath = stripMdxExtension(filePath)
    .replaceAll("\\", "/")
    .replace(/^\.?\//, "");
  return pagePath === "index" ? "/en/api" : `/en/api/${pagePath}`;
}

void (async () => {
  // Keep the API section fully generated from OpenAPI.
  await rm(output, {recursive: true, force: true});
  await mkdir(output, {recursive: true});

  await generateFiles({
    input: openapi,
    output,
    per: "tag",
    index: {
      items: [
        {
          path: "index",
          title: "API Reference",
          description: apiDescription,
        },
      ],
      url: toApiUrl,
    },
    includeDescription: true,
    beforeWrite(files) {
      for (const file of files) {
        if (!file.path.endsWith(".mdx")) continue;
        file.content = file.content.replaceAll("<br>", "<br />");
      }

      const pages = [];

      for (const file of files) {
        if (!file.path.endsWith(".mdx")) continue;
        const pagePath = stripMdxExtension(file.path);
        if (pagePath === "index") continue;
        pages.push(pagePath);
      }

      pages.sort((left, right) => left.localeCompare(right));

      files.push({
        path: "meta.json",
        content: `${JSON.stringify(
          {
            title: "API Reference",
            description: apiDescription,
            pages: ["index", ...pages],
          },
          null,
          2
        )}\n`,
      });
    },
  });
})();
