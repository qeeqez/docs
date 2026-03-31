import {CodeBlockTabsList, CodeBlockTabsTrigger} from "fumadocs-ui/components/codeblock";
import {Tab, Tabs} from "fumadocs-ui/components/tabs";
// @ts-expect-error -- runtime export exists but not in .d.ts
import {ResponseTabs} from "../../../../node_modules/fumadocs-openapi/dist/ui/operation/response-tabs.js";
// @ts-expect-error -- runtime export exists but not in .d.ts
import {getExampleRequests} from "../../../../node_modules/fumadocs-openapi/dist/ui/operation/get-example-requests.js";
import type {CodeUsageGenerator} from "fumadocs-openapi/requests/generators";
import {csharp} from "fumadocs-openapi/requests/generators/csharp";
import {curl} from "fumadocs-openapi/requests/generators/curl";
import {go} from "fumadocs-openapi/requests/generators/go";
import {java} from "fumadocs-openapi/requests/generators/java";
import {javascript} from "fumadocs-openapi/requests/generators/javascript";
import {python} from "fumadocs-openapi/requests/generators/python";
import type {ReactNode} from "react";
import {joinApiUrl, resolveOpenApiBaseUrl} from "@/lib/api-base-url";
import type {ApiServerRoot} from "@/lib/api-base-url";
import type {EncodedRequestData, MethodWithPath, OpenApiRenderContext} from "./types";
import {resolveRequestPath} from "./path-utils";

const requestCodeGenerators: CodeUsageGenerator[] = [curl, javascript, go, python, java, csharp];

type RequestTabItem = {
  id: string;
  label: string;
  lang: string;
  code: string;
};

type HighlightedTabItem = RequestTabItem & {
  node: ReactNode;
};

function resolveGeneratorId(generator: CodeUsageGenerator): string {
  if (generator === javascript) return "js";
  if (generator.lang === "bash") return "curl";
  return generator.lang;
}

function buildRequestItems(requestUrl: string, encoded: EncodedRequestData, ctx: OpenApiRenderContext): RequestTabItem[] {
  return requestCodeGenerators.map((generator) => ({
    id: resolveGeneratorId(generator),
    label: generator.label ?? generator.lang,
    lang: generator.lang,
    code: generator.generate(requestUrl, encoded, {
      mediaAdapters: ctx.mediaAdapters,
      server: null,
    }),
  }));
}

async function highlightRequestItems(items: RequestTabItem[], ctx: OpenApiRenderContext): Promise<HighlightedTabItem[]> {
  return Promise.all(
    items.map(async (item) => ({
      ...item,
      node: await ctx.renderCodeBlock(item.lang, item.code),
    }))
  );
}

function RequestTabs({items}: {items: HighlightedTabItem[]}) {
  return (
    <Tabs groupId="fumadocs_openapi_requests" defaultValue={items[0]?.id} className="bg-fd-card rounded-xl border my-4 overflow-hidden">
      <CodeBlockTabsList>
        {items.map((item) => (
          <CodeBlockTabsTrigger key={item.id} value={item.id}>
            {item.label}
          </CodeBlockTabsTrigger>
        ))}
      </CodeBlockTabsList>

      {items.map((item) => (
        <Tab
          key={item.id}
          value={item.id}
          className="p-0 bg-transparent rounded-none outline-none data-[state=inactive]:hidden [&>figure:only-child]:m-0 [&>figure:only-child]:rounded-none [&>figure:only-child]:border-0 [&>figure:only-child]:shadow-none"
        >
          {item.node}
        </Tab>
      ))}
    </Tabs>
  );
}

type RequestUrlInput = {
  path: string;
  method: MethodWithPath;
  ctx: OpenApiRenderContext;
  encoded: EncodedRequestData;
};

function resolveRequestUrl({path, method, ctx, encoded}: RequestUrlInput): string {
  const rootSchema = (ctx.schema as {dereferenced?: unknown}).dereferenced as ApiServerRoot | undefined;
  return joinApiUrl(resolveOpenApiBaseUrl(rootSchema, method.servers), resolveRequestPath(path, encoded));
}

export async function renderStaticExampleTabs({
  path,
  method,
  ctx,
}: {
  path: string;
  method: Parameters<typeof getExampleRequests>[1];
  ctx: OpenApiRenderContext;
}) {
  const [firstExample] = getExampleRequests(path, method, ctx);
  if (!firstExample) return <ResponseTabs operation={method} ctx={ctx} />;

  const encoded = firstExample.encoded as EncodedRequestData;
  const requestUrl = resolveRequestUrl({path, method: method as MethodWithPath, ctx, encoded});
  const items = buildRequestItems(requestUrl, encoded, ctx);
  const highlightedItems = await highlightRequestItems(items, ctx);

  return (
    <div className="prose-no-margin">
      <RequestTabs items={highlightedItems} />
      <ResponseTabs operation={method} ctx={ctx} />
    </div>
  );
}
