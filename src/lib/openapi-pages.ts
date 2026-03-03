import type {SchemaToPagesOptions} from "fumadocs-openapi/server";

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

export const openApiPagesOptions: SchemaToPagesOptions = {
  per: "operation",
  groupBy: "tag",
  includeDescription: true,
  name(entry) {
    if (entry.type === "operation") {
      return `${entry.item.method.toLowerCase()}-${toFlatFileName(entry.item.path)}`;
    }

    return `webhook-${entry.item.method.toLowerCase()}-${toFlatFileName(entry.item.name)}`;
  },
};
