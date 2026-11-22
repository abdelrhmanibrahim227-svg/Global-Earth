
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Loading from '@/components/Loading'
import {
    Package,
    CalendarDays,
    ShoppingBag,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    Truck,
    CheckCircle2
} from 'lucide-react'

export default function OrdersPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [expanded, setExpanded] = useState(null)

    const fetchOrders = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await fetch('/api/orders', {
                cache: 'no-store',
                credentials: 'include'
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Unable to load orders')
            }

            setOrders(Array.isArray(data.orders) ? data.orders : [])
        } catch (err) {
            setError(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const statusInfo = (status) => {
        const statuses = {
            ORDER_PLACED: ['Order Placed', 'bg-blue-100 text-blue-700'],
            PROCESSING: ['Processing', 'bg-yellow-100 text-yellow-700'],
            SHIPPED: ['Shipped', 'bg-purple-100 text-purple-700'],
            DELIVERED: ['Delivered', 'bg-green-100 text-green-700'],
            CANCELLED: ['Cancelled', 'bg-red-100 text-red-700'],
        }

        return statuses[status] || [
            status || 'Pending',
            'bg-gray-100 text-gray-700'
        ]
    }

    const getImage = (images) => {
        if (!Array.isArray(images) || !images.length) return null

        const image = images[0]

        return typeof image === 'string'
            ? image
            : image?.src || image?.url || null
    }

    // Egyptian Pound formatter
    const money = (value) =>
        `${Number(value || 0).toLocaleString('en-EG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} EGP`

    if (loading) return <Loading />

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="max-w-6xl mx-auto">

                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            My Orders
                        </h1>

                        <p className="text-slate-500 mt-2">
                            Track and manage your purchases
                        </p>
                    </div>

                    <button
                        onClick={fetchOrders}
                        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-slate-100"
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-700">
                        <p>{error}</p>

                        {error.toLowerCase().includes('login') && (
                            <Link
                                href="/login"
                                className="underline block mt-3"
                            >
                                Login to your account
                            </Link>
                        )}

                        <button
                            onClick={fetchOrders}
                            className="underline mt-3"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!error && orders.length === 0 && (
                    <div className="bg-white border rounded-xl p-12 text-center">
                        <ShoppingBag
                            size={55}
                            className="mx-auto text-slate-300 mb-4"
                        />

                        <h2 className="text-xl font-semibold text-slate-800">
                            No orders yet
                        </h2>

                        <p className="text-slate-500 mt-2">
                            Your purchases will appear here.
                        </p>

                        <Link
                            href="/shop/mystore"
                            className="inline-block mt-6 px-6 py-3 bg-slate-900 text-white rounded-lg"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}

                {!error && orders.length > 0 && (
                    <div className="space-y-5">
                        {orders.map((order) => {
                            const isOpen = expanded === order.id
                            const [status, statusClass] = statusInfo(order.status)

                            return (
                                <section
                                    key={order.id}
                                    className="bg-white border rounded-xl shadow-sm overflow-hidden"
                                >
                                    <div className="p-5 md:p-6">
                                        <div className="flex flex-wrap justify-between gap-5">
                                            <div className="min-w-0">
                                                <p className="text-sm text-slate-500">
                                                    Order Number
                                                </p>

                                                <p className="font-semibold text-slate-800 break-all">
                                                    #{order.id}
                                                </p>

                                                <p className="flex items-center gap-2 text-sm text-slate-500 mt-3">
                                                    <CalendarDays size={16} />
                                                    {new Date(order.createdAt).toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="text-left">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                                                    {status}
                                                </span>

                                                <p className="text-sm text-slate-500 mt-3">
                                                    Total
                                                </p>

                                                <p className="text-xl font-bold text-slate-900">
                                                    {money(order.total)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap justify-between items-center gap-3 border-t mt-5 pt-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Package size={18} />
                                                {order.orderItems?.length || 0} Products
                                            </div>

                                            <button
                                                onClick={() => setExpanded(
                                                    isOpen ? null : order.id
                                                )}
                                                className="flex items-center gap-2 text-sm font-semibold hover:text-blue-600"
                                            >
                                                {isOpen ? 'Hide Details' : 'View Details'}

                                                {isOpen
                                                    ? <ChevronUp size={18} />
                                                    : <ChevronDown size={18} />
                                                }
                                            </button>
                                        </div>
                                    </div>

                                    {isOpen && (
                                        <div className="bg-slate-50 border-t p-5 md:p-6">

                                            <h3 className="font-semibold text-slate-800 mb-4">
                                                Order Items
                                            </h3>

                                            <div className="space-y-3">
                                                {order.orderItems?.map((item, index) => {
                                                    const image = getImage(item.product?.images)

                                                    return (
                                                        <div
                                                            key={item.id || index}
                                                            className="flex items-center gap-4 bg-white border rounded-lg p-3"
                                                        >
                                                            {image ? (
                                                                <img
                                                                    src={image}
                                                                    alt={item.product?.name || 'Product'}
                                                                    className="w-16 h-16 object-cover rounded"
                                                                />
                                                            ) : (
                                                                <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center">
                                                                    <Package className="text-slate-400" />
                                                                </div>
                                                            )}

                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-slate-800">
                                                                    {item.product?.name || 'Product'}
                                                                </p>

                                                                <p className="text-sm text-slate-500 mt-1">
                                                                    Quantity: {item.quantity}
                                                                </p>
                                                            </div>

                                                            <p className="font-semibold text-slate-800">
                                                                {money(item.price)}
                                                            </p>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            {order.address && (
                                                <div className="mt-6">
                                                    <h3 className="font-semibold text-slate-800 mb-3">
                                                        Delivery Address
                                                    </h3>

                                                    <div className="bg-white border rounded-lg p-4 text-sm text-slate-600 space-y-1">
                                                        <p>{order.address.street}</p>

                                                        <p>
                                                            {[
                                                                order.address.city,
                                                                order.address.state,
                                                                order.address.zip,
                                                                order.address.country
                                                            ].filter(Boolean).join(', ')}
                                                        </p>

                                                        <p>{order.address.phone}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-6 bg-white border rounded-lg p-4">
                                                <h3 className="font-semibold text-slate-800 mb-3">
                                                    Payment Information
                                                </h3>

                                                <p className="text-sm text-slate-600">
                                                    Payment Method: {order.paymentMethod || 'Not specified'}
                                                </p>

                                                <p className="text-sm text-slate-600 mt-2">
                                                    Payment Status: {order.isPaid ? 'Paid' : 'Not Paid'}
                                                </p>
                                            </div>

                                            <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
                                                {order.status === 'DELIVERED' ? (
                                                    <CheckCircle2 className="text-green-600" />
                                                ) : (
                                                    <Truck className="text-blue-600" />
                                                )}

                                                Current Status: {status}
                                            </div>
                                        </div>
                                    )}
                                </section>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}