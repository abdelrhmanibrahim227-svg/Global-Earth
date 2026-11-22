
'use client'

import Loading from "@/components/Loading"
import {
    CircleDollarSignIcon,
    ShoppingBasketIcon,
    StarIcon,
    TagsIcon,
    RefreshCw,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

export default function Dashboard() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const router = useRouter()

    // مؤقتًا لحين ربط تسجيل الدخول الحقيقي
    const userId = 'dev-user-1'

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        totalRatings: 0,
        ratings: [],
    })
    const [store, setStore] = useState(null)

    const fetchDashboardData = async () => {
        try {
            setLoading(true)

            const response = await fetch(
                `/api/store/dashboard?userId=${encodeURIComponent(userId)}`,
                { cache: 'no-store' }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to load dashboard')
            }

            setStore(data.store)
            setDashboardData(data.dashboardData)

        } catch (error) {
            console.error('DASHBOARD ERROR:', error)
            toast.error(error.message || 'تعذر تحميل لوحة التحكم')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    const cards = [
        {
            title: 'Total Products',
            value: dashboardData.totalProducts.toLocaleString(),
            icon: ShoppingBasketIcon,
        },
        {
            title: 'Total Earnings',
            value: `${currency} ${Number(dashboardData.totalEarnings).toLocaleString()}`,
            icon: CircleDollarSignIcon,
        },
        {
            title: 'Total Orders',
            value: dashboardData.totalOrders.toLocaleString(),
            icon: TagsIcon,
        },
        {
            title: 'Total Ratings',
            value: dashboardData.totalRatings.toLocaleString(),
            icon: StarIcon,
        },
    ]

    return (
        <div className="text-slate-600 mb-28 w-full">

            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        GLOBAL EARTH
                    </p>

                    <h1 className="text-2xl font-semibold text-slate-800 mt-1">
                        Store Dashboard
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Welcome to your store management dashboard
                    </p>
                </div>

                <button
                    onClick={fetchDashboardData}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-50 transition"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Store Information */}
            {store && (
                <div className="mt-6 p-4 bg-white border rounded-xl">
                    <p className="text-xs text-slate-400">CURRENT STORE</p>

                    <div className="flex flex-wrap justify-between items-center gap-3 mt-2">
                        <h2 className="text-lg font-semibold text-slate-800">
                            {store.name}
                        </h2>

                        <span className={`text-xs px-3 py-1 rounded-full ${
                            store.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {store.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                        @{store.username}
                    </p>
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 my-8">
                {cards.map((card, index) => {
                    const Icon = card.icon

                    return (
                        <div
                            key={index}
                            className="flex items-center justify-between gap-4 border border-slate-200 bg-white p-5 rounded-xl shadow-sm"
                        >
                            <div className="flex flex-col gap-3">
                                <p className="text-sm text-slate-500">
                                    {card.title}
                                </p>

                                <b className="text-2xl font-semibold text-slate-800">
                                    {card.value}
                                </b>
                            </div>

                            <Icon
                                size={46}
                                className="w-12 h-12 p-3 text-slate-500 bg-slate-100 rounded-full"
                            />
                        </div>
                    )
                })}
            </div>

            {/* Reviews */}
            <div className="flex justify-between items-center mt-10 mb-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-800">
                        Customer Reviews
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Latest reviews on your products
                    </p>
                </div>

                <span className="text-sm text-slate-500">
                    {dashboardData.totalRatings} Reviews
                </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {dashboardData.ratings.length > 0 ? (
                    dashboardData.ratings.map((review) => (
                        <div
                            key={review.id}
                            className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between p-5 border-b last:border-b-0 border-slate-100"
                        >
                            <div className="flex-1">
                                <div className="flex gap-3 items-center">
                                    {review.user.image ? (
                                        <img
                                            src={review.user.image}
                                            alt=""
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold">
                                            {review.user.name?.charAt(0) || '?'}
                                        </div>
                                    )}

                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {review.user.name}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-3 text-sm text-slate-600 leading-6">
                                    {review.review || 'No written review'}
                                </p>
                            </div>

                            <div className="flex flex-col sm:items-end gap-3">
                                <div>
                                    <p className="text-xs text-slate-400">
                                        {review.product?.category}
                                    </p>

                                    <p className="font-medium text-slate-800">
                                        {review.product?.name}
                                    </p>

                                    <div className="flex items-center mt-1">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <StarIcon
                                                key={index}
                                                size={16}
                                                fill={review.rating >= index + 1 ? '#00C950' : '#D1D5DB'}
                                                className="text-transparent"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push(`/product/${review.product.id}`)}
                                    className="bg-slate-100 px-4 py-2 text-sm hover:bg-slate-200 rounded-lg transition"
                                >
                                    View Product
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-slate-500">
                        <StarIcon className="mx-auto mb-3 text-slate-300" size={32} />
                        <p>No customer reviews yet.</p>
                    </div>
                )}
            </div>

        </div>
    )
}
