import {readdir, rm} from "node:fs/promises";
import {join} from "node:path";
import {generateFiles} from "fumadocs-openapi";
import {openapi} from "@/lib/openapi";

const output = "./content/docs/en/api";
const filesToKeep = new Set(["meta.json"]);

function toFlatFileName(value: string) {
  const flattened = value
    .replace(/^\//, "")
    .replace(/[{}]/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return flattened.length > 0 ? flattened : "root";
}

async function cleanupApiDocsOutput(outputDir: string) {
  let entries;

  try {
    entries = await readdir(outputDir, {withFileTypes: true});
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw error;
  }

  await Promise.all(
    entries
      .filter((entry) => !filesToKeep.has(entry.name))
      .map((entry) =>
        rm(join(outputDir, entry.name), {
          force: true,
          recursive: entry.isDirectory(),
        })
      )
  );
}

// TODO add page layout = full
void (async () => {
  await cleanupApiDocsOutput(output);

  await generateFiles({
    input: openapi,
    output,
    per: "operation",
    groupBy: "tag",
    name(entry) {
      const method = entry.item.method.toLowerCase();
      const target = entry.type === "operation" ? entry.item.path : entry.item.name;

      return `${method}-${toFlatFileName(target)}`;
    },
    includeDescription: true,
  });
})();
