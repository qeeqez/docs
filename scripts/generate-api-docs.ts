import {generateFiles} from "fumadocs-openapi";
import {openapi} from "@/lib/openapi";

// TODO generate automatically
// TODO add page layout = full
void generateFiles({
  input: openapi,
  output: "./content/docs/en/api",
  per: "operation",
  groupBy: "tag",
  includeDescription: true,
});
