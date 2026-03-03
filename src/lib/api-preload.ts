import {preloadApiSchema} from "@/components/mdx/api-page";

let apiRuntimePromise: Promise<void> | undefined;

export async function preloadAPIRuntime() {
  apiRuntimePromise ??= Promise.all([preloadApiSchema(), import("@fumari/json-schema-ts")]).then(() => undefined);
  await apiRuntimePromise;
}
