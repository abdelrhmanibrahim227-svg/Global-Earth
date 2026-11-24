'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Title from './Title'
import ProductCard from './ProductCard'

const DISPLAY_QUANTITY = 8

// Works out a stable category key for a product, whatever shape the API returns
const getCategoryKey = product => {
    const category =
        product.category?.name ||
        product.category?.title ||
        product.categoryName ||
        (typeof product.category === 'string' ? product.category : null) ||
        product.categoryId ||
        'uncategorized'

    return String(category).trim().toLowerCase()
}

const ProductSkeleton = () => (
    <div className="animate-pulse">
        <div className="aspect-square rounded-2xl bg-slate-200" />
        <div className="mt-3 h-4 w-3/4 rounded bg-slate-200" />
        <div className="mt-2 h-4 w-1/3 rounded bg-slate-200" />
    </div>
)

const LatestProducts = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const controller = new AbortController()

        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products', {
                    signal: controller.signal,
                })

                if (!response.ok) {
                    throw new Error(`Products API failed: ${response.status}`)
                }

                const data = await response.json()

                const productList = Array.isArray(data)
                    ? data
                    : Array.isArray(data.products)
                        ? data.products
                        : []

                setProducts(productList)
                setError(false)
            } catch (err) {
                if (err.name === 'AbortError') return
                console.error('LATEST PRODUCTS ERROR:', err)
                setProducts([])
                setError(true)
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        fetchProducts()

        return () => controller.abort()
    }, [])

    const featuredProducts = useMemo(() => {
        const sorted = [...products].sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )

        const selected = []
        const usedIds = new Set()
        const usedCategories = new Set()

        // One product per category first, for variety
        for (const product of sorted) {
            const categoryKey = getCategoryKey(product)

            if (usedCategories.has(categoryKey)) continue
            if (usedIds.has(product.id)) continue

            selected.push(product)
            usedIds.add(product.id)
            usedCategories.add(categoryKey)

            if (selected.length >= DISPLAY_QUANTITY) break
        }

        // Fill the rest with the newest products
        for (const product of sorted) {
            if (selected.length >= DISPLAY_QUANTITY) break
            if (usedIds.has(product.id)) continue

            selected.push(product)
            usedIds.add(product.id)
        }

        return selected
    }, [products])

    return (
        <section className="mx-auto my-20 w-full max-w-7xl px-4 sm:px-6">
            <Title
                title="Featured Products"
                description={
                    loading
                        ? 'Discover our latest arrivals'
                        : `Handpicked from ${products.length} products`
                }
                href="/shop"
            />

            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {loading &&
                    Array.from({ length: DISPLAY_QUANTITY }).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))}

                {!loading &&
                    featuredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
            </div>

            {!loading && error && (
                <div className="py-12 text-center text-amber-600">
                    Unable to load products. Please try again later.
                </div>
            )}

            {!loading && !error && featuredProducts.length === 0 && (
                <div className="py-12 text-center text-slate-500">
                    No products available yet.
                </div>
            )}
        </section>
    )
}

export default LatestProducts
