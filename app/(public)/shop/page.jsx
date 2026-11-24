'use client'

// Place at: app/shop/page.jsx

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import {
    ArrowUpDown,
    RefreshCw,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { setProduct } from '@/lib/features/product/productSlice'
import { formatPrice, isInStock } from '@/lib/productUtils'

const PAGE_SIZE = 12

function extractProducts(data) {
    if (Array.isArray(data)) return data

    const possibleLists = [
        data?.products,
        data?.data,
        data?.items,
        data?.results,
        data?.data?.products,
        data?.data?.items,
        data?.result?.products,
    ]

    return possibleLists.find(Array.isArray) || []
}

function extractCategories(data) {
    const lists = [data, data?.categories, data?.data, data?.data?.categories]
    return lists.find(Array.isArray) || []
}

function getProductId(product) {
    return String(product?.id ?? product?._id ?? '')
}

function getCategoryId(product) {
    const category = product?.category
    return String(
        product?.categoryId ??
            product?.category_id ??
            (typeof category === 'object' ? category?.id ?? category?._id : '') ??
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

function matchesCategory(product, category) {
    const id = String(category?.id ?? category?._id ?? '')
    const productCategoryId = getCategoryId(product)
    if (productCategoryId) return productCategoryId === id
    return getCategoryName(product) === String(category?.name || '').toLowerCase()
}

const ProductSkeleton = () => (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-slate-200">
        <div className="aspect-square bg-slate-100" />
        <div className="space-y-3 p-5">
            <div className="h-3 w-1/3 rounded bg-slate-200" />
            <div className="h-4 w-4/5 rounded bg-slate-200" />
            <div className="h-5 w-1/2 rounded bg-slate-200" />
        </div>
    </div>
)

function ShopContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const dispatch = useDispatch()

    const search = searchParams.get('search') || ''

    const products = useSelector(state => state.product?.list)
    const productList = useMemo(
        () => (Array.isArray(products) ? products : []),
        [products]
    )

    const [searchInput, setSearchInput] = useState(search)
    const [sortOrder, setSortOrder] = useState('newest')
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [onlyInStock, setOnlyInStock] = useState(false)
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

    const [categoriesLoading, setCategoriesLoading] = useState(true)
    const [productsLoading, setProductsLoading] = useState(true)
    const [productsError, setProductsError] = useState('')
    const [retryCount, setRetryCount] = useState(0)

    useEffect(() => setSearchInput(search), [search])

    // Load products
    useEffect(() => {
        const controller = new AbortController()

        async function loadProducts() {
            setProductsLoading(true)
            setProductsError('')

            try {
                const response = await fetch('/api/products', {
                    credentials: 'include',
                    signal: controller.signal,
                })
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                            data?.error ||
                            `Products API error: ${response.status}`
                    )
                }

                dispatch(setProduct(extractProducts(data)))
            } catch (error) {
                if (error.name === 'AbortError') return
                console.error('PRODUCTS LOADING ERROR:', error)
                setProductsError(error.message || 'Unable to load products')
            } finally {
                if (!controller.signal.aborted) setProductsLoading(false)
            }
        }

        loadProducts()
        return () => controller.abort()
    }, [dispatch, retryCount])

    // Load categories
    useEffect(() => {
        const controller = new AbortController()

        async function loadCategories() {
            try {
                const response = await fetch('/api/categories', {
                    credentials: 'include',
                    signal: controller.signal,
                })
                const data = await response.json()
                if (!response.ok) throw new Error('Failed to load categories')
                setCategories(extractCategories(data))
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('CATEGORIES ERROR:', error)
                }
            } finally {
                if (!controller.signal.aborted) setCategoriesLoading(false)
            }
        }

        loadCategories()
        return () => controller.abort()
    }, [])

    // Reset pagination when filters change
    useEffect(() => {
        setVisibleCount(PAGE_SIZE)
    }, [search, selectedCategory, minPrice, maxPrice, onlyInStock, sortOrder])

    const filteredProducts = useMemo(() => {
        const q = search.trim().toLowerCase()
        const min = minPrice === '' ? null : Number(minPrice)
        const max = maxPrice === '' ? null : Number(maxPrice)

        const selectedCategoryObject = categories.find(
            item => String(item?.id ?? item?._id) === String(selectedCategory)
        )

        const result = productList.filter(product => {
            const price = Number(product?.price || 0)

            const matchesSearch =
                !q ||
                String(product?.name || '').toLowerCase().includes(q) ||
                String(product?.description || '').toLowerCase().includes(q) ||
                getCategoryName(product).includes(q)

            const categoryOk =
                selectedCategory === 'all' ||
                (selectedCategoryObject &&
                    matchesCategory(product, selectedCategoryObject))

            const priceOk =
                (min === null || price >= min) && (max === null || price <= max)

            const stockOk = !onlyInStock || isInStock(product)

            return matchesSearch && categoryOk && priceOk && stockOk
        })

        return result.sort((a, b) => {
            if (sortOrder === 'price-low') return Number(a?.price || 0) - Number(b?.price || 0)
            if (sortOrder === 'price-high') return Number(b?.price || 0) - Number(a?.price || 0)
            if (sortOrder === 'name') return String(a?.name || '').localeCompare(String(b?.name || ''))
            return (
                new Date(b?.createdAt || 0).getTime() -
                new Date(a?.createdAt || 0).getTime()
            )
        })
    }, [productList, search, sortOrder, selectedCategory, categories, minPrice, maxPrice, onlyInStock])

    const categoryCounts = useMemo(() => {
        const map = {}
        for (const c of categories) {
            const id = String(c?.id ?? c?._id ?? '')
            map[id] = productList.filter(p => matchesCategory(p, c)).length
        }
        return map
    }, [categories, productList])

    const visibleProducts = filteredProducts.slice(0, visibleCount)
    const activeCategory = categories.find(
        c => String(c?.id ?? c?._id) === String(selectedCategory)
    )

    const hasFilters =
        selectedCategory !== 'all' ||
        minPrice !== '' ||
        maxPrice !== '' ||
        onlyInStock ||
        !!search

    const resetFilters = () => {
        setSelectedCategory('all')
        setMinPrice('')
        setMaxPrice('')
        setOnlyInStock(false)
        if (search) router.push('/shop')
    }

    const submitSearch = e => {
        e.preventDefault()
        const value = searchInput.trim()
        router.push(value ? `/shop?search=${encodeURIComponent(value)}` : '/shop')
    }

    const FilterPanel = (
        <div className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-900">
                    Categories
                </h3>
                <ul className="space-y-1">
                    <li>
                        <button
                            type="button"
                            onClick={() => setSelectedCategory('all')}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                                selectedCategory === 'all'
                                    ? 'bg-[#030a12] font-semibold text-cyan-300'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            All Products
                            <span className="text-xs opacity-70">{productList.length}</span>
                        </button>
                    </li>
                    {categories.map(category => {
                        const id = String(category?.id ?? category?._id ?? '')
                        return (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory(id)}
                                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                                        selectedCategory === id
                                            ? 'bg-[#030a12] font-semibold text-cyan-300'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {category.name}
                                    <span className="text-xs opacity-70">
                                        {categoryCounts[id] ?? 0}
                                    </span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
                {categoriesLoading && (
                    <p className="mt-2 text-xs text-slate-400">Loading categories...</p>
                )}
            </div>

            {/* Price */}
            <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-900">
                    Price Range
                </h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min="0"
                        inputMode="numeric"
                        placeholder="Min"
                        value={minPrice}
                        onChange={e => setMinPrice(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                        type="number"
                        min="0"
                        inputMode="numeric"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-500"
                    />
                </div>
            </div>

            {/* Availability */}
            <label className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                In stock only
                <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={e => setOnlyInStock(e.target.checked)}
                    className="h-5 w-5 accent-cyan-500"
                />
            </label>

            {hasFilters && (
                <button
                    type="button"
                    onClick={resetFilters}
                    className="w-full rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                    Clear all filters
                </button>
            )}
        </div>
    )

    return (
        <main className="min-h-[70vh] bg-white">
            {/* ===== Header band ===== */}
            <section className="relative overflow-hidden bg-[#030a12] px-4 py-10 text-white sm:px-6 sm:py-14">
                <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/25 blur-[100px]" />
                <div className="pointer-events-none absolute -bottom-32 right-10 h-72 w-72 rounded-full bg-sky-600/20 blur-[100px]" />

                <div className="relative mx-auto max-w-7xl">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                        GLOBAL EARTH
                    </p>
                    <h1 className="mt-3 text-3xl font-extrabold sm:text-5xl">
                        {search ? `Results for "${search}"` : 'Explore Our Products'}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                        Laptops, smartphones, cameras, printers and accessories -
                        original products at the best prices.
                    </p>

                    <form
                        onSubmit={submitSearch}
                        className="mt-7 flex max-w-2xl items-center gap-2 rounded-full bg-white p-1.5 shadow-xl shadow-cyan-950/40"
                    >
                        <Search size={20} className="ml-4 shrink-0 text-slate-400" />
                        <input
                            type="search"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            placeholder="Search for products, brands and categories"
                            className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                        <button
                            type="submit"
                            className="rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
                <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
                    {/* Desktop filters */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 rounded-3xl border border-slate-200 p-5">
                            {FilterPanel}
                        </div>
                    </aside>

                    <div>
                        {/* Toolbar */}
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-slate-500">
                                <strong className="text-slate-900">
                                    {filteredProducts.length}
                                </strong>{' '}
                                of {productList.length} products
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFiltersOpen(true)}
                                    className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 lg:hidden"
                                >
                                    <SlidersHorizontal size={16} />
                                    Filters
                                </button>

                                <div className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2">
                                    <ArrowUpDown size={16} className="text-cyan-600" />
                                    <label htmlFor="product-sort" className="sr-only">
                                        Sort by
                                    </label>
                                    <select
                                        id="product-sort"
                                        value={sortOrder}
                                        onChange={e => setSortOrder(e.target.value)}
                                        className="bg-transparent text-sm font-medium text-slate-700 outline-none"
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="name">Name (A-Z)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Active chips */}
                        {hasFilters && (
                            <div className="mb-5 flex flex-wrap gap-2">
                                {activeCategory && (
                                    <Chip onClear={() => setSelectedCategory('all')}>
                                        {activeCategory.name}
                                    </Chip>
                                )}
                                {minPrice !== '' && (
                                    <Chip onClear={() => setMinPrice('')}>
                                        From {formatPrice(minPrice)}
                                    </Chip>
                                )}
                                {maxPrice !== '' && (
                                    <Chip onClear={() => setMaxPrice('')}>
                                        Up to {formatPrice(maxPrice)}
                                    </Chip>
                                )}
                                {onlyInStock && (
                                    <Chip onClear={() => setOnlyInStock(false)}>In stock</Chip>
                                )}
                                {search && (
                                    <Chip onClear={() => router.push('/shop')}>
                                        &quot;{search}&quot;
                                    </Chip>
                                )}
                            </div>
                        )}

                        {/* Products */}
                        {productsLoading ? (
                            <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : productsError ? (
                            <div className="mb-20 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
                                <p className="font-medium text-red-700">{productsError}</p>
                                <button
                                    type="button"
                                    onClick={() => setRetryCount(v => v + 1)}
                                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-sm text-white"
                                >
                                    <RefreshCw size={15} />
                                    Try Again
                                </button>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
                                    {visibleProducts.map(product => (
                                        <ProductCard
                                            key={getProductId(product)}
                                            product={product}
                                        />
                                    ))}
                                </div>

                                {visibleCount < filteredProducts.length && (
                                    <div className="mt-10 text-center">
                                        <button
                                            type="button"
                                            onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                                            className="rounded-full bg-[#030a12] px-10 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
                                        >
                                            Show more (
                                            {filteredProducts.length - visibleCount} left)
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 text-center">
                                <Search size={40} className="mb-4 text-slate-300" />
                                <h2 className="text-lg font-semibold text-slate-800">
                                    No products found
                                </h2>
                                <p className="mt-2 max-w-md text-sm text-slate-500">
                                    {hasFilters
                                        ? 'Try changing or clearing your filters.'
                                        : 'Products will appear here when they become available.'}
                                </p>
                                <button
                                    type="button"
                                    onClick={hasFilters ? resetFilters : () => setRetryCount(v => v + 1)}
                                    className="mt-5 rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                                >
                                    {hasFilters ? 'Clear filters' : 'Reload products'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile filter drawer */}
            {filtersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setFiltersOpen(false)}
                    />
                    <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 p-4">
                            <h2 className="font-bold text-slate-900">Filters</h2>
                            <button
                                type="button"
                                aria-label="Close filters"
                                onClick={() => setFiltersOpen(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">{FilterPanel}</div>
                        <div className="border-t border-slate-200 p-4">
                            <button
                                type="button"
                                onClick={() => setFiltersOpen(false)}
                                className="w-full rounded-full bg-cyan-400 py-3 text-sm font-bold text-slate-950"
                            >
                                Show {filteredProducts.length} products
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

const Chip = ({ children, onClear }) => (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800">
        {children}
        <button
            type="button"
            onClick={onClear}
            aria-label="Remove filter"
            className="rounded-full hover:bg-cyan-200"
        >
            <X size={14} />
        </button>
    </span>
)

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
