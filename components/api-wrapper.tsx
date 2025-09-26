"use client";

import dynamic from "next/dynamic";
import apiJson from "@/api.json";

const ApiReferenceReact = dynamic(
  () => import("@scalar/api-reference-react")
    .then((mod) => mod.ApiReferenceReact || mod.ApiReferenceReact || mod),
  {ssr: true}
);

export function ApiWrapper() {
  return <div className="relative">
    <ApiReferenceReact
      configuration={{
        baseServerURL: "https://api.rixl.com",
        content: apiJson,
        theme: "default",
        darkMode: false,
        hideClientButton: true,
        documentDownloadType: "yaml",
        hideDarkModeToggle: true,

        defaultHttpClient: {
          targetKey: "js",
          clientKey: "fetch",
        },
        authentication: {
          preferredSecurityScheme: "ApiKeyAuth",

          securitySchemes: {
            ApiKeyAuth: {
              type: "apiKey",
              in: "header",
              name: "X-API-Key",
              description: "API key for protected endpoints",
            },
          },
        },

        operationsSorter: (a, b) => {
          // 1. Sort by x-order if present
          if (a.operation && b.operation) {
            const aOrder = a.operation["x-order"];
            const bOrder = b.operation["x-order"];

            if (aOrder !== undefined && bOrder === undefined) {
              return -1; // a comes first
            }
            if (aOrder === undefined && bOrder !== undefined) {
              return 1; // b comes first
            }
            if (aOrder !== undefined && bOrder !== undefined) {
              if (aOrder !== bOrder) {
                return aOrder - bOrder;
              }
            }
          }

          // 2. Sort by HTTP method
          const methodOrder = ["get", "post", "put", "delete"];
          const methodComparison = methodOrder.indexOf(a.method) - methodOrder.indexOf(b.method);

          if (methodComparison !== 0) {
            return methodComparison;
          }

          // 3. Sort by Path alphabetically
          return a.path.localeCompare(b.path);
        },
      }}
    />
  </div>
}