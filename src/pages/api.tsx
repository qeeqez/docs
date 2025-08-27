import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { ApiReferenceReact } from '@scalar/api-reference-react';

export default function ApiPage() {
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
            link.href = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest/style.css';

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
                <div style={{ padding: '2rem', textAlign: 'center' }}>
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
                        url: '/api-specs/api.json',
                        theme: 'default'
                    }}
                />
            </div>
        </Layout>
    );
}