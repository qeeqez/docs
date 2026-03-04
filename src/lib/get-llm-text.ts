import type {ApiPageProps, OperationItem, WebhookItem} from "fumadocs-openapi/ui";
import {openapiSource} from "fumadocs-openapi/server";
import {openapi} from "@/lib/openapi";
import {openApiPagesOptions} from "@/lib/openapi-pages";

interface OpenApiSchema {
  $ref?: string;
  type?: string | string[];
  format?: string;
  description?: string;
  nullable?: boolean;
  enum?: unknown[];
  required?: string[];
  properties?: Record<string, OpenApiSchema | undefined>;
  items?: OpenApiSchema;
  allOf?: OpenApiSchema[];
  anyOf?: OpenApiSchema[];
  oneOf?: OpenApiSchema[];
  additionalProperties?: boolean | OpenApiSchema;
}

interface OpenApiMediaType {
  schema?: OpenApiSchema;
}

interface OpenApiResponse {
  description?: string;
  schema?: OpenApiSchema;
  content?: Record<string, OpenApiMediaType | undefined>;
}

interface OpenApiServer {
  url?: string;
  description?: string;
  variables?: Record<string, {default?: string; description?: string} | undefined>;
}

interface OpenApiSecurityRequirement {
  [schemeName: string]: string[] | undefined;
}

interface OpenApiSecurityScheme {
  type?: string;
  description?: string;
  name?: string;
  in?: string;
  scheme?: string;
  bearerFormat?: string;
}

interface OpenApiOperation {
  operationId?: string;
  summary?: string;
  description?: string;
  security?: OpenApiSecurityRequirement[];
  servers?: OpenApiServer[];
  consumes?: string[];
  produces?: string[];
  parameters?: Array<{
    name?: string;
    in?: string;
    required?: boolean;
    description?: string;
    type?: string;
    format?: string;
    enum?: unknown[];
    schema?: OpenApiSchema;
  }>;
  requestBody?: {
    required?: boolean;
    description?: string;
    content?: Record<string, OpenApiMediaType | undefined>;
  };
  responses?: Record<string, OpenApiResponse | undefined>;
}

interface OpenApiDereferencedSchema {
  paths?: Record<string, Record<string, OpenApiOperation | undefined> | undefined>;
  webhooks?: Record<string, Record<string, OpenApiOperation | undefined> | undefined>;
  components?: {
    securitySchemes?: Record<string, OpenApiSecurityScheme | undefined>;
  };
  securityDefinitions?: Record<string, OpenApiSecurityScheme | undefined>;
  security?: OpenApiSecurityRequirement[];
  servers?: OpenApiServer[];
  host?: string;
  basePath?: string;
  schemes?: string[];
}

interface OpenApiRootSchema {
  dereferenced?: OpenApiDereferencedSchema;
}

interface LLMPage {
  url: string;
  data: {
    title: string;
    description?: string;
    type?: string;
    getText?: (format: "processed") => Promise<string>;
    getAPIPageProps?: () => Omit<ApiPageProps, "document">;
    getSchema?: () => OpenApiRootSchema;
  };
}

interface OpenApiPageData {
  title?: string;
  description?: string;
  getAPIPageProps?: () => Omit<ApiPageProps, "document">;
  getSchema?: () => OpenApiRootSchema;
}

interface SchemaRenderContext {
  seenRefs: Set<string>;
  seenObjects: Set<OpenApiSchema>;
}

export async function getLLMText(page: LLMPage) {
  if (isOpenAPIPage(page)) {
    return renderOpenAPIMarkdown(page);
  }

  if (page.url.includes("/api/")) {
    const fallback = await renderOpenApiFallbackByUrl(page);
    if (fallback) return fallback;
  }

  if (typeof page.data.getText !== "function") {
    return `# ${page.data.title} (${page.url})`;
  }

  const processed = await page.data.getText("processed");
  // Some virtual sources can return placeholder JSON instead of processed markdown.
  if (isNotFoundPayload(processed)) {
    const fallback = await renderOpenApiFallbackByUrl(page);
    if (fallback) return fallback;
    return `# ${page.data.title} (${page.url})`;
  }

  return `# ${page.data.title} (${page.url})

${processed}`;
}

let openApiFallbackIndexPromise: Promise<Map<string, OpenApiPageData>> | undefined;

async function getOpenApiFallbackIndex() {
  if (!openApiFallbackIndexPromise) {
    openApiFallbackIndexPromise = (async () => {
      const result = await openapiSource(openapi, {
        ...openApiPagesOptions,
        baseDir: "en/api",
      });
      const map = new Map<string, OpenApiPageData>();

      for (const file of result.files) {
        if (file.type !== "page") continue;
        const normalizedPath = file.path.replace(/\.(mdx|md)$/u, "");
        map.set(`/${normalizedPath}`, file.data as OpenApiPageData);
      }

      return map;
    })();
  }

  return openApiFallbackIndexPromise;
}

async function renderOpenApiFallbackByUrl(page: LLMPage) {
  if (!page.url.includes("/api/")) return;

  const map = await getOpenApiFallbackIndex();
  const url = page.url.replace(/\/+$/u, "");
  const localizedUrl = url.startsWith("/api/") ? `/en${url}` : url;
  const deLocalizedUrl = url.replace(/^\/[a-z]{2}(?=\/api\/)/u, "");
  const fallbackData = map.get(url) ?? map.get(localizedUrl) ?? map.get(deLocalizedUrl);
  if (!fallbackData || typeof fallbackData.getAPIPageProps !== "function" || typeof fallbackData.getSchema !== "function") return;

  return renderOpenAPIMarkdown({
    ...page,
    data: {
      ...page.data,
      title: fallbackData.title ?? page.data.title,
      description: fallbackData.description ?? page.data.description,
      getAPIPageProps: fallbackData.getAPIPageProps,
      getSchema: fallbackData.getSchema,
    },
  });
}

function isNotFoundPayload(processed: string) {
  const compact = processed.trim().replace(/\s+/gu, "");
  return compact.includes('"isNotFound":true');
}

function isOpenAPIPage(page: LLMPage): page is LLMPage & {
  data: LLMPage["data"] & {
    getAPIPageProps: () => Omit<ApiPageProps, "document">;
    getSchema: () => OpenApiRootSchema;
  };
} {
  return (
    typeof page.data.getAPIPageProps === "function" &&
    typeof page.data.getSchema === "function" &&
    (page.data.type === "openapi" || page.url.includes("/api/"))
  );
}

function renderOpenAPIMarkdown(
  page: LLMPage & {
    data: LLMPage["data"] & {
      getAPIPageProps: () => Omit<ApiPageProps, "document">;
      getSchema: () => OpenApiRootSchema;
    };
  }
) {
  const props = page.data.getAPIPageProps();
  const schema = page.data.getSchema().dereferenced;

  const lines: string[] = [`# ${page.data.title} (${page.url})`, ""];
  if (page.data.description) {
    lines.push(page.data.description, "");
  }

  if (props.operations?.length) {
    lines.push("## Operations", "");
    for (const item of props.operations) {
      lines.push(...renderOperationSection(item, schema?.paths?.[item.path]?.[item.method], schema));
    }
  }

  if (props.webhooks?.length) {
    lines.push("## Webhooks", "");
    for (const item of props.webhooks) {
      lines.push(...renderWebhookSection(item, schema?.webhooks?.[item.name]?.[item.method], schema));
    }
  }

  if (!props.operations?.length && !props.webhooks?.length) {
    lines.push("No OpenAPI operations were found for this page.");
  }

  return `${lines.join("\n")}\n`;
}

function renderOperationSection(
  item: OperationItem,
  operation: OpenApiOperation | undefined,
  schema: OpenApiDereferencedSchema | undefined
) {
  const method = item.method.toUpperCase();
  const title = operation?.summary || operation?.operationId || `${method} ${item.path}`;
  const lines = [`### ${title}`, "", `- Method: \`${method}\``, `- Path: \`${item.path}\``];
  appendOperationDetails(lines, operation, schema);
  lines.push("");
  return lines;
}

function renderWebhookSection(item: WebhookItem, operation: OpenApiOperation | undefined, schema: OpenApiDereferencedSchema | undefined) {
  const method = item.method.toUpperCase();
  const title = operation?.summary || operation?.operationId || `${method} /${item.name}`;
  const lines = [`### ${title}`, "", `- Method: \`${method}\``, `- Webhook: \`/${item.name}\``];
  appendOperationDetails(lines, operation, schema);
  lines.push("");
  return lines;
}

function appendOperationDetails(lines: string[], operation: OpenApiOperation | undefined, schema: OpenApiDereferencedSchema | undefined) {
  if (!operation) {
    lines.push("- Details: unavailable in schema snapshot.");
    return;
  }

  if (operation.description) {
    lines.push("", normalizeInlineText(operation.description));
  }

  if (operation.parameters?.length) {
    lines.push("", "- Parameters:");
    for (const parameter of operation.parameters) {
      const name = parameter.name ?? "unknown";
      const location = parameter.in ?? "unknown";
      const required = parameter.required ? "required" : "optional";
      const type = getParameterType(parameter);
      const description = normalizeInlineText(parameter.description);
      const typeSegment = type ? `, ${type}` : "";
      lines.push(`  - \`${name}\` (${location}, ${required}${typeSegment})${description ? `: ${description}` : ""}`);
    }
  }

  appendAuthorizationDetails(lines, operation, schema);
  appendServerDetails(lines, operation, schema);
  appendRequestBodyDetails(lines, operation);
  appendResponseDetails(lines, operation);
}

function appendAuthorizationDetails(lines: string[], operation: OpenApiOperation, schema: OpenApiDereferencedSchema | undefined) {
  const operationSecurity = operation.security;
  const inheritedSecurity = schema?.security;
  const effectiveSecurity = operationSecurity ?? inheritedSecurity;
  const schemeMap = {
    ...(schema?.components?.securitySchemes ?? {}),
    ...(schema?.securityDefinitions ?? {}),
  };

  if (Array.isArray(operationSecurity) && operationSecurity.length === 0) {
    lines.push("", "- Authorization: none");
    return;
  }

  if (!effectiveSecurity || effectiveSecurity.length === 0) {
    lines.push("", "- Authorization: not specified");
    return;
  }

  lines.push("", "- Authorization:");
  for (const requirement of effectiveSecurity) {
    for (const [schemeName, scopes] of Object.entries(requirement)) {
      lines.push(`  - ${formatSecuritySchemeSummary(schemeName, schemeMap[schemeName], scopes)}`);
    }
  }
}

function appendServerDetails(lines: string[], operation: OpenApiOperation, schema: OpenApiDereferencedSchema | undefined) {
  const servers = resolveServers(operation, schema);
  if (servers.length === 0) {
    lines.push("", "- Servers: not specified");
    return;
  }

  lines.push("", "- Servers:");
  for (const server of servers) {
    if (!server.url) continue;
    const description = normalizeInlineText(server.description);
    lines.push(`  - \`${server.url}\`${description ? `: ${description}` : ""}`);
    const variables = Object.entries(server.variables ?? {});
    for (const [name, value] of variables) {
      if (!value) continue;
      const defaultValue = value.default ? ` default=\`${value.default}\`` : "";
      const variableDescription = normalizeInlineText(value.description);
      lines.push(`    - \`${name}\`${defaultValue}${variableDescription ? `: ${variableDescription}` : ""}`);
    }
  }
}

function appendRequestBodyDetails(lines: string[], operation: OpenApiOperation) {
  const requestBodies = getRequestBodies(operation);
  if (requestBodies.length === 0) return;

  lines.push("", "- Request body:");
  for (const requestBody of requestBodies) {
    const required = requestBody.required ? "required" : "optional";
    lines.push(`  - Content type: \`${requestBody.contentType}\` (${required})`);
    if (requestBody.description) {
      lines.push(`    - ${normalizeInlineText(requestBody.description)}`);
    }
    if (requestBody.schema) {
      lines.push("    - Type structure:");
      appendSchemaNode(lines, requestBody.schema, 3, "body", true, {
        seenRefs: new Set(),
        seenObjects: new Set(),
      });
    }
  }
}

function appendResponseDetails(lines: string[], operation: OpenApiOperation) {
  const responses = operation.responses ? Object.entries(operation.responses) : [];
  if (responses.length === 0) return;

  lines.push("", "- Responses:");
  for (const [status, response] of responses) {
    if (!response) continue;
    const description = normalizeInlineText(response.description);
    lines.push(`  - \`${status}\`${description ? `: ${description}` : ""}`);

    const responseContents = getResponseContents(response, operation.produces);
    for (const content of responseContents) {
      lines.push(`    - Content type: \`${content.contentType}\``);
      if (content.schema) {
        lines.push("      - Type structure:");
        appendSchemaNode(lines, content.schema, 4, "body", true, {
          seenRefs: new Set(),
          seenObjects: new Set(),
        });
      }
    }
  }
}

function getParameterType(parameter: {type?: string; format?: string; schema?: OpenApiSchema; enum?: unknown[]}) {
  if (parameter.schema) {
    return getSchemaTypeLabel(parameter.schema);
  }

  if (!parameter.type) return;
  const format = parameter.format ? ` (${parameter.format})` : "";
  const enumSegment = parameter.enum && parameter.enum.length > 0 ? ` enum=${parameter.enum.map(formatLiteral).join(", ")}` : "";
  return `${parameter.type}${format}${enumSegment}`;
}

function formatSecuritySchemeSummary(schemeName: string, scheme: OpenApiSecurityScheme | undefined, scopes: string[] | undefined) {
  if (!scheme) {
    const scopesSegment = scopes && scopes.length > 0 ? ` scopes=${scopes.map((scope) => `\`${scope}\``).join(", ")}` : "";
    return `\`${schemeName}\`${scopesSegment}`;
  }

  if (scheme.type === "apiKey") {
    const location = scheme.in ?? "header";
    const keyName = scheme.name ?? "apiKey";
    const description = normalizeInlineText(scheme.description);
    return `\`${schemeName}\` (apiKey in ${location} \`${keyName}\`)${description ? `: ${description}` : ""}`;
  }

  if (scheme.type === "http") {
    const mode = scheme.scheme ? ` ${scheme.scheme}${scheme.bearerFormat ? ` ${scheme.bearerFormat}` : ""}` : "";
    const description = normalizeInlineText(scheme.description);
    return `\`${schemeName}\` (http${mode})${description ? `: ${description}` : ""}`;
  }

  if (scheme.type === "oauth2" || scheme.type === "openIdConnect") {
    const scopesSegment = scopes && scopes.length > 0 ? ` scopes=${scopes.map((scope) => `\`${scope}\``).join(", ")}` : "";
    const description = normalizeInlineText(scheme.description);
    return `\`${schemeName}\` (${scheme.type}${scopesSegment})${description ? `: ${description}` : ""}`;
  }

  const description = normalizeInlineText(scheme.description);
  return `\`${schemeName}\` (${scheme.type ?? "auth"})${description ? `: ${description}` : ""}`;
}

function resolveServers(operation: OpenApiOperation, schema: OpenApiDereferencedSchema | undefined) {
  if (operation.servers && operation.servers.length > 0) return operation.servers;
  if (schema?.servers && schema.servers.length > 0) return schema.servers;
  if (!schema?.host) return [];

  const schemes = schema.schemes && schema.schemes.length > 0 ? schema.schemes : ["https"];
  const basePath = schema.basePath ?? "";
  return schemes.map((scheme) => ({
    url: `${scheme}://${schema.host}${basePath}`,
  }));
}

function getRequestBodies(operation: OpenApiOperation) {
  const out: Array<{
    contentType: string;
    required: boolean;
    description?: string;
    schema?: OpenApiSchema;
  }> = [];

  if (operation.requestBody) {
    const requestContent = Object.entries(operation.requestBody.content ?? {});
    if (requestContent.length > 0) {
      for (const [contentType, media] of requestContent) {
        out.push({
          contentType,
          required: Boolean(operation.requestBody.required),
          description: operation.requestBody.description,
          schema: media?.schema,
        });
      }
    } else {
      out.push({
        contentType: "application/json",
        required: Boolean(operation.requestBody.required),
        description: operation.requestBody.description,
      });
    }
  }

  const bodyParameters = operation.parameters?.filter((parameter) => parameter.in === "body") ?? [];
  const bodyContentTypes = operation.consumes && operation.consumes.length > 0 ? operation.consumes : ["application/json"];
  for (const parameter of bodyParameters) {
    for (const contentType of bodyContentTypes) {
      out.push({
        contentType,
        required: Boolean(parameter.required),
        description: parameter.description,
        schema: parameter.schema,
      });
    }
  }

  const formDataParameters = operation.parameters?.filter((parameter) => parameter.in === "formData") ?? [];
  if (formDataParameters.length > 0) {
    const properties: Record<string, OpenApiSchema> = {};
    const required: string[] = [];
    for (const parameter of formDataParameters) {
      if (!parameter.name) continue;
      properties[parameter.name] = {
        type: parameter.type,
        format: parameter.format,
        description: parameter.description,
        enum: parameter.enum,
      };
      if (parameter.required) required.push(parameter.name);
    }

    const formSchema: OpenApiSchema = {
      type: "object",
      properties,
      required,
    };
    const formContentTypes = operation.consumes && operation.consumes.length > 0 ? operation.consumes : ["multipart/form-data"];
    for (const contentType of formContentTypes) {
      out.push({
        contentType,
        required: required.length > 0,
        schema: formSchema,
      });
    }
  }

  return dedupeRequestBodies(out);
}

function getResponseContents(response: OpenApiResponse, produces: string[] | undefined) {
  const out: Array<{contentType: string; schema?: OpenApiSchema}> = [];
  const contentEntries = Object.entries(response.content ?? {});

  if (contentEntries.length > 0) {
    for (const [contentType, media] of contentEntries) {
      out.push({
        contentType,
        schema: media?.schema,
      });
    }
  }

  if (response.schema) {
    const responseContentTypes = produces && produces.length > 0 ? produces : ["application/json"];
    for (const contentType of responseContentTypes) {
      out.push({
        contentType,
        schema: response.schema,
      });
    }
  }

  if (out.length === 0) {
    out.push({contentType: "n/a"});
  }

  return dedupeResponseContents(out);
}

function dedupeRequestBodies(
  entries: Array<{
    contentType: string;
    required: boolean;
    description?: string;
    schema?: OpenApiSchema;
  }>
) {
  const seen = new Set<string>();
  const deduped: typeof entries = [];

  for (const entry of entries) {
    const key = `${entry.contentType}|${entry.required}|${entry.description ?? ""}|${schemaSignature(entry.schema)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(entry);
  }

  return deduped;
}

function dedupeResponseContents(entries: Array<{contentType: string; schema?: OpenApiSchema}>) {
  const seen = new Set<string>();
  const deduped: typeof entries = [];

  for (const entry of entries) {
    const key = `${entry.contentType}|${schemaSignature(entry.schema)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(entry);
  }

  return deduped;
}

function schemaSignature(schema: OpenApiSchema | undefined) {
  if (!schema) return "none";
  if (schema.$ref) return `ref:${schema.$ref}`;
  const type = Array.isArray(schema.type) ? schema.type.join("|") : (schema.type ?? inferSchemaType(schema));
  const propertyCount = Object.keys(schema.properties ?? {}).length;
  const enumCount = schema.enum?.length ?? 0;
  return `${type}|${schema.format ?? ""}|p:${propertyCount}|e:${enumCount}`;
}

function appendSchemaNode(
  lines: string[],
  schema: OpenApiSchema,
  depth: number,
  name: string,
  required: boolean,
  context: SchemaRenderContext
) {
  const indent = "  ".repeat(depth);
  const requiredSuffix = required ? "*" : "";
  const typeLabel = getSchemaTypeLabel(schema);
  const description = normalizeInlineText(schema.description);
  lines.push(`${indent}- \`${name}${requiredSuffix}\`: ${typeLabel}${description ? ` - ${description}` : ""}`);

  if (schema.enum && schema.enum.length > 0) {
    lines.push(`${indent}  - Enum: ${schema.enum.map(formatLiteral).join(", ")}`);
  }

  if (schema.$ref) {
    if (context.seenRefs.has(schema.$ref)) {
      lines.push(`${indent}  - Circular reference: \`${schema.$ref}\``);
      return;
    }
    context.seenRefs.add(schema.$ref);
  }

  if (context.seenObjects.has(schema)) return;
  context.seenObjects.add(schema);

  const properties = Object.entries(schema.properties ?? {});
  if (properties.length > 0) {
    const requiredSet = new Set(schema.required ?? []);
    lines.push(`${indent}  - Fields:`);
    for (const [propertyName, propertySchema] of properties.sort(([left], [right]) => left.localeCompare(right))) {
      if (!propertySchema) continue;
      appendSchemaNode(lines, propertySchema, depth + 2, propertyName, requiredSet.has(propertyName), context);
    }
  }

  if (schema.items) {
    lines.push(`${indent}  - Items:`);
    appendSchemaNode(lines, schema.items, depth + 2, "item", true, context);
  }

  if (schema.allOf && schema.allOf.length > 0) {
    lines.push(`${indent}  - All of:`);
    for (const [index, entry] of schema.allOf.entries()) {
      appendSchemaNode(lines, entry, depth + 2, `allOf[${index}]`, true, context);
    }
  }

  if (schema.oneOf && schema.oneOf.length > 0) {
    lines.push(`${indent}  - One of:`);
    for (const [index, entry] of schema.oneOf.entries()) {
      appendSchemaNode(lines, entry, depth + 2, `oneOf[${index}]`, true, context);
    }
  }

  if (schema.anyOf && schema.anyOf.length > 0) {
    lines.push(`${indent}  - Any of:`);
    for (const [index, entry] of schema.anyOf.entries()) {
      appendSchemaNode(lines, entry, depth + 2, `anyOf[${index}]`, true, context);
    }
  }

  if (typeof schema.additionalProperties === "object" && schema.additionalProperties !== null) {
    lines.push(`${indent}  - Additional properties:`);
    appendSchemaNode(lines, schema.additionalProperties, depth + 2, "<key>", true, context);
  } else if (schema.additionalProperties === true) {
    lines.push(`${indent}  - Additional properties: allowed`);
  }
}

function getSchemaTypeLabel(schema: OpenApiSchema) {
  if (schema.$ref) {
    const refName = schema.$ref.split("/").at(-1) ?? schema.$ref;
    return `ref<${refName}>`;
  }

  const rawType = Array.isArray(schema.type) ? schema.type.join("|") : schema.type;
  const type = rawType ?? inferSchemaType(schema);
  const format = schema.format ? ` (${schema.format})` : "";
  const nullable = schema.nullable ? " | null" : "";
  return `${type}${format}${nullable}`;
}

function inferSchemaType(schema: OpenApiSchema) {
  if (schema.properties) return "object";
  if (schema.items) return "array";
  if (schema.allOf) return "allOf";
  if (schema.oneOf) return "oneOf";
  if (schema.anyOf) return "anyOf";
  return "unknown";
}

function formatLiteral(value: unknown) {
  if (typeof value === "string") return `\`${value}\``;
  if (typeof value === "number" || typeof value === "boolean") return `\`${String(value)}\``;
  if (value === null) return "`null`";
  return `\`${JSON.stringify(value)}\``;
}

function normalizeInlineText(value: string | undefined) {
  if (!value) return "";
  return value
    .replace(/<br\s*\/?>/giu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}
