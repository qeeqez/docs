import React, {useEffect, useState} from 'react';
import Layout from '@theme/Layout';
import {ApiReferenceReact} from '@scalar/api-reference-react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import './custom.css';

export default function ApiPage() {
  const specUrl = useBaseUrl('/api-specs/api.yaml');
  const [isClient, setIsClient] = useState(false);
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Manually load Scalar CSS
    const loadScalarCSS = () => {
      // Check if CSS is already loaded
      const existingLink = document.querySelector('link[href*="scalar"]');
      if (existingLink) {
        setCssLoaded(true);
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.34.6/style.css';
      link.integrity = 'sha256-BFsdpd9mmRZmXLAEonVvJk3jmjhe8arXO5IPRwBdYnU=%';
      link.crossOrigin = 'anonymous';
      link.referrerPolicy = 'no-referrer';

      link.onload = () => setCssLoaded(true);
      link.onerror = () => {
        console.error('Failed to load Scalar CSS');
        setCssLoaded(true); // Still render even if CSS fails
      };

      document.head.appendChild(link);

      // Cleanup function
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    };

    const cleanup = loadScalarCSS();

    return cleanup;
  }, []);

  // Don't render until we're on the client and CSS is ready
  if (!isClient || !cssLoaded) {
    return (
      <Layout title="API Reference" description="API Documentation">
        <div style={{padding: '2rem', textAlign: 'center'}}>
          <div>Loading API Reference...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="API Reference" description="API Documentation">
      <div>
        <ApiReferenceReact
          configuration={{
            baseServerURL: 'https://api.rixl.com',
            url: specUrl,
            theme: 'default',
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
      </div>
    </Layout>
  );
}