'use client'

// Place at: app/product/[productId]/page.jsx

import ProductDescription from '@/components/ProductDescription'
import ProductDetails from '@/components/ProductDetails'
import ProductCard from '@/components/ProductCard'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProduct } from '@/lib/features/product/productSlice'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, PackageSearch } from 'lucide-react'
import { getCategoryLabel } from '@/lib/productUtils'

export default function Product() {
    const params = useParams()
    const dispatch = useDispatch()

    const productId = Array.isArray(params?.productId)
        ? params.productId[0]
        : params?.productId

    const products = useSelector(state => state.product?.list)
    const productList = useMemo(
        () => (Array.isArray(products) ? products : []),
        [products]
    )

    const reduxProduct = useMemo(
        () => productList.find(item => String(item.id) === String(productId)),
        [productList, productId]
    )

    const [apiProduct, setApiProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [fetchError, setFetchError] = useState(false)
    const [retryCount, setRetryCount] = useState(0)

    useEffect(() => {
        const controller = new AbortController()

        if (!productId) {
            setLoading(false)
            return
        }

        // Already in Redux: no network request needed
        if (reduxProduct) {
            setApiProduct(null)
            setFetchError(false)
            setLoading(false)
            return
        }

        const fetchProduct = async () => {
            setLoading(true)
            setFetchError(false)

            try {
                const response = await fetch('/api/products', {
                    signal: controller.signal,
                })

                if (!response.ok) {
                    throw new Error(`Products API failed: ${response.status}`)
                }

                const data = await response.json()

                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.products)
                        ? data.products
                        : Array.isArray(data?.data)
                            ? data.data
                            : []

                // Save in Redux so the cart page can access them too
                if (list.length > 0) dispatch(setProduct(list))

                setApiProduct(
                    list.find(item => String(item.id) === String(productId)) || null
                )
            } catch (error) {
                if (error.name === 'AbortError') return
                console.error('PRODUCT DETAILS FETCH ERROR:', error)
                setApiProduct(null)
                setFetchError(true)
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        fetchProduct()
        return () => controller.abort()
    }, [productId, reduxProduct, retryCount, dispatch])

    const product = reduxProduct || apiProduct
    const categoryLabel = product ? getCategoryLabel(product) : ''

    // Related products from the same category
    const related = useMemo(() => {
        if (!product) return []
        const sameCategory = productList.filter(
            p =>
                String(p.id) !== String(product.id) &&
                categoryLabel &&
                getCategoryLabel(p) === categoryLabel
        )
        const others = productList.filter(
            p =>
                String(p.id) !== String(product.id) &&
                !sameCategory.includes(p)
        )
        return [...sameCategory, ...others].slice(0, 4)
    }, [product, productList, categoryLabel])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [productId])

    return (
        <main className="min-h-[70vh] bg-white px-4 pb-24 sm:px-6 lg:pb-0">
            <div className="mx-auto max-w-7xl py-6 sm:py-8">
                {/* Breadcrumb */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-500"
                >
                    <Link href="/" className="transition hover:text-cyan-600">
                        Home
                    </Link>
                    <ChevronRight size={14} />
                    <Link href="/shop" className="transition hover:text-cyan-600">
                        Shop
                    </Link>
                    {categoryLabel && (
                        <>
                            <ChevronRight size={14} />
                            <span className="text-slate-700">{categoryLabel}</span>
                        </>
                    )}
                </nav>

                {loading ? (
                    <div className="grid animate-pulse gap-10 lg:grid-cols-2">
                        <div className="aspect-square rounded-3xl bg-slate-100" />
                        <div className="space-y-5">
                            <div className="h-4 w-24 rounded bg-slate-200" />
                            <div className="h-10 w-4/5 rounded bg-slate-200" />
                            <div className="h-28 rounded-3xl bg-slate-100" />
                            <div className="h-14 rounded-full bg-slate-200" />
                        </div>
                    </div>
                ) : product ? (
                    <>
                        <ProductDetails product={product} />

                        <div className="mt-12">
                            <ProductDescription product={product} />
                        </div>

                        {related.length > 0 && (
                            <section className="mt-16">
                                <div className="mb-6 flex items-end justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">
                                            Keep exploring
                                        </p>
                                        <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                                            You may also like
                                        </h2>
                                    </div>
                                    <Link
                                        href="/shop"
                                        className="text-sm font-semibold text-cyan-700 hover:underline"
                                    >
                                        View all
                                    </Link>
                                </div>

                                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                                    {related.map(item => (
                                        <ProductCard key={item.id} product={item} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-5 text-center">
                        <PackageSearch size={48} className="mb-4 text-cyan-600" />
                        <h1 className="text-xl font-bold text-slate-900">
                            Product not found
                        </h1>
                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                            {fetchError
                                ? 'Unable to load product details. Please try again.'
                                : 'This product may be unavailable or no longer exists.'}
                        </p>

                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setApiProduct(null)
                                    setRetryCount(v => v + 1)
                                }}
                                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                            >
                                Try Again
                            </button>
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                            >
                                <ArrowLeft size={17} />
                                Back to Shop
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
