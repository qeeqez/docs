import {createAPIPage} from "fumadocs-openapi/ui";
import type {CodeUsageGeneratorRegistry} from "fumadocs-openapi/dist/requests/generators/index.js";
import {openapi} from "@/lib/openapi";
import {CodeBlockTabsList, CodeBlockTabsTrigger} from "fumadocs-ui/components/codeblock";
import {Tab, Tabs} from "fumadocs-ui/components/tabs";
import {UsageTabLazy} from "../../../node_modules/fumadocs-openapi/dist/ui/operation/usage-tabs/lazy.js";

const APIPageImpl = createAPIPage(openapi, {
  playground: {
    enabled: false,
  },
  content: {
    renderAPIExampleUsageTabs(registry: CodeUsageGeneratorRegistry) {
      const items = Array.from(registry.map().entries());
      if (items.length === 0) return null;

      return (
        <Tabs groupId="fumadocs_openapi_requests" defaultValue={items[0][0]} className="bg-fd-card rounded-xl border my-4 overflow-hidden">
          <CodeBlockTabsList>
            {items.map(([id, item]) => (
              <CodeBlockTabsTrigger key={id} value={id}>
                {item.label ?? item.lang}
              </CodeBlockTabsTrigger>
            ))}
          </CodeBlockTabsList>

          {items.map(([id, item]) => (
            <Tab
              key={id}
              value={id}
              className="p-0 bg-transparent rounded-none outline-none data-[state=inactive]:hidden [&>figure:only-child]:m-0 [&>figure:only-child]:rounded-none [&>figure:only-child]:border-0 [&>figure:only-child]:shadow-none"
            >
              <UsageTabLazy id={id} lang={item.lang} _client={item._client} />
            </Tab>
          ))}
        </Tabs>
      );
    },
  },
});

interface StaticOpenApiSchema {
  id: string;
  bundled: unknown;
  dereferenced: unknown;
}

interface CachedSchema extends StaticOpenApiSchema {
  getRawRef: () => undefined;
}

const schemaPromiseCache = new Map<string, Promise<CachedSchema>>();

function withRawRef(schema: StaticOpenApiSchema): CachedSchema {
  return {
    ...schema,
    getRawRef: () => undefined,
  };
}

function getCachedSchemaPromise(schema: StaticOpenApiSchema): Promise<CachedSchema> {
  const cached = schemaPromiseCache.get(schema.id);
  if (cached) return cached;

  const next = Promise.resolve(withRawRef(schema));
  schemaPromiseCache.set(schema.id, next);
  return next;
}

export function APIPage({
  document,
  ...props
}: Omit<Parameters<typeof APIPageImpl>[0], "document"> & {
  document: StaticOpenApiSchema | Promise<StaticOpenApiSchema>;
}) {
  const resolved = typeof document === "object" && document !== null && "id" in document ? getCachedSchemaPromise(document) : document;

  return <APIPageImpl {...props} document={resolved} />;
}
