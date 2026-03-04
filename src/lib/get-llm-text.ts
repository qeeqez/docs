import type {ApiPageProps, OperationItem, WebhookItem} from "fumadocs-openapi/ui";
import {openapiSource} from "fumadocs-openapi/server";
import {openapi} from "@/lib/openapi";
import {openApiPagesOptions} from "@/lib/openapi-pages";

interface LLMPage {
  url: string;
  data: {
    title: string;
    description?: string;
    type?: string;
    getText?: (format: "processed") => Promise<string>;
    getAPIPageProps?: () => Omit<ApiPageProps, "document">;
    getSchema?: () => {
      dereferenced?: {
        paths?: Record<string, Record<string, OpenApiOperation | undefined> | undefined>;
        webhooks?: Record<string, Record<string, OpenApiOperation | undefined> | undefined>;
      };
    };
  };
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

interface OpenApiOperation {
  operationId?: string;
  summary?: string;
  description?: string;
  parameters?: Array<{
    name?: string;
    in?: string;
    required?: boolean;
    description?: string;
  }>;
  requestBody?: {
    required?: boolean;
    description?: string;
    content?: Record<string, unknown>;
  };
  responses?: Record<string, {description?: string} | undefined>;
}

interface OpenApiPageData {
  title?: string;
  description?: string;
  getAPIPageProps?: () => Omit<ApiPageProps, "document">;
  getSchema?: () => {
    dereferenced?: {
      paths?: Record<string, Record<string, OpenApiOperation | undefined> | undefined>;
      webhooks?: Record<string, Record<string, OpenApiOperation | undefined> | undefined>;
    };
  };
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
    getSchema: () => {
      dereferenced?: {
        paths?: Record<string, Record<string, OpenApiOperation | undefined> | undefined>;
        webhooks?: Record<string, Record<string, OpenApiOperation | undefined> | undefined>;
      };
    };
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
      getSchema: () => {
        dereferenced?: {
          paths?: Record<string, Record<string, OpenApiOperation | undefined> | undefined>;
          webhooks?: Record<string, Record<string, OpenApiOperation | undefined> | undefined>;
        };
      };
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
      lines.push(...renderOperationSection(item, schema?.paths?.[item.path]?.[item.method]));
    }
  }

  if (props.webhooks?.length) {
    lines.push("## Webhooks", "");
    for (const item of props.webhooks) {
      lines.push(...renderWebhookSection(item, schema?.webhooks?.[item.name]?.[item.method]));
    }
  }

  if (!props.operations?.length && !props.webhooks?.length) {
    lines.push("No OpenAPI operations were found for this page.");
  }

  return `${lines.join("\n")}\n`;
}

function renderOperationSection(item: OperationItem, operation?: OpenApiOperation) {
  const method = item.method.toUpperCase();
  const title = operation?.summary || operation?.operationId || `${method} ${item.path}`;
  const lines = [`### ${title}`, "", `- Method: \`${method}\``, `- Path: \`${item.path}\``];
  appendOperationDetails(lines, operation);
  lines.push("");
  return lines;
}

function renderWebhookSection(item: WebhookItem, operation?: OpenApiOperation) {
  const method = item.method.toUpperCase();
  const title = operation?.summary || operation?.operationId || `${method} /${item.name}`;
  const lines = [`### ${title}`, "", `- Method: \`${method}\``, `- Webhook: \`/${item.name}\``];
  appendOperationDetails(lines, operation);
  lines.push("");
  return lines;
}

function appendOperationDetails(lines: string[], operation?: OpenApiOperation) {
  if (!operation) {
    lines.push("- Details: unavailable in schema snapshot.");
    return;
  }

  if (operation.description) {
    lines.push("", operation.description);
  }

  if (operation.parameters?.length) {
    lines.push("", "- Parameters:");
    for (const parameter of operation.parameters) {
      const name = parameter.name ?? "unknown";
      const location = parameter.in ?? "unknown";
      const required = parameter.required ? "required" : "optional";
      const description = parameter.description ? `: ${parameter.description}` : "";
      lines.push(`  - \`${name}\` (${location}, ${required})${description}`);
    }
  }

  if (operation.requestBody) {
    const contentTypes = operation.requestBody.content ? Object.keys(operation.requestBody.content) : [];
    lines.push("");
    lines.push(`- Request body: ${operation.requestBody.required ? "required" : "optional"}`);
    if (operation.requestBody.description) {
      lines.push(`  - ${operation.requestBody.description}`);
    }
    if (contentTypes.length > 0) {
      lines.push(`  - Content types: ${contentTypes.map((type) => `\`${type}\``).join(", ")}`);
    }
  }

  if (operation.responses && Object.keys(operation.responses).length > 0) {
    lines.push("", "- Responses:");
    for (const [status, response] of Object.entries(operation.responses)) {
      const description = response?.description?.trim();
      lines.push(`  - \`${status}\`${description ? `: ${description}` : ""}`);
    }
  }
}
