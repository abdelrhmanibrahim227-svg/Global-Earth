
'use client'

import { useEffect, useState, useCallback } from "react"
import Loading from "@/components/Loading"

const statuses = [
    "ORDER_PLACED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
]

const formatMoney = (value) =>
    `${Number(value || 0).toLocaleString("en-EG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} ج.م`

const formatDate = (value) =>
    new Date(value).toLocaleString("en-EG")

export default function StoreOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [updatingOrder, setUpdatingOrder] = useState(null)
    const [error, setError] = useState("")

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true)
            setError("")

            const response = await fetch("/api/store/orders", {
                cache: "no-store",
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Unable to load orders")
            }

            setOrders(Array.isArray(data.orders) ? data.orders : [])
        } catch (err) {
            setError(err.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }, [])

    const updateOrderStatus = async (orderId, status) => {
        try {
            setUpdatingOrder(orderId)
            setError("")

            const response = await fetch(
                `/api/store/orders/${orderId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Unable to update status")
            }

            setOrders((previous) =>
                previous.map((order) =>
                    order.id === orderId
                        ? { ...order, status: data.order.status }
                        : order
                )
            )

            setSelectedOrder((previous) =>
                previous?.id === orderId
                    ? { ...previous, status: data.order.status }
                    : previous
            )
        } catch (err) {
            setError(err.message || "Unable to update order")
            await fetchOrders()
        } finally {
            setUpdatingOrder(null)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [fetchOrders])

    const openModal = (order) => setSelectedOrder(order)
    const closeModal = () => setSelectedOrder(null)

    if (loading) return <Loading />

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h1 className="text-2xl text-slate-500">
                    Store <span className="text-slate-800 font-medium">Orders</span>
                </h1>

                <button
                    onClick={fetchOrders}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
                >
                    Refresh Orders
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-semibold text-slate-800">
                        {orders.length}
                    </p>
                </div>

                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Pending Orders</p>
                    <p className="text-2xl font-semibold text-orange-600">
                        {orders.filter(o => o.status === "ORDER_PLACED").length}
                    </p>
                </div>

                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Total Sales</p>
                    <p className="text-2xl font-semibold text-green-700">
                        {formatMoney(orders.reduce((sum, order) => sum + Number(order.total || 0), 0))}
                    </p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
                    No orders found.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200 bg-white">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
                            <tr>
                                {[
                                    "No.",
                                    "Order ID",
                                    "Customer",
                                    "Products",
                                    "Total",
                                    "Payment",
                                    "Status",
                                    "Date",
                                ].map((heading) => (
                                    <th key={heading} className="px-4 py-4 whitespace-nowrap">
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order, index) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => openModal(order)}
                                >
                                    <td className="px-4 py-4 text-green-700">
                                        {index + 1}
                                    </td>

                                    <td className="px-4 py-4 font-medium text-slate-700">
                                        #{order.id.slice(-8)}
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {order.user?.name || order.address?.name || "Customer"}
                                    </td>

                                    <td className="px-4 py-4">
                                        {order.orderItems?.length || 0}
                                    </td>

                                    <td className="px-4 py-4 font-semibold text-slate-800 whitespace-nowrap">
                                        {formatMoney(order.total)}
                                    </td>

                                    <td className="px-4 py-4">
                                        {order.paymentMethod}
                                    </td>

                                    <td
                                        className="px-4 py-4"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <select
                                            value={order.status}
                                            disabled={updatingOrder === order.id}
                                            onChange={(e) =>
                                                updateOrderStatus(order.id, e.target.value)
                                            }
                                            className="border border-gray-300 rounded-lg px-2 py-2 text-xs disabled:opacity-50"
                                        >
                                            {statuses.map(status => (
                                                <option key={status} value={status}>
                                                    {status.replaceAll("_", " ")}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                                        {formatDate(order.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedOrder && (
                <div
                    onClick={closeModal}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-semibold text-slate-800">
                                Order Details
                            </h2>

                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-red-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-5 space-y-2">
                            <p>
                                <strong>Order ID:</strong> #{selectedOrder.id}
                            </p>
                            <p>
                                <strong>Customer:</strong>{" "}
                                {selectedOrder.user?.name || selectedOrder.address?.name}
                            </p>
                            <p>
                                <strong>Email:</strong>{" "}
                                {selectedOrder.user?.email || selectedOrder.address?.email}
                            </p>
                            <p>
                                <strong>Phone:</strong> {selectedOrder.address?.phone}
                            </p>
                            <p>
                                <strong>Address:</strong>{" "}
                                {[
                                    selectedOrder.address?.street,
                                    selectedOrder.address?.city,
                                    selectedOrder.address?.state,
                                    selectedOrder.address?.country,
                                ].filter(Boolean).join(", ")}
                            </p>
                            <p>
                                <strong>Payment:</strong> {selectedOrder.paymentMethod}
                            </p>
                            <p>
                                <strong>Paid:</strong> {selectedOrder.isPaid ? "Yes" : "No"}
                            </p>
                            <p>
                                <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                            </p>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-3">
                            Ordered Products
                        </h3>

                        <div className="space-y-3 mb-5">
                            {selectedOrder.orderItems?.map((item) => {
                                const image = item.product?.images?.[0]

                                return (
                                    <div
                                        key={item.productId}
                                        className="flex items-center gap-3 border rounded-lg p-3"
                                    >
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={item.product?.name || "Product"}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-100 rounded" />
                                        )}

                                        <div className="flex-1">
                                            <p className="font-medium text-slate-800">
                                                {item.product?.name || "Product"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Quantity: {item.quantity}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Unit Price: {formatMoney(item.price)}
                                            </p>
                                            <p className="text-sm font-semibold text-green-700">
                                                Subtotal: {formatMoney(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="border-t pt-4 space-y-3">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-green-700">
                                    {formatMoney(selectedOrder.total)}
                                </span>
                            </div>

                            <label className="block font-medium text-slate-700">
                                Update Order Status
                            </label>

                            <select
                                value={selectedOrder.status}
                                disabled={updatingOrder === selectedOrder.id}
                                onChange={(e) =>
                                    updateOrderStatus(selectedOrder.id, e.target.value)
                                }
                                className="w-full border rounded-lg p-3"
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>
                                        {status.replaceAll("_", " ")}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end mt-5">
                            <button
                                onClick={closeModal}
                                className="px-5 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}