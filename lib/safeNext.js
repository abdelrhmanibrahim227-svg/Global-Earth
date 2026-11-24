// lib/safeNext.js
// Only allow redirects to paths inside this site (blocks open-redirect attacks).
export function safeNext(value, fallback = '/') {
    if (typeof value !== 'string') return fallback
    if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
        return fallback
    }
    return value
}
