import {createAPIPage} from "fumadocs-openapi/ui";
import {openapi} from "@/lib/openapi";

const APIPageImpl = createAPIPage(openapi);
let apiSchemaPromise:
  | Promise<{
      bundled: unknown;
      dereferenced: unknown;
      getRawRef: () => undefined;
    }>
  | undefined;

export function preloadApiSchema() {
  apiSchemaPromise ??= import("@/lib/generated/openapi-schema.json").then(({default: schema}) => ({
    ...schema,
    getRawRef: () => undefined,
  }));

  return apiSchemaPromise;
}

export function APIPage({document: _document, ...props}: Parameters<typeof APIPageImpl>[0]) {
  return <APIPageImpl {...props} document={preloadApiSchema()} />;
}
