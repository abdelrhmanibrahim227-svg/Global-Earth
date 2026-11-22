
'use client'

import ProductCard from "@/components/ProductCard"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { MailIcon, MapPinIcon } from "lucide-react"
import Loading from "@/components/Loading"
import Image from "next/image"

const defaultCategories = [
    "Laptops",
    "Mobile Phones",
    "Desktop Computers",
    "Monitors",
    "Cameras",
    "Printers & Scanners",
    "Computer Accessories",
    "Mobile Accessories",
    "Networking Devices",
    "Storage Devices",
    "Gaming Devices",
    "Other Electronics",
]

export default function StoreShop() {
    const { username } = useParams()

    const [products, setProducts] = useState([])
    const [storeInfo, setStoreInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")

    useEffect(() => {
        if (!username) return

        let cancelled = false

        async function fetchStoreData() {
            try {
                setLoading(true)
                setError("")

                const response = await fetch(
                    `/api/store?username=${encodeURIComponent(username)}`,
                    { cache: "no-store" }
                )

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load store")
                }

                if (!cancelled) {
                    setStoreInfo(data.store || null)
                    setProducts(data.products || [])
                    setSelectedCategory("All")
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("Store loading error:", err)
                    setError(err.message || "Unable to load store")
                    setStoreInfo(null)
                    setProducts([])
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchStoreData()

        return () => {
            cancelled = true
        }
    }, [username])

    // الأقسام الافتراضية + أي أقسام قديمة موجودة في قاعدة البيانات
    const categories = useMemo(() => {
        const existingCategories = products
            .map(product => product.category?.trim())
            .filter(Boolean)

        return [
            ...new Set([
                ...defaultCategories,
                ...existingCategories,
            ]),
        ]
    }, [products])

    // تصفية المنتجات حسب القسم المختار
    const filteredProducts = useMemo(() => {
        if (selectedCategory === "All") return products

        return products.filter(
            product => product.category?.trim() === selectedCategory
        )
    }, [products, selectedCategory])

    if (loading) return <Loading />

    if (error || !storeInfo) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-6">
                <p className="text-slate-500 text-lg">
                    {error || "Store not found"}
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-[70vh] mx-4 sm:mx-6">

            {/* Store Information */}
            <div className="max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">

                {storeInfo.logo && (
                    <div className="relative size-32 sm:size-38 shrink-0">
                        <Image
                            src={storeInfo.logo}
                            alt={storeInfo.name}
                            fill
                            unoptimized
                            className="object-cover border-2 border-slate-100 rounded-md"
                        />
                    </div>
                )}

                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-semibold text-slate-800">
                        {storeInfo.name}
                    </h1>

                    <p className="text-sm text-slate-600 mt-2 max-w-lg">
                        {storeInfo.description}
                    </p>

                    <div className="space-y-2 text-sm text-slate-500 mt-4">
                        {storeInfo.address && (
                            <div className="flex items-center">
                                <MapPinIcon className="w-4 h-4 mr-2" />
                                <span>{storeInfo.address}</span>
                            </div>
                        )}

                        {storeInfo.email && (
                            <div className="flex items-center">
                                <MailIcon className="w-4 h-4 mr-2" />
                                <span>{storeInfo.email}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Products */}
            <div className="max-w-7xl mx-auto mb-40">

                <div className="mt-12">
                    <h2 className="text-2xl font-semibold text-slate-800">
                        Shop Products
                    </h2>

                    <p className="text-sm text-slate-500 mt-2">
                        Browse products by category
                    </p>
                </div>

                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto py-5 mt-2">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium border transition ${
                            selectedCategory === "All"
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-900"
                        }`}
                    >
                        All Products
                        <span className="ml-2 text-xs opacity-75">
                            {products.length}
                        </span>
                    </button>

                    {categories.map(category => {
                        const count = products.filter(
                            product => product.category?.trim() === category
                        ).length

                        return (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium border transition ${
                                    selectedCategory === category
                                        ? "bg-slate-900 text-white border-slate-900"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-900"
                                }`}
                            >
                                {category}
                                <span className="ml-2 text-xs opacity-75">
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Selected Category */}
                <div className="flex justify-between items-center mt-4 mb-5">
                    <h3 className="text-lg font-semibold text-slate-800">
                        {selectedCategory === "All"
                            ? "All Products"
                            : selectedCategory}
                    </h3>

                    <span className="text-sm text-slate-500">
                        {filteredProducts.length} Products
                    </span>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-slate-600 font-medium">
                            No products found in this category.
                        </p>

                        <p className="text-sm text-slate-400 mt-2">
                            Try selecting another category.
                        </p>

                        <button
                            onClick={() => setSelectedCategory("All")}
                            className="mt-5 px-5 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-700 transition"
                        >
                            View All Products
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
