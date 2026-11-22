
'use client'

import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductCard = ({ product }) => {
    const currency = 'ج.م'

    const ratings = Array.isArray(product?.rating)
        ? product.rating
        : []

    const validRatings = ratings.filter(
        item => Number.isFinite(Number(item?.rating))
    )

    const averageRating = validRatings.length > 0
        ? validRatings.reduce(
            (total, item) => total + Number(item.rating),
            0
        ) / validRatings.length
        : 0

    const rating = Math.round(averageRating)

    let images = []

    if (Array.isArray(product?.images)) {
        images = product.images
    } else if (typeof product?.images === 'string') {
        try {
            const parsed = JSON.parse(product.images)
            images = Array.isArray(parsed) ? parsed : [product.images]
        } catch {
            images = [product.images]
        }
    }

    const imageUrl = images.find(
        url => typeof url === 'string' && url.trim().length > 0
    )

    const formattedPrice = Number(product?.price || 0).toLocaleString(
        'en-EG',
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )

    return (
        <Link
            href={`/product/${product?.id}`}
            className="group mx-auto flex w-full max-w-[280px] flex-col"
        >
            <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-[#F5F7FA] p-3 sm:h-56">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        width={500}
                        height={500}
                        alt={product?.name || 'Product'}
                        className="!h-auto !w-auto max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 280px"
                        unoptimized
                    />
                ) : (
                    <div className="flex items-center justify-center text-sm text-slate-400">
                        لا توجد صورة
                    </div>
                )}
            </div>

            <div className="flex flex-1 justify-between gap-3 pt-3 text-sm text-slate-800">
                <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-medium">
                        {product?.name || 'منتج بدون اسم'}
                    </p>

                    <div className="mt-1 flex" aria-label={`التقييم ${rating} من 5`}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <StarIcon
                                key={index}
                                size={14}
                                className="mt-0.5"
                                fill={rating >= index + 1 ? '#00C950' : '#D1D5DB'}
                                stroke="none"
                            />
                        ))}
                    </div>
                </div>

                <p className="shrink-0 font-semibold text-slate-900">
                    {formattedPrice} {currency}
                </p>
            </div>
        </Link>
    )
}

export default ProductCard