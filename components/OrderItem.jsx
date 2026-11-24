'use client'

// components/OrderItem.jsx  (still renders table rows, so your orders page table keeps working)
import { useState } from 'react'
import { useSelector } from 'react-redux'
import Rating from './Rating'
import RatingModal from './RatingModal'
import ProductImage from './ProductImage'
import { formatPrice, getImages } from '@/lib/productUtils'

const STATUS_STYLES = {
    ORDER_PLACED: 'bg-amber-50 text-amber-700 ring-amber-200',
    CONFIRMED: 'bg-amber-50 text-amber-700 ring-amber-200',
    PROCESSING: 'bg-amber-50 text-amber-700 ring-amber-200',
    SHIPPED: 'bg-sky-50 text-sky-700 ring-sky-200',
    DELIVERED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    CANCELLED: 'bg-rose-50 text-rose-700 ring-rose-200',
}

function StatusBadge({ status }) {
    const key = String(status || '').toUpperCase()
    const label = String(status || '')
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/^\w/, c => c.toUpperCase())

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 ${
                STATUS_STYLES[key] || 'bg-slate-100 text-slate-600 ring-slate-200'
            }`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {label}
        </span>
    )
}

const OrderItem = ({ order }) => {
    const [ratingModal, setRatingModal] = useState(null)
    const { ratings } = useSelector(state => state.rating)

    const isDelivered = String(order.status).toUpperCase() === 'DELIVERED'
    const date = new Date(order.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    return (
        <>
            <tr className="align-top text-sm">
                <td className="py-5 text-left">
                    <div className="flex flex-col gap-5">
                        {order.orderItems.map((item, index) => {
                            const existing = ratings?.find(
                                r =>
                                    order.id === r.orderId &&
                                    item.product.id === r.productId
                            )

                            return (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100">
                                        <ProductImage
                                            src={getImages(item.product)[0]}
                                            alt={item.product.name || 'Product'}
                                            sizes="80px"
                                            className="object-contain p-2"
                                        />
                                    </div>

                                    <div className="flex min-w-0 flex-col justify-center">
                                        <p className="line-clamp-2 text-base font-semibold text-slate-800">
                                            {item.product.name}
                                        </p>
                                        <p className="mt-0.5 text-slate-500">
                                            {formatPrice(item.price)}
                                            <span className="mx-2 text-slate-300">|</span>
                                            Qty: {item.quantity}
                                        </p>
                                        <p className="mb-1 text-xs text-slate-400">{date}</p>

                                        {existing ? (
                                            <Rating value={existing.rating} />
                                        ) : (
                                            isDelivered && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setRatingModal({
                                                            orderId: order.id,
                                                            productId: item.product.id,
                                                        })
                                                    }
                                                    className="w-fit rounded-full border border-emerald-300 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                                                >
                                                    Rate product
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            )
                        })}

                        {ratingModal && (
                            <RatingModal
                                ratingModal={ratingModal}
                                setRatingModal={setRatingModal}
                            />
                        )}
                    </div>
                </td>

                <td className="py-5 text-center font-extrabold text-slate-900 max-md:hidden">
                    {formatPrice(order.total)}
                </td>

                <td className="py-5 text-left leading-6 text-slate-600 max-md:hidden">
                    <p className="font-semibold text-slate-800">{order.address.name}</p>
                    <p>{order.address.street}</p>
                    <p>
                        {order.address.city}, {order.address.state}
                        {order.address.zip ? `, ${order.address.zip}` : ''}
                    </p>
                    <p dir="ltr" className="text-left text-slate-500">
                        {order.address.phone}
                    </p>
                </td>

                <td className="py-5 text-center max-md:hidden">
                    <StatusBadge status={order.status} />
                </td>
            </tr>

            {/* Mobile summary */}
            <tr className="md:hidden">
                <td colSpan={5} className="pb-5">
                    <div className="space-y-1 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                        <p className="font-semibold text-slate-800">{order.address.name}</p>
                        <p>
                            {order.address.street}, {order.address.city}, {order.address.state}
                        </p>
                        <p dir="ltr" className="text-left">
                            {order.address.phone}
                        </p>
                        <div className="flex items-center justify-between pt-3">
                            <StatusBadge status={order.status} />
                            <span className="text-base font-extrabold text-slate-900">
                                {formatPrice(order.total)}
                            </span>
                        </div>
                    </div>
                </td>
            </tr>

            <tr>
                <td colSpan={4}>
                    <div className="mx-auto h-px w-full bg-slate-200" />
                </td>
            </tr>
        </>
    )
}

export default OrderItem
