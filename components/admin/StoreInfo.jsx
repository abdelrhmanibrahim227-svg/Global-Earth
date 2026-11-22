
'use client'

import Image from "next/image"
import { MapPin, Mail, Phone, Store, User } from "lucide-react"

const StoreInfo = ({ store }) => {
    const storeLogo = store?.logo?.trim()
    const userImage = store?.user?.image?.trim()

    const storeName = store?.name || "GLOBAL EARTH Store"
    const userName = store?.user?.name || "Store Owner"

    return (
        <div className="flex-1 space-y-2 text-sm">

            {/* Store Logo */}
            {storeLogo ? (
                <Image
                    width={100}
                    height={100}
                    src={storeLogo}
                    alt={storeName}
                    className="max-w-20 max-h-20 object-contain shadow rounded-full max-sm:mx-auto"
                />
            ) : (
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center shadow max-sm:mx-auto">
                    <Store size={32} className="text-slate-400" />
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <h3 className="text-xl font-semibold text-slate-800">
                    {storeName}
                </h3>

                <span className="text-sm">
                    @{store?.username || "store"}
                </span>

                <span
                    className={`text-xs font-semibold px-4 py-1 rounded-full ${
                        store?.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : store?.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                    }`}
                >
                    {store?.status || "unknown"}
                </span>
            </div>

            <p className="text-slate-600 my-5 max-w-2xl">
                {store?.description || "No store description available."}
            </p>

            <p className="flex items-center gap-2">
                <MapPin size={16} />
                {store?.address || "Address not provided"}
            </p>

            <p className="flex items-center gap-2">
                <Phone size={16} />
                {store?.contact || "Contact not provided"}
            </p>

            <p className="flex items-center gap-2">
                <Mail size={16} />
                {store?.email || "Email not provided"}
            </p>

            <p className="text-slate-700 mt-5">
                Applied on{" "}
                <span className="text-xs">
                    {store?.createdAt
                        ? new Date(store.createdAt).toLocaleDateString()
                        : "Unknown"}
                </span>
                {" "}by
            </p>

            {/* Store Owner */}
            <div className="flex items-center gap-2 text-sm">

                {userImage ? (
                    <Image
                        width={36}
                        height={36}
                        src={userImage}
                        alt={userName}
                        className="w-9 h-9 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                        <User size={18} className="text-slate-400" />
                    </div>
                )}

                <div>
                    <p className="text-slate-600 font-medium">
                        {userName}
                    </p>

                    <p className="text-slate-400">
                        {store?.user?.email || "No email available"}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default StoreInfo
