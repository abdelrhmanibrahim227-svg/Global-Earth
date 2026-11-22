
'use client'

import ProductDescription from '@/components/ProductDescription'
import ProductDetails from '@/components/ProductDetails'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProduct } from '@/lib/features/product/productSlice'
import Link from 'next/link'
import { ArrowLeft, PackageSearch } from 'lucide-react'

export default function Product() {
    const params = useParams()
    const dispatch = useDispatch()

    const productId = Array.isArray(params?.productId)
        ? params.productId[0]
        : params?.productId

    const products = useSelector(state => state.product?.list)
    const productList = Array.isArray(products) ? products : []

    const reduxProduct = useMemo(
        () => productList.find(
            item => String(item.id) === String(productId)
        ),
        [productList, productId]
    )

    const [apiProduct, setApiProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [fetchError, setFetchError] = useState(false)
    const [retryCount, setRetryCount] = useState(0)

    useEffect(() => {
        let active = true

        if (!productId) {
            setLoading(false)
            return
        }

        // إذا كان المنتج موجودًا بالفعل في Redux
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
                    cache: 'no-store',
                })

                if (!response.ok) {
                    throw new Error(
                        `Products API failed: ${response.status}`
                    )
                }

                const data = await response.json()

                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.products)
                        ? data.products
                        : Array.isArray(data?.data)
                            ? data.data
                            : []

                const found = list.find(
                    item => String(item.id) === String(productId)
                )

                if (active) {
                    // حفظ المنتجات في Redux حتى تتمكن صفحة السلة من الوصول إليها
                    if (list.length > 0) {
                        dispatch(setProduct(list))
                    }

                    setApiProduct(found || null)
                    setFetchError(false)
                }

            } catch (error) {
                console.error('PRODUCT DETAILS FETCH ERROR:', error)

                if (active) {
                    setApiProduct(null)
                    setFetchError(true)
                }

            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        fetchProduct()

        return () => {
            active = false
        }
    }, [productId, reduxProduct, retryCount, dispatch])

    const product = reduxProduct || apiProduct

    // تحديث موضع الصفحة عند الانتقال بين المنتجات
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [productId])

    return (
        <main className="min-h-[70vh] bg-white px-4 sm:px-6">
            <div className="mx-auto max-w-7xl py-6 sm:py-8">

                {/* Breadcrumb */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500"
                >
                    <Link
                        href="/"
                        className="transition hover:text-cyan-600"
                    >
                        Home
                    </Link>

                    <span>/</span>

                    <Link
                        href="/shop"
                        className="transition hover:text-cyan-600"
                    >
                        Products
                    </Link>

                    {product?.category && (
                        <>
                            <span>/</span>

                            <span className="text-slate-700">
                                {typeof product.category === 'string'
                                    ? product.category
                                    : product.category.name ||
                                      product.category.title}
                            </span>
                        </>
                    )}
                </nav>

                {/* Loading */}
                {loading ? (
                    <div className="flex min-h-80 flex-col items-center justify-center text-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />

                        <p className="mt-4 text-sm text-slate-500">
                            Loading product details...
                        </p>
                    </div>

                ) : product ? (

                    /* Product Details */
                    <>
                        <ProductDetails product={product} />

                        <div className="mt-10">
                            <ProductDescription product={product} />
                        </div>
                    </>

                ) : (

                    /* Product Not Found */
                    <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 text-center">

                        <PackageSearch
                            size={48}
                            className="mb-4 text-cyan-600"
                        />

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
                                    setRetryCount(value => value + 1)
                                }}
                                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                            >
                                Try Again
                            </button>

                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
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