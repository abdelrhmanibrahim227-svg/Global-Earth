// lib/productUtils.js  (updated: Egyptian Pound everywhere, no .env needed)

export const CURRENCY = 'EGP'

export function formatPrice(value) {
    const number = Number(value || 0)
    const hasDecimals = Math.abs(number % 1) > 0

    return `${CURRENCY} ${number.toLocaleString('en-US', {
        minimumFractionDigits: hasDecimals ? 2 : 0,
        maximumFractionDigits: 2,
    })}`
}

// Normalizes images: strings, {url}, {src}, JSON strings or static imports
export function getImages(product) {
    let source = product?.images

    if (typeof source === 'string') {
        try {
            const parsed = JSON.parse(source)
            source = Array.isArray(parsed) ? parsed : [source]
        } catch {
            source = [source]
        }
    }

    const raw = Array.isArray(source)
        ? source
        : product?.image
            ? [product.image]
            : []

    return raw
        .map(img => {
            if (!img) return null
            if (typeof img === 'string') return img.trim() || null
            if (img.url) return img.url
            if (img.src) return img // static import object
            return null
        })
        .filter(Boolean)
}

export function getCategoryLabel(product) {
    const c = product?.category
    if (!c) return ''
    if (typeof c === 'string') return c
    return c.name || c.title || ''
}

export function getRating(product) {
    const r = product?.rating

    if (Array.isArray(r) && r.length > 0) {
        const total = r.reduce((sum, item) => sum + Number(item?.rating || 0), 0)
        return { average: total / r.length, count: r.length }
    }

    if (typeof r === 'number' && r > 0) {
        return { average: r, count: Number(product?.reviewsCount || 0) }
    }

    return { average: 0, count: 0 }
}

export function getDiscount(product) {
    const mrp = Number(product?.mrp || 0)
    const price = Number(product?.price || 0)
    if (mrp > price && price > 0) {
        return Math.round(((mrp - price) / mrp) * 100)
    }
    return 0
}

export function isInStock(product) {
    return product?.inStock !== false
}

export function isNew(product, days = 14) {
    if (!product?.createdAt) return false
    const age = Date.now() - new Date(product.createdAt).getTime()
    return age >= 0 && age < days * 24 * 60 * 60 * 1000
}
