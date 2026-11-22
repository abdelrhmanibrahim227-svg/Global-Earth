
'use client'

import { Suspense, useMemo, useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import {
    Search,
    ArrowUpDown,
    PackageSearch,
    Layers,
    RefreshCw
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { setProduct } from '@/lib/features/product/productSlice'

// Extract products from different possible API response formats
function extractProducts(data) {
    if (Array.isArray(data)) return data

    const possibleLists = [
        data?.products,
        data?.data,
        data?.items,
        data?.results,
        data?.data?.products,
        data?.data?.items,
        data?.result?.products
    ]

    return possibleLists.find(Array.isArray) || []
}

function getProductId(product) {
    return String(product?.id ?? product?._id ?? '')
}

function getCategoryId(product) {
    const category = product?.category

    return String(
        product?.categoryId ??
        product?.category_id ??
        (typeof category === 'object'
            ? category?.id ?? category?._id
            : '') ??
        ''
    )
}

function getCategoryName(product) {
    const category = product?.category

    return String(
        typeof category === 'object'
            ? category?.name ?? category?.title ?? ''
            : category ?? ''
    ).toLowerCase()
}

function ShopContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const dispatch = useDispatch()

    const search = searchParams.get('search') || ''

    const products = useSelector(state => state.product?.list)
    const productList = Array.isArray(products) ? products : []

    const [sortOrder, setSortOrder] = useState('newest')
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [categoriesLoading, setCategoriesLoading] = useState(true)
    const [productsLoading, setProductsLoading] = useState(true)
    const [productsError, setProductsError] = useState('')
    const [retryCount, setRetryCount] = useState(0)

    // Load products
    useEffect(() => {
        let cancelled = false

        async function loadProducts() {
            setProductsLoading(true)
            setProductsError('')

            try {
                const response = await fetch('/api/products', {
                    method: 'GET',
                    cache: 'no-store',
                    credentials: 'include'
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                        data?.error ||
                        `Products API error: ${response.status}`
                    )
                }

                const loadedProducts = extractProducts(data)

                console.log('GLOBAL EARTH API RESPONSE:', data)
                console.log(
                    'GLOBAL EARTH PRODUCTS COUNT:',
                    loadedProducts.length
                )

                if (!cancelled) {
                    dispatch(setProduct(loadedProducts))
                }

                if (!loadedProducts.length) {
                    console.warn(
                        'No products were returned by /api/products'
                    )
                }

            } catch (error) {
                console.error('PRODUCTS LOADING ERROR:', error)

                if (!cancelled) {
                    setProductsError(
                        error.message || 'Unable to load products'
                    )
                }
            } finally {
                if (!cancelled) {
                    setProductsLoading(false)
                }
            }
        }

        loadProducts()

        return () => {
            cancelled = true
        }
    }, [dispatch, retryCount])

    // Load categories
    useEffect(() => {
        let cancelled = false

        async function loadCategories() {
            try {
                const response = await fetch('/api/categories', {
                    cache: 'no-store',
                    credentials: 'include'
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(
                        data?.message || 'Failed to load categories'
                    )
                }

                const loadedCategories = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.categories)
                        ? data.categories
                        : Array.isArray(data?.data)
                            ? data.data
                            : Array.isArray(data?.data?.categories)
                                ? data.data.categories
                                : []

                if (!cancelled) {
                    setCategories(loadedCategories)
                }

            } catch (error) {
                console.error('CATEGORIES ERROR:', error)
            } finally {
                if (!cancelled) {
                    setCategoriesLoading(false)
                }
            }
        }

        loadCategories()

        return () => {
            cancelled = true
        }
    }, [])

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        const selectedCategoryObject = categories.find(
            item => String(item?.id ?? item?._id) === String(selectedCategory)
        )

        const selectedCategoryName = String(
            selectedCategoryObject?.name || ''
        ).toLowerCase()

        const result = productList.filter(product => {
            const name = String(product?.name || '').toLowerCase()
            const description = String(
                product?.description || ''
            ).toLowerCase()

            const categoryName = getCategoryName(product)
            const productCategoryId = getCategoryId(product)

            const matchesSearch =
                !normalizedSearch ||
                name.includes(normalizedSearch) ||
                description.includes(normalizedSearch) ||
                categoryName.includes(normalizedSearch)

            const matchesCategory =
                selectedCategory === 'all' ||
                productCategoryId === String(selectedCategory) ||
                (
                    !productCategoryId &&
                    categoryName === selectedCategoryName
                )

            return matchesSearch && matchesCategory
        })

        return [...result].sort((a, b) => {
            if (sortOrder === 'price-low') {
                return Number(a?.price || 0) - Number(b?.price || 0)
            }

            if (sortOrder === 'price-high') {
                return Number(b?.price || 0) - Number(a?.price || 0)
            }

            if (sortOrder === 'name') {
                return String(a?.name || '').localeCompare(
                    String(b?.name || '')
                )
            }

            return (
                new Date(b?.createdAt || 0).getTime() -
                new Date(a?.createdAt || 0).getTime()
            )
        })
    }, [
        productList,
        search,
        sortOrder,
        selectedCategory,
        categories
    ])

    return (
        <main className="min-h-[70vh] bg-white px-4 sm:px-6">
            <div className="mx-auto max-w-7xl py-8 sm:py-12">

                {/* Page Heading */}
                <div className="mb-8 border-b border-slate-100 pb-6">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
                        GLOBAL EARTH
                    </p>

                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                        {search ? 'Search Results' : 'Explore Our Products'}
                    </h1>

                    <p className="mt-3 text-sm text-slate-500 sm:text-base">
                        Discover computers, laptops, smartphones, cameras,
                        printers and more.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="mb-7">
                    <div className="mb-3 flex items-center gap-2">
                        <Layers size={19} className="text-cyan-600" />

                        <h2 className="text-sm font-semibold text-slate-800">
                            Shop by Category
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory('all')}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                selectedCategory === 'all'
                                    ? 'border-cyan-500 bg-cyan-500 text-white'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-400 hover:text-cyan-600'
                            }`}
                        >
                            All Products
                        </button>

                        {categories.map(category => {
                            const categoryId = String(
                                category?.id ?? category?._id ?? ''
                            )

                            return (
                                <button
                                    key={categoryId}
                                    type="button"
                                    onClick={() => setSelectedCategory(categoryId)}
                                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                        selectedCategory === categoryId
                                            ? 'border-cyan-500 bg-cyan-500 text-white'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-400 hover:text-cyan-600'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            )
                        })}
                    </div>

                    {categoriesLoading && (
                        <p className="mt-2 text-xs text-slate-400">
                            Loading categories...
                        </p>
                    )}
                </div>

                {/* Search and Sorting */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <PackageSearch
                            size={19}
                            className="text-cyan-600"
                        />

                        <span>
                            Showing{' '}
                            <strong className="text-slate-900">
                                {filteredProducts.length}
                            </strong>
                            {' '}of {productList.length} products
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <ArrowUpDown
                            size={18}
                            className="text-cyan-600"
                        />

                        <label
                            htmlFor="product-sort"
                            className="text-sm text-slate-600"
                        >
                            Sort by:
                        </label>

                        <select
                            id="product-sort"
                            value={sortOrder}
                            onChange={event => setSortOrder(event.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-500"
                        >
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                </div>

                {/* Products */}
                {productsLoading ? (
                    <div className="mb-20 flex min-h-64 flex-col items-center justify-center text-slate-500">
                        <RefreshCw
                            size={32}
                            className="mb-4 animate-spin text-cyan-500"
                        />

                        <p>Loading GLOBAL EARTH products...</p>
                    </div>
                ) : productsError ? (
                    <div className="mb-20 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                        <p className="font-medium text-red-700">
                            {productsError}
                        </p>

                        <button
                            type="button"
                            onClick={() => setRetryCount(value => value + 1)}
                            className="mt-4 rounded-lg bg-slate-900 px-5 py-2 text-sm text-white"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="mb-20 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={getProductId(product)}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mb-20 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 text-center">
                        <Search
                            size={40}
                            className="mb-4 text-slate-300"
                        />

                        <h2 className="text-lg font-semibold text-slate-800">
                            No products found
                        </h2>

                        <p className="mt-2 max-w-md text-sm text-slate-500">
                            {search
                                ? `We couldn't find any products matching "${search}". Try another search.`
                                : 'Products will appear here when they become available.'}
                        </p>

                        {(search || selectedCategory !== 'all') && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedCategory('all')
                                    router.push('/shop')
                                }}
                                className="mt-5 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
                            >
                                View All Products
                            </button>
                        )}

                        {!search && selectedCategory === 'all' && (
                            <button
                                type="button"
                                onClick={() => setRetryCount(value => value + 1)}
                                className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                            >
                                Reload Products
                            </button>
                        )}
                    </div>
                )}
            </div>
        </main>
    )
}

export default function Shop() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-96 items-center justify-center text-slate-500">
                    Loading GLOBAL EARTH products...
                </div>
            }
        >
            <ShopContent />
        </Suspense>
    )
}