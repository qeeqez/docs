import "@tanstack/react-start/server-only";
import {createAPIPage} from "fumadocs-openapi/ui";
import {openapi} from "@/lib/openapi.server";
import {renderResponseTabs} from "@/components/mdx/api-page/render-response-tabs";
import {renderStaticExampleTabs} from "@/components/mdx/api-page/render-static-example-tabs";
import {renderStaticRequestBodySection} from "@/components/mdx/api-page/render-static-request-body";
import {renderStaticResponseSection} from "@/components/mdx/api-page/render-static-response-section";
import {findOperationPath} from "@/components/mdx/api-page/path-utils";
import {getCachedSchemaPromise, isStaticOpenApiSchema} from "@/components/mdx/api-page/schema-cache";
import type {MethodWithPath, OpenApiRenderContext, StaticOpenApiSchema} from "@/components/mdx/api-page/types";

const APIPageImpl = createAPIPage(openapi, {
  playground: {
    enabled: false,
  },
  showResponseSchema: false,
  content: {
    renderResponseTabs,
    async renderOperationLayout(slots, ctx, method) {
      const typedCtx = ctx as OpenApiRenderContext;
      const typedMethod = method as MethodWithPath;
      const path = findOperationPath(typedCtx, typedMethod, slots.header);
      const rail = path ? await renderStaticExampleTabs({path, method, ctx: typedCtx}) : slots.apiExample;
      const requestBody = await renderStaticRequestBodySection(typedMethod, typedCtx);
      const responses = await renderStaticResponseSection(typedMethod, typedCtx);

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

export function APIPage({
  document,
  ...props
}: Omit<Parameters<typeof APIPageImpl>[0], "document"> & {
  document: StaticOpenApiSchema | Promise<StaticOpenApiSchema>;
}) {
  const resolved = isStaticOpenApiSchema(document) ? getCachedSchemaPromise(document) : document;
  return <APIPageImpl {...props} document={resolved} />;
}
