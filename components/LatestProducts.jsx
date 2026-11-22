
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Title from './Title'
import ProductCard from './ProductCard'

const DISPLAY_QUANTITY = 8

const LatestProducts = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        let isMounted = true

        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products', {
                    cache: 'no-store'
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

                if (isMounted) {
                    setProducts(productList)
                    setError(false)
                }
            } catch (err) {
                console.error('LATEST PRODUCTS ERROR:', err)

                if (isMounted) {
                    setProducts([])
                    setError(true)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchProducts()

        return () => {
            isMounted = false
        }
    }, [])

    const featuredProducts = useMemo(() => {
        const sorted = [...products].sort(
            (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        )

        const selected = []
        const usedIds = new Set()
        const usedCategories = new Set()

        // اختيار منتج واحد من كل فئة أولاً
        for (const product of sorted) {
            const category =
                product.category?.name ||
                product.category?.title ||
                product.categoryName ||
                (typeof product.category === 'string'
                    ? product.category
                    : null) ||
                product.categoryId ||
                'uncategorized'

            const categoryKey = String(category).trim().toLowerCase()

            if (usedCategories.has(categoryKey)) continue
            if (usedIds.has(product.id)) continue

            selected.push(product)
            usedIds.add(product.id)
            usedCategories.add(categoryKey)

            if (selected.length >= DISPLAY_QUANTITY) break
        }

        // استكمال العدد بأحدث المنتجات دون تكرار
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
                        ? 'Discover our products'
                        : `Showing ${featuredProducts.length} of ${products.length} products`
                }
                href="/shop"
            />

            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {featuredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
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

            {loading && (
                <div className="py-12 text-center text-slate-500">
                    Loading products...
                </div>
            )}
        </section>
    )
}

export default LatestProducts
