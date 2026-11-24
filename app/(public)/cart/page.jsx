'use client'

// app/cart/page.jsx
import Counter from '@/components/Counter'
import OrderSummary from '@/components/OrderSummary'
import ProductImage from '@/components/ProductImage'
import { clearCart, deleteItemFromCart } from '@/lib/features/cart/cartSlice'
import { formatPrice, getCategoryLabel, getImages } from '@/lib/productUtils'
import { ArrowLeft, ShoppingCart, Trash2Icon, Truck } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function Cart() {
    const dispatch = useDispatch()

    // The cart is restored from localStorage right after the first render,
    // so we show a skeleton first instead of flashing "cart is empty".
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const cartItems = useSelector(state => state.cart?.cartItems || {})
    const products = useSelector(state => state.product?.list || [])

    const cartArray = useMemo(() => {
        if (!Array.isArray(products)) return []

        return Object.entries(cartItems)
            .map(([productId, quantity]) => {
                const product = products.find(
                    item => String(item.id) === String(productId)
                )
                if (!product) return null

                return {
                    ...product,
                    images: getImages(product),
                    quantity: Number(quantity) || 0,
                }
            })
            .filter(item => item && item.quantity > 0)
    }, [cartItems, products])

    const totalPrice = useMemo(
        () =>
            cartArray.reduce(
                (total, item) => total + Number(item.price || 0) * item.quantity,
                0
            ),
        [cartArray]
    )

    const totalUnits = cartArray.reduce((sum, item) => sum + item.quantity, 0)

    if (!mounted) {
        return (
            <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6">
                <div className="h-9 w-48 rounded bg-slate-200" />
                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
                    <div className="space-y-4">
                        {[0, 1].map(i => (
                            <div key={i} className="h-36 rounded-3xl bg-slate-100" />
                        ))}
                    </div>
                    <div className="h-96 rounded-3xl bg-slate-100" />
                </div>
            </div>
        )
    }

    if (cartArray.length === 0) {
        return (
            <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                    <ShoppingCart size={42} />
                </div>
                <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
                    Your cart is empty
                </h1>
                <p className="mt-3 text-slate-500">
                    Looks like you haven&apos;t added anything yet. Explore our latest
                    products and find something you love.
                </p>
                <Link
                    href="/shop"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#030a12] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                    Start shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50/60 px-4 pb-16 sm:px-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-wrap items-end justify-between gap-3 py-8">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-600">
                            Checkout
                        </p>
                        <h1 className="mt-1 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            My Cart{' '}
                            <span className="text-lg font-semibold text-slate-400">
                                ({totalUnits} {totalUnits === 1 ? 'item' : 'items'})
                            </span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-1.5 font-semibold text-slate-600 transition hover:text-cyan-600"
                        >
                            <ArrowLeft size={16} />
                            Continue shopping
                        </Link>
                        <button
                            type="button"
                            onClick={() => dispatch(clearCart())}
                            className="font-semibold text-rose-500 transition hover:text-rose-700"
                        >
                            Clear cart
                        </button>
                    </div>
                </div>

                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm text-emerald-800">
                    <Truck size={20} className="shrink-0" />
                    <p>
                        <strong>Free delivery</strong> on your order across Egypt. Pay
                        when it arrives.
                    </p>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
                    {/* Items */}
                    <ul className="space-y-4">
                        {cartArray.map(item => (
                            <li
                                key={item.id}
                                className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4 transition hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-900/5 sm:p-5"
                            >
                                <Link
                                    href={`/product/${item.id}`}
                                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 sm:h-32 sm:w-32"
                                >
                                    <ProductImage
                                        src={item.images[0]}
                                        alt={item.name || 'Product'}
                                        sizes="128px"
                                        className="object-contain p-3"
                                    />
                                </Link>

                                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            {getCategoryLabel(item) && (
                                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-600">
                                                    {getCategoryLabel(item)}
                                                </p>
                                            )}
                                            <Link
                                                href={`/product/${item.id}`}
                                                className="mt-1 line-clamp-2 font-semibold leading-snug text-slate-900 transition hover:text-cyan-700"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {formatPrice(item.price)} each
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                dispatch(
                                                    deleteItemFromCart({ productId: item.id })
                                                )
                                            }
                                            aria-label={`Remove ${item.name} from cart`}
                                            className="shrink-0 rounded-full p-2.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 active:scale-95"
                                        >
                                            <Trash2Icon size={18} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <Counter productId={item.id} />
                                        <p className="text-lg font-extrabold text-slate-900">
                                            {formatPrice(Number(item.price || 0) * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Summary */}
                    <div className="lg:sticky lg:top-24">
                        <OrderSummary totalPrice={totalPrice} items={cartArray} />
                    </div>
                </div>
            </div>
        </div>
    )
}
