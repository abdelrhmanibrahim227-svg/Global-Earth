'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { getRating } from '@/lib/productUtils'

const TABS = ['Description', 'Shipping & Returns', 'Reviews']

const ProductDescription = ({ product }) => {
    const [tab, setTab] = useState('Description')
    const { average, count } = getRating(product)
    const reviews = Array.isArray(product?.rating) ? product.rating : []

    return (
        <section className="rounded-3xl border border-slate-200 bg-white">
            <div
                role="tablist"
                className="flex gap-1 overflow-x-auto border-b border-slate-200 px-3 pt-3 sm:px-6"
            >
                {TABS.map(name => (
                    <button
                        key={name}
                        role="tab"
                        aria-selected={tab === name}
                        type="button"
                        onClick={() => setTab(name)}
                        className={`whitespace-nowrap rounded-t-xl px-4 py-3 text-sm font-semibold transition ${
                            tab === name
                                ? 'border-b-2 border-cyan-500 text-cyan-700'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        {name}
                        {name === 'Reviews' && count > 0 ? ` (${count})` : ''}
                    </button>
                ))}
            </div>

            <div className="p-5 sm:p-8">
                {tab === 'Description' && (
                    <div className="max-w-3xl whitespace-pre-line text-[15px] leading-8 text-slate-600">
                        {product?.description || 'No description available for this product.'}
                    </div>
                )}

                {tab === 'Shipping & Returns' && (
                    <ul className="max-w-3xl space-y-4 text-[15px] leading-7 text-slate-600">
                        <li>
                            <strong className="text-slate-900">Delivery:</strong> we ship to
                            all Egyptian governorates with tracking and careful packaging.
                        </li>
                        <li>
                            <strong className="text-slate-900">Payment:</strong> cash on
                            delivery or secure online payment.
                        </li>
                        <li>
                            <strong className="text-slate-900">Returns:</strong> inspect your
                            order on arrival. If something is wrong, contact us and we will
                            make it right.
                        </li>
                        <li>
                            <strong className="text-slate-900">Authenticity:</strong> every
                            product is original and sourced from trusted suppliers.
                        </li>
                    </ul>
                )}

                {tab === 'Reviews' && (
                    <div>
                        {count === 0 ? (
                            <p className="text-slate-500">
                                No reviews yet for this product.
                            </p>
                        ) : (
                            <>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-5xl font-extrabold text-slate-900">
                                        {average.toFixed(1)}
                                    </span>
                                    <div>
                                        <div className="flex">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={18}
                                                    className={
                                                        i < Math.round(average)
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'text-slate-300'
                                                    }
                                                />
                                            ))}
                                        </div>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Based on {count} review{count > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {reviews.map((r, i) =>
                                        r?.review ? (
                                            <div
                                                key={r.id || i}
                                                className="rounded-2xl bg-slate-50 p-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {r.user?.name || 'Verified customer'}
                                                    </p>
                                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                                        <Star
                                                            size={13}
                                                            className="fill-amber-400 text-amber-400"
                                                        />
                                                        {Number(r.rating || 0).toFixed(1)}
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                                    {r.review}
                                                </p>
                                            </div>
                                        ) : null
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}

export default ProductDescription
