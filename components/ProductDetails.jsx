'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import {
    BadgeCheck,
    Check,
    Minus,
    Plus,
    RotateCcw,
    Share2,
    ShieldCheck,
    ShoppingCart,
    Star,
    Truck,
    MessageCircle,
    Zap,
} from 'lucide-react'
import ProductImage from './ProductImage'
// NOTE: standard slice path/payload. If your cart slice differs, change only these two lines.
import { addToCart } from '@/lib/features/cart/cartSlice'
import {
    formatPrice,
    getCategoryLabel,
    getDiscount,
    getImages,
    getRating,
    isInStock,
} from '@/lib/productUtils'

const WHATSAPP = '201557040056'

const ProductDetails = ({ product }) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart?.cartItems) || {}

    const images = getImages(product)
    const discount = getDiscount(product)
    const { average, count } = getRating(product)
    const inStock = isInStock(product)
    const category = getCategoryLabel(product)
    const inCartQty = Number(cartItems?.[product.id] || 0)

    const [selected, setSelected] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)
    const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 })
    const [copied, setCopied] = useState(false)

    const addItems = () => {
        for (let i = 0; i < quantity; i++) {
            dispatch(addToCart({ productId: product.id }))
        }
    }

    const handleAdd = () => {
        addItems()
        setAdded(true)
        setTimeout(() => setAdded(false), 2200)
    }

    const handleBuyNow = () => {
        if (inCartQty === 0) addItems()
        router.push('/cart')
    }

    const handleShare = async () => {
        const url = window.location.href
        try {
            if (navigator.share) {
                await navigator.share({ title: product.name, url })
            } else {
                await navigator.clipboard.writeText(url)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            }
        } catch {
            /* user cancelled */
        }
    }

    const onMove = e => {
        const rect = e.currentTarget.getBoundingClientRect()
        setZoom({
            active: true,
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        })
    }

    const whatsappLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
        `Hello GLOBAL EARTH, I'd like to order: ${product.name} (x${quantity})`
    )}`

    return (
        <>
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
                {/* ===== Gallery ===== */}
                <div className="lg:sticky lg:top-24 lg:self-start">
                    <div
                        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white"
                        onMouseMove={onMove}
                        onMouseLeave={() => setZoom(z => ({ ...z, active: false }))}
                    >
                        {discount > 0 && inStock && (
                            <span className="absolute left-4 top-4 z-10 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow">
                                Save {discount}%
                            </span>
                        )}

                        <div
                            className="absolute inset-0 transition-transform duration-200 ease-out"
                            style={{
                                transform: zoom.active ? 'scale(1.9)' : 'scale(1)',
                                transformOrigin: `${zoom.x}% ${zoom.y}%`,
                            }}
                        >
                            <ProductImage
                                src={images[selected]}
                                alt={product.name}
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-contain p-8 sm:p-12"
                            />
                        </div>
                    </div>

                    {images.length > 1 && (
                        <div className="mt-4 grid grid-cols-5 gap-3">
                            {images.slice(0, 5).map((img, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setSelected(i)}
                                    aria-label={`Show image ${i + 1}`}
                                    className={`relative aspect-square overflow-hidden rounded-2xl border-2 bg-slate-50 transition ${
                                        selected === i
                                            ? 'border-cyan-500 shadow-md shadow-cyan-200'
                                            : 'border-transparent hover:border-slate-300'
                                    }`}
                                >
                                    <ProductImage
                                        src={img}
                                        alt=""
                                        sizes="100px"
                                        className="object-contain p-2"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ===== Info ===== */}
                <div>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            {category && (
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">
                                    {category}
                                </p>
                            )}
                            <h1 className="mt-2 text-2xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
                                {product.name}
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={handleShare}
                            aria-label="Share product"
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-cyan-400 hover:text-cyan-600"
                        >
                            {copied ? <Check size={18} /> : <Share2 size={18} />}
                        </button>
                    </div>

                    {/* Rating */}
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                        {count > 0 ? (
                            <>
                                <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={17}
                                            className={
                                                i < Math.round(average)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-slate-300'
                                            }
                                        />
                                    ))}
                                </div>
                                <span className="font-semibold text-slate-800">
                                    {average.toFixed(1)}
                                </span>
                                <span className="text-slate-500">
                                    {count} review{count > 1 ? 's' : ''}
                                </span>
                            </>
                        ) : (
                            <span className="text-slate-400">No reviews yet</span>
                        )}
                    </div>

                    {/* Price */}
                    <div className="mt-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
                        <div className="flex flex-wrap items-end gap-3">
                            <span className="text-4xl font-extrabold text-slate-900">
                                {formatPrice(product.price)}
                            </span>
                            {discount > 0 && (
                                <>
                                    <span className="pb-1 text-lg text-slate-400 line-through">
                                        {formatPrice(product.mrp)}
                                    </span>
                                    <span className="mb-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600">
                                        You save {formatPrice(product.mrp - product.price)}
                                    </span>
                                </>
                            )}
                        </div>

                        <p
                            className={`mt-3 flex items-center gap-2 text-sm font-semibold ${
                                inStock ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                        >
                            <span
                                className={`h-2.5 w-2.5 rounded-full ${
                                    inStock ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                            />
                            {inStock ? 'In stock - ready to ship' : 'Currently out of stock'}
                        </p>
                    </div>

                    {/* Quantity + actions */}
                    {inStock && (
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold text-slate-700">
                                    Quantity
                                </span>
                                <div className="flex items-center rounded-full border border-slate-300">
                                    <button
                                        type="button"
                                        aria-label="Decrease quantity"
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-10 text-center font-bold">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        aria-label="Increase quantity"
                                        onClick={() => setQuantity(q => Math.min(10, q + 1))}
                                        className="flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                {inCartQty > 0 && (
                                    <span className="text-xs text-slate-500">
                                        {inCartQty} already in your cart
                                    </span>
                                )}
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={handleAdd}
                                    className={`flex h-14 items-center justify-center gap-2 rounded-full text-sm font-bold transition active:scale-[0.98] ${
                                        added
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-[#030a12] text-white hover:bg-slate-800'
                                    }`}
                                >
                                    {added ? <Check size={19} /> : <ShoppingCart size={19} />}
                                    {added ? 'Added to cart' : 'Add to Cart'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleBuyNow}
                                    className="flex h-14 items-center justify-center gap-2 rounded-full bg-cyan-400 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-300/50 transition hover:bg-cyan-300 active:scale-[0.98]"
                                >
                                    <Zap size={19} />
                                    Buy Now
                                </button>
                            </div>

                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-12 items-center justify-center gap-2 rounded-full border border-emerald-500 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
                            >
                                <MessageCircle size={18} />
                                Order via WhatsApp
                            </a>
                        </div>
                    )}

                    {/* Trust */}
                    <div className="mt-7 grid grid-cols-3 gap-3">
                        {[
                            { icon: BadgeCheck, t: '100% Original' },
                            { icon: Truck, t: 'Fast Delivery' },
                            { icon: ShieldCheck, t: 'Secure Payment' },
                        ].map(({ icon: Icon, t }) => (
                            <div
                                key={t}
                                className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50 p-3 text-center"
                            >
                                <Icon size={22} className="text-cyan-600" />
                                <span className="text-xs font-semibold text-slate-700">
                                    {t}
                                </span>
                            </div>
                        ))}
                    </div>

                    <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                        <RotateCcw size={14} />
                        Easy returns · Cash on delivery available across Egypt
                    </p>
                </div>
            </div>

            {/* Mobile sticky buy bar */}
            {inStock && (
                <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
                    <div>
                        <p className="text-xs text-slate-500">Price</p>
                        <p className="text-lg font-extrabold text-slate-900">
                            {formatPrice(product.price)}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleAdd}
                        className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-bold ${
                            added ? 'bg-emerald-500 text-white' : 'bg-cyan-400 text-slate-950'
                        }`}
                    >
                        {added ? <Check size={18} /> : <ShoppingCart size={18} />}
                        {added ? 'Added' : 'Add to Cart'}
                    </button>
                </div>
            )}
        </>
    )
}

export default ProductDetails
