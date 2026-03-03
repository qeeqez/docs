import {createAPIPage} from "fumadocs-openapi/ui";
import {openapi} from "@/lib/openapi";

const APIPageImpl = createAPIPage(openapi);
const apiSchemaPromise = import("@/lib/generated/openapi-schema.json").then(({default: schema}) => ({
  ...schema,
  getRawRef: () => undefined,
}));

export async function preloadAPIPageRuntime() {
  await Promise.all([apiSchemaPromise, import("@fumari/json-schema-ts")]);
}

export function APIPage(props: Omit<Parameters<typeof APIPageImpl>[0], "document">) {
  return <APIPageImpl {...props} document={apiSchemaPromise} />;
}
