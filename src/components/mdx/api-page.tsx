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
import {sample} from "openapi-sampler";
import {ChevronRight} from "lucide-react";
import {joinApiUrl, resolveOpenApiBaseUrl} from "@/lib/api-base-url";
import type {ApiServer, ApiServerRoot} from "@/lib/api-base-url";

const APIPageImpl = createAPIPage(openapi, {
  playground: {
    enabled: false,
  },
  showResponseSchema: false,
  content: {
    async renderResponseTabs(tabs, ctx) {
      if (tabs.length === 0) return null;

      const panels = await Promise.all(
        tabs.map(async (tab) => {
          const examples = tab.examples ?? [];
          const renderedExamples = await Promise.all(
            examples.map(async (example) => ({
              ...example,
              code: await ctx.renderCodeBlock(
                "json",
                JSON.stringify(normalizeResponseSample(example.sample, tab.code, tab.response.description), null, 2)
              ),
            }))
          );

          return {
            code: tab.code,
            mediaType: tab.mediaType,
            description: tab.response.description,
            examples: renderedExamples,
          };
        })
      );

      return (
        <Tabs groupId="fumadocs_openapi_responses" defaultValue={panels[0].code} className="bg-fd-card rounded-xl border overflow-hidden">
          <CodeBlockTabsList>
            {panels.map((tab) => (
              <CodeBlockTabsTrigger key={tab.code} value={tab.code}>
                {tab.code}
              </CodeBlockTabsTrigger>
            ))}
          </CodeBlockTabsList>

          {panels.map((tab) => (
            <Tab key={tab.code} value={tab.code} className="p-4 space-y-4 bg-fd-background rounded-none data-[state=inactive]:hidden">
              {tab.description ? <div className="prose-no-margin text-sm">{ctx.renderMarkdown(tab.description)}</div> : null}

              {tab.mediaType ? <p className="text-xs text-fd-muted-foreground font-mono">{tab.mediaType}</p> : null}

              {tab.examples.length > 0 ? (
                <div className="space-y-4">
                  {tab.examples.map((example, index) => (
                    <div key={`${tab.code}:${index}`} className="space-y-2">
                      {tab.examples.length > 1 ? <p className="text-xs font-medium text-fd-muted-foreground">{example.label}</p> : null}
                      {example.description ? (
                        <div className="prose-no-margin text-xs text-fd-muted-foreground">{ctx.renderMarkdown(example.description)}</div>
                      ) : null}
                      {example.code}
                    </div>
                  ))}
                </div>
              ) : tab.description ? null : (
                <p className="text-sm text-fd-muted-foreground">No response body.</p>
              )}
            </Tab>
          ))}
        </Tabs>
      );
    },
    async renderOperationLayout(slots, ctx, method) {
      const path = findOperationPath(ctx, method, slots.header);
      const rail = path ? await renderStaticExampleTabs({path, method, ctx}) : slots.apiExample;
      const requestBody = await renderStaticRequestBodySection(method, ctx);
      const responses = await renderStaticResponseSection(method, ctx);

      return (
        <div className="flex flex-col gap-x-6 gap-y-4 @4xl:flex-row @4xl:items-start">
          <div className="min-w-0 flex-1">
            {slots.header}
            {slots.apiPlayground}
            {slots.description}
            {slots.authSchemes}
            {slots.paremeters}
            {requestBody}
            {responses}
            {slots.callbacks}
          </div>
          <div className="@4xl:sticky @4xl:top-[calc(var(--fd-docs-row-2,var(--fd-docs-row-1,2rem))+1rem)] @4xl:w-[400px]">{rail}</div>
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
  servers?: ApiServer[];
  requestBody?: RequestBodyLite;
  responses?: Record<string, ResponseObjectLite>;
}

interface RequestBodyLite {
  required?: boolean;
  content?: Record<string, RequestMediaTypeLite>;
}

interface RequestMediaTypeLite {
  example?: unknown;
  examples?: Record<string, RequestExampleLite>;
  schema?: SchemaLite;
}

interface RequestExampleLite {
  summary?: string;
  description?: string;
  value?: unknown;
}

interface ResponseObjectLite {
  description?: string;
  content?: Record<string, ResponseMediaTypeLite>;
}

interface ResponseMediaTypeLite {
  example?: unknown;
  examples?: Record<string, ResponseExampleLite>;
  schema?: unknown;
}

interface ResponseExampleLite {
  summary?: string;
  description?: string;
  value?: unknown;
}

interface SchemaLite {
  type?: string | string[];
  description?: string;
  properties?: Record<string, SchemaLite>;
  required?: string[];
  items?: SchemaLite;
  enum?: unknown[];
  oneOf?: SchemaLite[];
  anyOf?: SchemaLite[];
  allOf?: SchemaLite[];
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

  const rootSchema = (ctx.schema as {dereferenced?: unknown}).dereferenced as ApiServerRoot | undefined;
  const requestUrl = joinApiUrl(
    resolveOpenApiBaseUrl(rootSchema, method.servers),
    resolveRequestPath(path, firstExample.encoded as EncodedRequestData)
  );
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

async function renderStaticResponseSection(method: MethodWithPath, ctx: Parameters<typeof getExampleRequests>[2]) {
  const responseEntries = Object.entries(method.responses ?? {});
  if (responseEntries.length === 0) return null;

  const sections = await Promise.all(
    responseEntries.map(async ([status, response]) => {
      const descriptionNode = response.description ? await ctx.renderMarkdown(response.description) : null;
      const mediaEntries = Object.entries(response.content ?? {});
      const mediaBlocks = await Promise.all(
        mediaEntries.map(async ([mediaType, media]) => {
          const renderedProperties = await buildRenderedSchemaProperties(media.schema as SchemaLite | undefined, ctx);

          let exampleNode: unknown = null;
          if (renderedProperties.length === 0) {
            const [example] = collectResponseExamples(media);
            if (example) {
              exampleNode = await ctx.renderCodeBlock(
                "json",
                JSON.stringify(normalizeResponseSample(example.sample, status, response.description), null, 2)
              );
            }
          }

          return {
            mediaType,
            rootType: media.schema ? schemaTypeLabel(media.schema as SchemaLite) : null,
            properties: renderedProperties,
            exampleNode,
          };
        })
      );

      return (
        <details key={status} className="group scroll-m-20 border-b border-fd-border py-2">
          <summary className="not-prose flex list-none cursor-pointer items-center justify-between gap-2 py-1 font-mono text-fd-foreground [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-1.5">
              <ChevronRight className="size-3.5 text-fd-muted-foreground transition-transform group-open:rotate-90" />
              {status}
            </span>
            {mediaEntries.length === 1 ? <code className="text-xs text-fd-muted-foreground">{mediaEntries[0]?.[0]}</code> : null}
          </summary>
          <div className="prose-no-margin space-y-4 pt-2 ps-4">
            {descriptionNode}
            {mediaBlocks.map((mediaBlock) => (
              <div key={`${status}:${mediaBlock.mediaType}`} className="space-y-3">
                {mediaEntries.length > 1 ? <p className="text-xs font-mono text-fd-muted-foreground">{mediaBlock.mediaType}</p> : null}
                {mediaBlock.rootType ? <p className="text-xs font-mono text-fd-muted-foreground">type: {mediaBlock.rootType}</p> : null}
                {mediaBlock.properties.length > 0 ? (
                  <div className="flex flex-col">{renderSchemaProperties(mediaBlock.properties, `${status}:${mediaBlock.mediaType}`)}</div>
                ) : mediaBlock.exampleNode ? (
                  mediaBlock.exampleNode
                ) : (
                  <p className="text-sm text-fd-muted-foreground">No response body.</p>
                )}
              </div>
            ))}
          </div>
        </details>
      );
    })
  );

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold tracking-tight mb-2">Response Body</h2>
      <div className="divide-y divide-fd-border">{sections}</div>
    </section>
  );
}

async function renderStaticRequestBodySection(method: MethodWithPath, ctx: Parameters<typeof getExampleRequests>[2]) {
  const requestBody = method.requestBody;
  const mediaEntries = Object.entries(requestBody?.content ?? {});
  if (mediaEntries.length === 0) return null;

  const mediaSections = await Promise.all(
    mediaEntries.map(async ([mediaType, media]) => {
      const example = getRequestExample(media);
      const renderedExample = example === undefined ? null : await ctx.renderCodeBlock("json", JSON.stringify(example, null, 2));
      const renderedProperties = await buildRenderedSchemaProperties(media.schema, ctx);

      return {
        mediaType,
        renderedExample,
        properties: renderedProperties,
      };
    })
  );

  return (
    <section className="mt-10 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-semibold tracking-tight my-0">Request Body</h2>
        {requestBody?.required ? <span className="text-xs text-fd-muted-foreground">required</span> : null}
      </div>

      {mediaSections.map((section) => (
        <div key={section.mediaType} className="space-y-4">
          <code className="text-xs text-fd-muted-foreground">{section.mediaType}</code>

          {section.renderedExample}

          {section.properties.length > 0 ? (
            <div className="flex flex-col">{renderSchemaProperties(section.properties, section.mediaType)}</div>
          ) : null}
        </div>
      ))}
    </section>
  );
}

function collectResponseExamples(media: ResponseMediaTypeLite): Array<{label: string; description?: string; sample: unknown}> {
  const examples: Array<{label: string; description?: string; sample: unknown}> = [];
  if (media.examples) {
    for (const [key, entry] of Object.entries(media.examples)) {
      examples.push({
        label: entry.summary || `Example ${key}`,
        description: entry.description,
        sample: entry.value,
      });
    }
    return examples;
  }

  if (media.example !== undefined) {
    examples.push({
      label: "Example",
      sample: media.example,
    });
    return examples;
  }

  if (media.schema !== undefined) {
    examples.push({
      label: "Example",
      sample: sampleSchema(media.schema),
    });
  }

  return examples;
}

function sampleSchema(schema: unknown): unknown {
  if (!schema || typeof schema !== "object") return schema;
  try {
    return sample(schema as object);
  } catch {
    return schema;
  }
}

function getRequestExample(media: RequestMediaTypeLite): unknown {
  if (media.examples) {
    const firstExample = Object.values(media.examples)[0];
    if (firstExample && "value" in firstExample) return firstExample.value;
  }
  if (media.example !== undefined) return media.example;
  if (media.schema !== undefined) return sampleSchema(media.schema);
  return undefined;
}

interface RenderedSchemaProperty {
  name: string;
  schema: SchemaLite;
  required: boolean;
  description: unknown;
  children: RenderedSchemaProperty[];
}

async function buildRenderedSchemaProperties(
  schema: SchemaLite | undefined,
  ctx: Parameters<typeof getExampleRequests>[2],
  depth = 0,
  seen: Set<SchemaLite> = new Set()
): Promise<RenderedSchemaProperty[]> {
  if (!schema || depth > 3) return [];

  const props = getObjectProperties(schema);
  if (props.length === 0) return [];

  return Promise.all(
    props.map(async ({name, schema: propertySchema, required}) => {
      const nextSeen = new Set(seen);
      const canRecurse = !nextSeen.has(propertySchema);
      nextSeen.add(propertySchema);

      return {
        name,
        schema: propertySchema,
        required,
        description: propertySchema.description ? await ctx.renderMarkdown(propertySchema.description) : null,
        children: canRecurse ? await buildRenderedSchemaProperties(propertySchema, ctx, depth + 1, nextSeen) : [],
      };
    })
  );
}

function renderSchemaProperties(properties: RenderedSchemaProperty[], keyPrefix: string, depth = 0): JSX.Element[] {
  return properties.map((property, index) => (
    <div
      key={`${keyPrefix}:${depth}:${property.name}:${index}`}
      className={`text-sm ${depth === 0 ? "border-t py-4 first:border-t-0" : "border-t py-3 first:border-t-0"}`}
    >
      <div className={`flex flex-wrap items-center gap-3 not-prose ${depth > 0 ? "ps-1" : ""}`}>
        <span className="font-medium font-mono text-fd-primary">
          {property.name}
          {property.required ? <span className="text-red-400">*</span> : <span className="text-fd-muted-foreground">?</span>}
        </span>
        <span className="text-sm font-mono text-fd-muted-foreground">{schemaTypeLabel(property.schema)}</span>
      </div>

      <div className="prose-no-margin pt-2.5 empty:hidden">{property.description}</div>

      {property.schema.enum && property.schema.enum.length > 0 ? (
        <div className="flex flex-row gap-2 flex-wrap my-2 not-prose">
          <div className="flex flex-row items-start gap-2 bg-fd-secondary border rounded-lg text-xs p-1.5 shadow-md max-w-full">
            <span className="font-medium">Value in</span>
            <code className="min-w-0 flex-1 text-fd-muted-foreground truncate">
              {property.schema.enum.map((value) => JSON.stringify(value)).join(" | ")}
            </code>
          </div>
        </div>
      ) : null}

      {property.children.length > 0 ? (
        <div className="mt-2 border-s border-fd-border/70 ps-4">
          {renderSchemaProperties(property.children, `${keyPrefix}:${property.name}`, depth + 1)}
        </div>
      ) : null}
    </div>
  ));
}

function getObjectProperties(schema?: SchemaLite): Array<{name: string; schema: SchemaLite; required: boolean}> {
  if (!schema || typeof schema !== "object") return [];

  const mergedSchema = mergeAllOf(schema);
  if (mergedSchema.type === "array" && mergedSchema.items) {
    return getObjectProperties(mergedSchema.items);
  }
  const properties = mergedSchema.properties ?? {};
  const required = new Set(mergedSchema.required ?? []);

  return Object.entries(properties).map(([name, value]) => ({
    name,
    schema: value,
    required: required.has(name),
  }));
}

function mergeAllOf(schema: SchemaLite): SchemaLite {
  const allOf = schema.allOf ?? [];
  if (allOf.length === 0) return schema;

  const mergedProperties: Record<string, SchemaLite> = {...(schema.properties ?? {})};
  const mergedRequired = new Set(schema.required ?? []);

  for (const item of allOf) {
    for (const [name, value] of Object.entries(item.properties ?? {})) {
      mergedProperties[name] = value;
    }
    for (const name of item.required ?? []) {
      mergedRequired.add(name);
    }
  }

  return {
    ...schema,
    properties: mergedProperties,
    required: Array.from(mergedRequired),
  };
}

function schemaTypeLabel(schema: SchemaLite): string {
  if (Array.isArray(schema.type)) return schema.type.join(" | ");
  if (schema.type === "array") {
    const itemType = schema.items ? schemaTypeLabel(schema.items) : "unknown";
    return `array<${itemType}>`;
  }
  if (schema.type) return schema.type;
  if (schema.oneOf && schema.oneOf.length > 0) return schema.oneOf.map(schemaTypeLabel).join(" | ");
  if (schema.anyOf && schema.anyOf.length > 0) return schema.anyOf.map(schemaTypeLabel).join(" | ");
  if ((schema.properties && Object.keys(schema.properties).length > 0) || (schema.allOf && schema.allOf.length > 0)) return "object";
  return "unknown";
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

function normalizeResponseSample(sample: unknown, responseCode: string, responseDescription?: string): unknown {
  const statusCode = Number(responseCode);
  const isHttpStatusCode = Number.isFinite(statusCode);
  if (!sample || typeof sample !== "object" || Array.isArray(sample)) return sample;

  const record = sample as Record<string, unknown>;
  const normalized: Record<string, unknown> = {...record};
  let changed = false;

  if (isHttpStatusCode) {
    if (typeof record.code === "number" && record.code !== statusCode) {
      normalized.code = statusCode;
      changed = true;
    }
    if (typeof record.code === "string" && record.code !== String(statusCode)) {
      normalized.code = statusCode;
      changed = true;
    }
  }

  const errorMessage = typeof responseDescription === "string" ? responseDescription.trim() : "";
  if (
    errorMessage.length > 0 &&
    isHttpStatusCode &&
    statusCode >= 400 &&
    typeof normalized.error === "string" &&
    normalized.error !== errorMessage
  ) {
    normalized.error = errorMessage;
    changed = true;
  }

  return changed ? normalized : sample;
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
