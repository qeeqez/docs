import type {ReactNode} from "react";
import type {MediaAdapter} from "fumadocs-openapi/requests/media/adapter";
import type {ApiServer} from "@/lib/api-base-url";

export interface EncodedParameter {
  readonly value: string;
}

export interface EncodedParameterMultiple {
  readonly values: string[];
}

export interface EncodedRequestData {
  method: string;
  path: Record<string, EncodedParameter>;
  query: Record<string, EncodedParameterMultiple>;
  header: Record<string, EncodedParameter>;
  cookie: Record<string, EncodedParameter>;
  body?: unknown;
  bodyMediaType?: string;
}

export interface MethodWithPath {
  method?: string;
  operationId?: string;
  summary?: string;
  servers?: ApiServer[];
  requestBody?: RequestBodyLite;
  responses?: Record<string, ResponseObjectLite>;
}

export interface RequestBodyLite {
  required?: boolean;
  content?: Record<string, RequestMediaTypeLite>;
}

export interface RequestMediaTypeLite {
  example?: unknown;
  examples?: Record<string, RequestExampleLite>;
  schema?: SchemaLite;
}

export interface RequestExampleLite {
  summary?: string;
  description?: string;
  value?: unknown;
}

export interface ResponseObjectLite {
  description?: string;
  content?: Record<string, ResponseMediaTypeLite>;
}

export interface ResponseMediaTypeLite {
  example?: unknown;
  examples?: Record<string, ResponseExampleLite>;
  schema?: unknown;
}

export interface ResponseExampleLite {
  summary?: string;
  description?: string;
  value?: unknown;
}

export interface SchemaLite {
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

export interface RenderedSchemaProperty {
  name: string;
  schema: SchemaLite;
  required: boolean;
  description: ReactNode | null;
  children: RenderedSchemaProperty[];
}

export interface StaticOpenApiSchema {
  id: string;
  bundled: unknown;
  dereferenced: unknown;
}

export type RenderMarkdown = (markdown: string) => ReactNode;
export type RenderCodeBlock = (lang: string, code: string) => Promise<ReactNode>;

export interface OpenApiRenderContext {
  renderMarkdown: RenderMarkdown;
  renderCodeBlock: RenderCodeBlock;
  schema: unknown;
  mediaAdapters: Record<string, MediaAdapter>;
}

export interface ResponseTabExample {
  label?: string;
  description?: string;
  sample: unknown;
}

export interface ResponseTab {
  code: string;
  mediaType?: string;
  response: {description?: string};
  examples?: ResponseTabExample[];
}
