
'use client'

import { useEffect, useState } from "react"
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import toast from "react-hot-toast"

export default function AdminApprove() {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState(null)

    const fetchStores = async () => {
        try {
            const response = await fetch("/api/admin/stores/approve", {
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

    const handleApprove = async ({ storeId, status }) => {
        setProcessingId(storeId)

        try {
            const response = await fetch("/api/admin/stores/approve", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ storeId, status }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Operation failed")
            }

            setStores((currentStores) =>
                currentStores.filter((store) => store.id !== storeId)
            )

            toast.success(data.message)
        } catch (error) {
            console.error("Store approval error:", error)
            toast.error(error.message || "Operation failed")
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
                Approve <span className="text-slate-800 font-medium">Stores</span>
            </h1>

            {stores.length > 0 ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div
                            key={store.id}
                            className="bg-white border rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl"
                        >
                            <StoreInfo store={store} />

                            <div className="flex gap-3 pt-2 flex-wrap">
                                <button
                                    onClick={() =>
                                        handleApprove({
                                            storeId: store.id,
                                            status: "approved",
                                        })
                                    }
                                    disabled={processingId !== null}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processingId === store.id ? "Please wait..." : "Approve"}
                                </button>

                                <button
                                    onClick={() =>
                                        handleApprove({
                                            storeId: store.id,
                                            status: "rejected",
                                        })
                                    }
                                    disabled={processingId !== null}
                                    className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-80">
                    <h1 className="text-3xl text-slate-400 font-medium">
                        No Application Pending
                    </h1>
                </div>
            )}
        </div>
    )
}
