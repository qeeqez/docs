import type {StaticOpenApiSchema} from "./types";

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

export function getCachedSchemaPromise(schema: StaticOpenApiSchema): Promise<CachedSchema> {
  const cached = schemaPromiseCache.get(schema.id);
  if (cached) return cached;

  const next = Promise.resolve(withRawRef(schema));
  schemaPromiseCache.set(schema.id, next);
  return next;
}

export function isStaticOpenApiSchema(document: unknown): document is StaticOpenApiSchema {
  if (typeof document !== "object" || document === null) return false;
  return "id" in document && "bundled" in document && "dereferenced" in document;
}
