import {createAPIPage} from "fumadocs-openapi/ui";
import {openapi} from "@/lib/openapi";

const APIPageImpl = createAPIPage(openapi);

interface StaticOpenApiSchema {
  id: string;
  bundled: unknown;
  dereferenced: unknown;
}

function withRawRef(schema: StaticOpenApiSchema) {
  return {
    ...schema,
    getRawRef: () => undefined,
  };
}

export function APIPage({
  document,
  ...props
}: Omit<Parameters<typeof APIPageImpl>[0], "document"> & {
  document: StaticOpenApiSchema | Promise<StaticOpenApiSchema>;
}) {
  const resolved = Promise.resolve(document).then(withRawRef);

  return <APIPageImpl {...props} document={resolved} />;
}
