
'use client'

import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react"
import OrderItem from "@/components/OrderItem"
import Link from "next/link"

export default function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        let active = true

        async function loadOrders() {
            try {
                const response = await fetch("/api/account/orders", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                })

                const data = await response.json()

                if (!active) return

                if (response.status === 401) {
                    window.location.href = "/login"
                    return
                }

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load orders")
                }

                setOrders(Array.isArray(data.orders) ? data.orders : [])
            } catch (err) {
                if (active) {
                    setError(err.message || "Something went wrong")
                }
            } finally {
                if (active) setLoading(false)
            }
        }

        loadOrders()

        return () => {
            active = false
        }
    }, [])

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <p className="text-slate-500">Loading your orders...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-6">
                <p className="text-red-500 text-center">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 rounded bg-slate-900 text-white"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-[70vh] mx-6">
            {orders.length > 0 ? (
                <div className="my-20 max-w-7xl mx-auto">
                    <PageTitle
                        heading="My Orders"
                        text={`Showing total ${orders.length} orders`}
                        linkText="Go to home"
                    />

                    <div className="overflow-x-auto">
                        <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
                            <thead>
                                <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                    <th className="text-left">Product</th>
                                    <th className="text-center">Total Price</th>
                                    <th className="text-left">Address</th>
                                    <th className="text-left">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((order) => (
                                    <OrderItem
                                        order={order}
                                        key={order.id}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center gap-5 text-slate-500">
                    <h1 className="text-2xl sm:text-4xl font-semibold">
                        You have no orders
                    </h1>
                    <Link
                        href="/"
                        className="px-6 py-3 rounded bg-slate-900 text-white hover:bg-slate-700 transition"
                    >
                        Start Shopping
                    </Link>
                </div>
            )}
        </div>
    )
}
