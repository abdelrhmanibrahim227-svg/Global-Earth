
'use client'

import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import {
    CircleDollarSignIcon,
    ShoppingBasketIcon,
    StoreIcon,
    TagsIcon
} from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminDashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "ج.م"

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        allOrders: [],
    })

    useEffect(() => {
        let isMounted = true

        const fetchDashboardData = async () => {
            try {
                setLoading(true)
                setError("")

                const response = await fetch("/api/admin/dashboard", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load dashboard")
                }

                if (isMounted) {
                    setDashboardData({
                        products: data.products ?? 0,
                        revenue: data.revenue ?? 0,
                        orders: data.orders ?? 0,
                        stores: data.stores ?? 0,
                        allOrders: data.allOrders ?? [],
                    })
                }

            } catch (err) {
                console.error("Dashboard error:", err)

                if (isMounted) {
                    setError(err.message || "Unable to load dashboard data")
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchDashboardData()

        return () => {
            isMounted = false
        }
    }, [])

    const dashboardCardsData = [
        {
            title: "Total Products",
            value: dashboardData.products.toLocaleString(),
            icon: ShoppingBasketIcon
        },
        {
            title: "Total Revenue",
            value: `${dashboardData.revenue.toLocaleString("en-US", {
                maximumFractionDigits: 2
            })} ${currency}`,
            icon: CircleDollarSignIcon
        },
        {
            title: "Total Orders",
            value: dashboardData.orders.toLocaleString(),
            icon: TagsIcon
        },
        {
            title: "Total Stores",
            value: dashboardData.stores.toLocaleString(),
            icon: StoreIcon
        },
    ]

    if (loading) return <Loading />

    return (
        <div className="text-slate-500">

            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-slate-800">
                    GLOBAL EARTH
                    <span className="text-slate-500 font-normal"> Dashboard</span>
                </h1>

                <p className="text-sm text-slate-400">
                    Overview of your store and business performance
                </p>
            </div>

            {error && (
                <div className="mt-5 p-4 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                </div>
            )}

            {/* Dashboard Cards */}
            <div className="flex flex-wrap gap-5 my-10 mt-6">
                {dashboardCardsData.map((card, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between gap-8 border border-slate-200 p-4 px-6 rounded-lg min-w-[220px] bg-white"
                    >
                        <div className="flex flex-col gap-3 text-xs">
                            <p>{card.title}</p>

                            <b className="text-2xl font-medium text-slate-700">
                                {card.value}
                            </b>
                        </div>

                        <card.icon
                            size={44}
                            className="w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full"
                        />
                    </div>
                ))}
            </div>

            {/* Orders Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
                <OrdersAreaChart
                    allOrders={dashboardData.allOrders}
                />
            </div>

        </div>
    )
}
