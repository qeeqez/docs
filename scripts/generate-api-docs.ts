import {generateFiles} from "fumadocs-openapi";
import {openapi} from "@/lib/openapi";

void generateFiles({
  input: openapi,
  output: "./content/docs/en/api",
  per: "operation",
  groupBy: "tag",
  includeDescription: true,
});
