"use client"

import {ApiReferenceReact} from "@scalar/api-reference-react";
import './custom.css';

export default function Page() {
  return <div style={{
    height: '500px'
  }}>
    <ApiReferenceReact
      configuration={{
        baseServerURL: 'https://api.rixl.com',
        url: '/api.yaml',
        theme: 'default',
        darkMode: false,
        hideClientButton: true,
        documentDownloadType: "yaml",
        hideDarkModeToggle: true,
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
          const methodOrder = ['get', 'post', 'put', 'delete'];
          const methodComparison = methodOrder.indexOf(a.method) - methodOrder.indexOf(b.method);

          if (methodComparison !== 0) {
            return methodComparison;
          }

          // 3. Sort by Path alphabetically
          return a.path.localeCompare(b.path);
        }
      }}
    />
  </div>;
}