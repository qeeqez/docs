import {createOpenAPI} from "fumadocs-openapi/server";
import apiDocument from "../../api.json";
import {API_BASE_URL} from "./api-base-url";

const OPENAPI_DOCUMENT_ID = "./api.json";

export const openapi = createOpenAPI({
  input: () => ({
    [OPENAPI_DOCUMENT_ID]: withDefaultApiHost(apiDocument as Record<string, unknown>),
  }),
});

function withDefaultApiHost(document: Record<string, unknown>) {
  const parsed = new URL(API_BASE_URL);

  if (typeof document.swagger === "string") {
    return {
      ...document,
      host: typeof document.host === "string" && document.host.length > 0 ? document.host : parsed.host,
      schemes: ["https"],
      basePath: typeof document.basePath === "string" && document.basePath.length > 0 ? document.basePath : "/",
    };
  }

  if (typeof document.openapi === "string") {
    const existingServers = Array.isArray(document.servers)
      ? document.servers
          .map((server) => {
            if (!server || typeof server !== "object") return;
            const record = server as Record<string, unknown>;
            const url = typeof record.url === "string" ? record.url.replace(/^http:\/\//u, "https://") : undefined;
            return {
              ...record,
              ...(url ? {url} : {}),
            };
          })
          .filter(Boolean)
      : [];
    return {
      ...document,
      servers: existingServers.length > 0 ? existingServers : [{url: API_BASE_URL}],
    };
  }

  return document;
}
