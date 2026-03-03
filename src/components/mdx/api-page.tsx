import {createAPIPage} from "fumadocs-openapi/ui";
import {openapi} from "@/lib/openapi";

const APIPageImpl = createAPIPage(openapi);
const apiSchemaPromise = openapi.getSchema("./api.json");

export function APIPage(props: Omit<Parameters<typeof APIPageImpl>[0], "document">) {
  return <APIPageImpl {...props} document={apiSchemaPromise} />;
}
