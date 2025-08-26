import React from 'react';
import Layout from '@theme/Layout';
import { ApiReferenceReact } from '@scalar/api-reference-react';
import '@scalar/api-reference-react/style.css'

export default function ApiPage() {
    return (
        <Layout title="API Reference" description="API Documentation">
            <div>
                <ApiReferenceReact
                    configuration={{
                        url: '/api-specs/api.json',
                        theme: 'purple',
                    }}
                />
            </div>
        </Layout>
    );
}