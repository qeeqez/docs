import {useEffect, useMemo, useState, type ComponentType} from "react";
import openapiDocument from "../../../api.json";

interface OperationRef {
  path: string;
  method: string;
}

interface APIPageProps {
  operations?: OperationRef[];
}

function filterOperations(document: Record<string, unknown>, operations?: OperationRef[]) {
  if (!operations || operations.length === 0) return document;

  const paths = (document.paths ?? {}) as Record<string, Record<string, unknown>>;
  const selectedPaths: Record<string, Record<string, unknown>> = {};

  for (const operation of operations) {
    const pathItem = paths[operation.path];
    if (!pathItem) continue;

    const method = operation.method.toLowerCase();
    const operationSchema = pathItem[method];
    if (!operationSchema) continue;

    if (!selectedPaths[operation.path]) selectedPaths[operation.path] = {};
    selectedPaths[operation.path][method] = operationSchema;
  }

  return {
    ...document,
    paths: selectedPaths,
  };
}

export function APIPage({operations}: APIPageProps) {
  const [ScalarApiReference, setScalarApiReference] = useState<ComponentType<{configuration: unknown}> | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    let active = true;
    setMounted(true);

    void import("@scalar/api-reference-react").then((mod) => {
      if (!active) return;
      const component = (mod as {ApiReferenceReact?: ComponentType<{configuration: unknown}>}).ApiReferenceReact;
      if (component) setScalarApiReference(() => component);
    });

    return () => {
      active = false;
    };
  }, []);

  const content = useMemo(() => filterOperations(openapiDocument as Record<string, unknown>, operations), [operations]);
  if (!mounted || !ScalarApiReference) return null;

  return (
    <div className="not-prose">
      <ScalarApiReference
        configuration={{
          baseServerURL: "https://api.rixl.com",
          content,
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
        }}
      />
    </div>
  );
}
