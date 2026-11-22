
'use client'

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"

export default function CreateStore() {
    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: ""
    })

    const onChangeHandler = (e) => {
        setStoreInfo(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const fetchSellerStatus = async () => {
        try {
            const response = await fetch("/api/store", {
                cache: "no-store"
            })

            const data = await response.json()

            if (response.status === 403) {
                setMessage("Please log in with the store owner account.")
                return
            }

            if (!response.ok) {
                throw new Error(data.message || "Failed to check store status")
            }

            if (data.store) {
                setAlreadySubmitted(true)
                setStatus(data.store.status)

                if (data.store.status === "approved") {
                    setMessage("Your store has been approved!")
                } else {
                    setMessage("Your store is waiting for admin approval.")
                }
            }
        } catch (error) {
            console.error("Fetch store error:", error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch("/api/store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: storeInfo.name,
                    username: storeInfo.username,
                    description: storeInfo.description,
                    email: storeInfo.email,
                    contact: storeInfo.contact,
                    address: storeInfo.address,
                    logo: ""
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to submit store")
            }

            setAlreadySubmitted(true)
            setStatus(data.store.status)
            setMessage("Your store has been submitted and is waiting for admin approval.")

            toast.success("Store submitted successfully!")
        } catch (error) {
            console.error("Submit store error:", error)
            toast.error(error.message || "Something went wrong")
        }
    }

    useEffect(() => {
        fetchSellerStatus()
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <>
            {!alreadySubmitted ? (
                <div className="mx-6 min-h-[70vh] my-16">
                    <form
                        onSubmit={onSubmitHandler}
                        className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500"
                    >
                        <div>
                            <h1 className="text-3xl">
                                Add Your{" "}
                                <span className="text-slate-800 font-medium">
                                    Store
                                </span>
                            </h1>

                            <p className="max-w-lg">
                                Submit your store details to create your Global Earth store.
                            </p>
                        </div>

                        <p className="mt-6">Username</p>
                        <input
                            name="username"
                            onChange={onChangeHandler}
                            value={storeInfo.username}
                            type="text"
                            placeholder="Enter your store username"
                            className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
                            required
                        />

                        <p>Store Name</p>
                        <input
                            name="name"
                            onChange={onChangeHandler}
                            value={storeInfo.name}
                            type="text"
                            placeholder="Enter your store name"
                            className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
                            required
                        />

                        <p>Description</p>
                        <textarea
                            name="description"
                            onChange={onChangeHandler}
                            value={storeInfo.description}
                            rows={5}
                            placeholder="Enter your store description"
                            className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none"
                            required
                        />

                        <p>Email</p>
                        <input
                            name="email"
                            onChange={onChangeHandler}
                            value={storeInfo.email}
                            type="email"
                            placeholder="Enter your store email"
                            className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
                            required
                        />

                        <p>Contact Number</p>
                        <input
                            name="contact"
                            onChange={onChangeHandler}
                            value={storeInfo.contact}
                            type="text"
                            placeholder="Enter your store contact number"
                            className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
                            required
                        />

                        <p>Address</p>
                        <textarea
                            name="address"
                            onChange={onChangeHandler}
                            value={storeInfo.address}
                            rows={4}
                            placeholder="Enter your store address"
                            className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none"
                            required
                        />

                        <button
                            type="submit"
                            className="bg-slate-800 text-white px-12 py-2 rounded mt-6 mb-20 active:scale-95 hover:bg-slate-900 transition"
                        >
                            Create Store
                        </button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center">
                    <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">
                        {message}
                    </p>

                    {status === "approved" && (
                        <p className="mt-5 text-slate-400">
                            Your store is approved.
                        </p>
                    )}
                </div>
            )}

            {!alreadySubmitted && message && (
                <p className="text-center text-red-500 mb-6">{message}</p>
            )}
        </>
    )
}
