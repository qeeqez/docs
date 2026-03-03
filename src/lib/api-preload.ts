export async function preloadAPIRuntime() {
  await Promise.all([import("@/lib/generated/openapi-schema.json"), import("@fumari/json-schema-ts")]);
}
