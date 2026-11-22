
'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const AdminNavbar = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        let isMounted = true

        const fetchUser = async () => {
            try {
                const response = await fetch("/api/auth/me", {
                    credentials: "include",
                    cache: "no-store",
                })

                const data = await response.json()

                if (response.ok && isMounted) {
                    setUser(data.user)
                }
            } catch (error) {
                console.error("Failed to load admin user:", error)
            }
        }

        fetchUser()

        return () => {
            isMounted = false
        }
    }, [])

    return (
        <header className="flex items-center justify-between px-4 md:px-12 py-3 border-b border-slate-200 bg-white">

            {/* Official GLOBAL EARTH Logo */}
            <Link
                href="/admin"
                className="relative flex items-center"
                aria-label="GLOBAL EARTH Admin Dashboard"
            >
                <Image
                    src="/logo-global-earth.png"
                    alt="GLOBAL EARTH"
                    width={75}
                    height={75}
                    priority
                    className="w-[58px] h-[58px] md:w-[68px] md:h-[68px] object-contain rounded-lg"
                />

                <span className="absolute -top-1 -right-5 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white bg-green-600">
                    ADMIN
                </span>
            </Link>

            {/* User Information */}
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">
                        {user?.name || "Admin"}
                    </p>

                    <p className="text-xs text-slate-500">
                        {user?.role === "OWNER"
                            ? "Owner Account"
                            : user?.role === "ADMIN"
                            ? "Administrator"
                            : "Admin Panel"}
                    </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
            </div>

        </header>
    )
}

export default AdminNavbar