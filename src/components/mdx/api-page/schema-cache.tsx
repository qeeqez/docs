import type {StaticOpenApiSchema} from "./types";

interface CachedSchema extends StaticOpenApiSchema {
  getRawRef: (obj: object) => string | undefined;
}

const schemaCache = new Map<string, CachedSchema>();

function withRawRef(schema: StaticOpenApiSchema): CachedSchema {
  return {
    ...schema,
    getRawRef: () => undefined,
  };
}

export function getCachedSchema(schema: StaticOpenApiSchema): CachedSchema {
  const cached = schemaCache.get(schema.id);
  if (cached) return cached;

  const next = withRawRef(schema);
  schemaCache.set(schema.id, next);
  return next;
}

export function isStaticOpenApiSchema(document: unknown): document is StaticOpenApiSchema {
  if (typeof document !== "object" || document === null) return false;
  return "id" in document && "bundled" in document && "dereferenced" in document;
}
