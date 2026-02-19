import {readdir, rm, writeFile} from "node:fs/promises";
import {join} from "node:path";
import {generateFiles} from "fumadocs-openapi";
import {openapi} from "@/lib/openapi";

const output = "./content/docs/en/api";
const filesToKeep = new Set(["meta.json"]);
const methodOrder = new Map([
  ["get", 0],
  ["post", 1],
  ["put", 2],
  ["delete", 3],
]);

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

function compareByMethod(left: string, right: string) {
  const leftMethod = left.split("-")[0];
  const rightMethod = right.split("-")[0];
  const leftPriority = methodOrder.get(leftMethod) ?? Number.MAX_SAFE_INTEGER;
  const rightPriority = methodOrder.get(rightMethod) ?? Number.MAX_SAFE_INTEGER;

  if (leftPriority !== rightPriority) return leftPriority - rightPriority;
  return left.localeCompare(right);
}

async function writeTagMetaFiles(outputDir: string) {
  const entries = await readdir(outputDir, {withFileTypes: true});
  const tagDirectories = entries.filter((entry) => entry.isDirectory());

  await Promise.all(
    tagDirectories.map(async (entry) => {
      const dirPath = join(outputDir, entry.name);
      const files = await readdir(dirPath, {withFileTypes: true});
      const pages = files
        .filter((file) => file.isFile() && file.name.endsWith(".mdx"))
        .map((file) => file.name.slice(0, -4))
        .sort(compareByMethod);

      await writeFile(join(dirPath, "meta.json"), `${JSON.stringify({pages}, null, 2)}\n`);
    })
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

  await writeTagMetaFiles(output);
})();
