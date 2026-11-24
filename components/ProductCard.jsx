import Link from 'next/link'
import { ArrowUpRight, Star } from 'lucide-react'
import ProductImage from './ProductImage'
import {
    formatPrice,
    getCategoryLabel,
    getDiscount,
    getImages,
    getRating,
    isInStock,
    isNew,
} from '@/lib/productUtils'

const ProductCard = ({ product }) => {
    console.log("CURRENCY TEST:", {
    env: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL,
    formattedPrice: formatPrice(product?.price),
})
    if (!product) return null

    const images = getImages(product)
    const discount = getDiscount(product)
    const { average, count } = getRating(product)
    const inStock = isInStock(product)
    const category = getCategoryLabel(product)

    return (
        <Link
            href={`/product/${product.id}`}
            className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1.5 hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-900/10"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100">
                {/* soft spotlight behind the product */}
                <div className="pointer-events-none absolute inset-x-8 bottom-6 h-10 rounded-full bg-slate-900/10 blur-xl transition group-hover:bg-cyan-500/20" />

                <ProductImage
                    src={images[0]}
                    alt={product.name}
                    className={`object-contain p-6 transition duration-500 sm:p-8 ${
                        images[1]
                            ? 'group-hover:scale-95 group-hover:opacity-0'
                            : 'group-hover:scale-110'
                    } ${!inStock ? 'opacity-50 grayscale' : ''}`}
                />

                {/* second image on hover */}
                {images[1] && (
                    <ProductImage
                        src={images[1]}
                        alt={`${product.name} - view 2`}
                        className="object-contain p-6 opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100 sm:p-8"
                    />
                )}

                {/* Badges */}
                <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
                    {discount > 0 && inStock && (
                        <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">
                            -{discount}%
                        </span>
                    )}
                    {isNew(product) && inStock && (
                        <span className="rounded-full bg-[#030a12] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-300 shadow">
                            New
                        </span>
                    )}
                </div>

                {!inStock && (
                    <span className="absolute inset-x-0 bottom-4 mx-auto w-fit rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white">
                        Out of stock
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col p-4 sm:p-5">
                {category && (
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-600">
                        {category}
                    </p>
                )}

                <h3 className="mt-1.5 line-clamp-2 min-h-[2.6rem] text-sm font-semibold leading-snug text-slate-900 sm:text-[15px]">
                    {product.name}
                </h3>

                {count > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-700">
                            {average.toFixed(1)}
                        </span>
                        <span>({count})</span>
                    </div>
                )}

                <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                    <div>
                        <p className="text-lg font-extrabold text-slate-900 sm:text-xl">
                            {formatPrice(product.price)}
                        </p>
                        {discount > 0 && (
                            <p className="text-xs text-slate-400 line-through">
                                {formatPrice(product.mrp)}
                            </p>
                        )}
                    </div>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#030a12] text-cyan-300 transition group-hover:bg-cyan-400 group-hover:text-slate-950">
                        <ArrowUpRight size={18} />
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard
