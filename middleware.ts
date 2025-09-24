import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import { i18n } from '@/lib/i18n';

export default createI18nMiddleware(i18n);

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|/public).*)'],
};