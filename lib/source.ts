import { docs, sdk } from '@/.source';
import { loader } from 'fumadocs-core/source';

export const docsSource = loader({
    baseUrl: '/docs',
    source: docs.toFumadocsSource()
});

export const sdkSource = loader({
    baseUrl: '/sdk',
    source: sdk.toFumadocsSource()
});

export const source = docsSource;