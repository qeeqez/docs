import {createAPIPage} from "fumadocs-openapi/ui";
import {openapi} from "@/lib/openapi";
import {CodeBlockTabsList, CodeBlockTabsTrigger} from "fumadocs-ui/components/codeblock";
import {Tab, Tabs} from "fumadocs-ui/components/tabs";
import {ResponseTabs} from "../../../node_modules/fumadocs-openapi/dist/ui/operation/response-tabs.js";
import {getExampleRequests} from "../../../node_modules/fumadocs-openapi/dist/ui/operation/request-tabs.js";
import {csharp} from "fumadocs-openapi/requests/generators/csharp";
import {curl} from "fumadocs-openapi/requests/generators/curl";
import {go} from "fumadocs-openapi/requests/generators/go";
import {java} from "fumadocs-openapi/requests/generators/java";
import {javascript} from "fumadocs-openapi/requests/generators/javascript";
import {python} from "fumadocs-openapi/requests/generators/python";
import {isValidElement} from "react";

const APIPageImpl = createAPIPage(openapi, {
  playground: {
    enabled: false,
  },
  content: {
    async renderOperationLayout(slots, ctx, method) {
      const path = findOperationPath(ctx, method, slots.header);
      const rail = path ? await renderStaticExampleTabs({path, method, ctx}) : slots.apiExample;

      return (
        <div className="flex flex-col gap-x-6 gap-y-4 @4xl:flex-row @4xl:items-start">
          <div className="min-w-0 flex-1">
            {slots.header}
            {slots.apiPlayground}
            {slots.description}
            {slots.authSchemes}
            {slots.paremeters}
            {slots.body}
            {slots.callbacks}
          </div>
          <div className="@4xl:sticky @4xl:top-[calc(var(--fd-docs-row-1,2rem)+1rem)] @4xl:w-[400px]">{rail}</div>
        </div>
      );
    },
  },
});

const requestCodeGenerators = [curl, javascript, go, python, java, csharp];

interface PathParameter {
  value: string;
}

interface QueryParameter {
  values: string[];
}

interface EncodedRequestData {
  path: Record<string, PathParameter>;
  query: Record<string, QueryParameter>;
}

interface MethodWithPath {
  method?: string;
  operationId?: string;
  summary?: string;
}

async function renderStaticExampleTabs({
  path,
  method,
  ctx,
}: {
  path: string;
  method: Parameters<typeof getExampleRequests>[1];
  ctx: Parameters<typeof getExampleRequests>[2];
}) {
  const [firstExample] = getExampleRequests(path, method, ctx);
  if (!firstExample) return <ResponseTabs operation={method} ctx={ctx} />;

  const requestUrl = `https://loading${resolveRequestPath(path, firstExample.encoded as EncodedRequestData)}`;
  const items = requestCodeGenerators.map((generator) => ({
    id: generator === javascript ? "js" : generator.lang === "bash" ? "curl" : generator.lang,
    label: generator.label ?? generator.lang,
    lang: generator.lang,
    code: generator.generate(requestUrl, firstExample.encoded, {
      mediaAdapters: ctx.mediaAdapters,
      server: null,
    }),
  }));
  const highlightedItems = await Promise.all(
    items.map(async (item) => ({
      ...item,
      node: await ctx.renderCodeBlock(item.lang, item.code),
    }))
  );

  return (
    <div className="prose-no-margin">
      <Tabs
        groupId="fumadocs_openapi_requests"
        defaultValue={highlightedItems[0].id}
        className="bg-fd-card rounded-xl border my-4 overflow-hidden"
      >
        <CodeBlockTabsList>
          {highlightedItems.map((item) => (
            <CodeBlockTabsTrigger key={item.id} value={item.id}>
              {item.label}
            </CodeBlockTabsTrigger>
          ))}
        </CodeBlockTabsList>

        {highlightedItems.map((item) => (
          <Tab
            key={item.id}
            value={item.id}
            className="p-0 bg-transparent rounded-none outline-none data-[state=inactive]:hidden [&>figure:only-child]:m-0 [&>figure:only-child]:rounded-none [&>figure:only-child]:border-0 [&>figure:only-child]:shadow-none"
          >
            {item.node}
          </Tab>
        ))}
      </Tabs>

      <ResponseTabs operation={method} ctx={ctx} />
    </div>
  );
}

function findOperationPath(ctx: Parameters<typeof getExampleRequests>[2], method: MethodWithPath, headerNode: unknown): string | undefined {
  const pathFromHeader = extractPathFromHeader(headerNode);
  if (pathFromHeader) return pathFromHeader;

  const methodKey = method.method?.toLowerCase();
  if (!methodKey) return;

  const dereferenced = (ctx.schema as {dereferenced?: unknown}).dereferenced;
  const paths = (
    dereferenced as {
      paths?: Record<string, Record<string, {operationId?: string; summary?: string} | undefined>>;
    }
  )?.paths;
  if (!paths) return;

  const summaryMatches: string[] = [];
  for (const [path, pathItem] of Object.entries(paths)) {
    const operation = pathItem?.[methodKey];
    if (!operation) continue;

    if (method.operationId && operation.operationId === method.operationId) {
      return path;
    }

    if (method.summary && operation.summary === method.summary) {
      summaryMatches.push(path);
    }
  }

  if (summaryMatches.length > 0) return summaryMatches[0];
}

function extractPathFromHeader(node: unknown): string | undefined {
  const text = collectText(node).replace(/\s+/g, " ").trim();
  if (text.length === 0) return;

  const match = text.match(new RegExp("/[A-Za-z0-9\\-._~!$&'()*+,;=:@{}/]+", "g"));
  if (!match) return;

  for (const candidate of match) {
    if (candidate.length > 1) return candidate;
  }
}

function collectText(node: unknown): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join(" ");
  if (!isValidElement(node)) return "";

  const props = node.props as {children?: unknown};
  return collectText(props.children);
}

function resolveRequestPath(pathname: string, data: EncodedRequestData): string {
  let resolvedPath = pathname;
  for (const [key, param] of Object.entries(data.path)) {
    resolvedPath = resolvedPath.replace(`{${key}}`, param.value);
  }

  const [pathPart, existingQueryString] = resolvedPath.split("?", 2);
  const searchParams = new URLSearchParams(existingQueryString ?? "");
  for (const [key, param] of Object.entries(data.query)) {
    if (param.values.length === 0) continue;

    searchParams.delete(key);
    for (const value of param.values) {
      searchParams.append(key, value);
    }
  }

  const query = searchParams.toString();
  return query.length > 0 ? `${pathPart}?${query}` : pathPart;
}

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
