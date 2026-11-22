
'use client'

import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminStores() {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState(null)

    const fetchStores = async () => {
        try {
            const response = await fetch("/api/admin/stores", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Unable to load stores")
            }

            setStores(data.stores || [])

        } catch (error) {
            console.error("Fetch stores error:", error)
            toast.error(error.message || "Unable to load stores")
        } finally {
            setLoading(false)
        }
    }

    const toggleIsActive = async (storeId) => {
        if (processingId !== null) return

        setProcessingId(storeId)

        try {
            const response = await fetch("/api/admin/stores", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ storeId }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Unable to update store")
            }

            setStores((currentStores) =>
                currentStores.map((store) =>
                    store.id === storeId
                        ? { ...store, isActive: data.store.isActive }
                        : store
                )
            )

            toast.success(data.message)

        } catch (error) {
            console.error("Toggle store error:", error)
            toast.error(error.message || "Unable to update store")
        } finally {
            setProcessingId(null)
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">
                Live <span className="text-slate-800 font-medium">Stores</span>
            </h1>

            {stores.length > 0 ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div
                            key={store.id}
                            className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl"
                        >
                            <StoreInfo store={store} />

                            <div className="flex items-center gap-3 pt-2 flex-wrap">
                                <p>
                                    {store.isActive ? "Active" : "Inactive"}
                                </p>

                                <label className={`relative inline-flex items-center text-gray-900 ${
                                    processingId === store.id
                                        ? "opacity-50 cursor-not-allowed"
                                        : "cursor-pointer"
                                }`}>
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={Boolean(store.isActive)}
                                        disabled={processingId !== null}
                                        onChange={() => toggleIsActive(store.id)}
                                    />

                                    <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>

                                    <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">
                        No stores Available
                    </h1>
                </div>
            )}
        </div>
    )
}
