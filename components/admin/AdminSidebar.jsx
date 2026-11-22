
'use client'

import Image from "next/image"
import { usePathname } from "next/navigation"
import {
    HomeIcon,
    ShieldCheckIcon,
    StoreIcon,
    TicketPercentIcon,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const AdminSidebar = () => {
    const pathname = usePathname()
    const [user, setUser] = useState(null)

    const sidebarLinks = [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        { name: 'Stores', href: '/admin/stores', icon: StoreIcon },
        { name: 'Approve Store', href: '/admin/approve', icon: ShieldCheckIcon },
        { name: 'Coupons', href: '/admin/coupons', icon: TicketPercentIcon },
    ]

    useEffect(() => {
        let isMounted = true

        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth/me', {
                    credentials: 'include',
                    cache: 'no-store',
                })

                const data = await response.json()

                if (response.ok && isMounted) {
                    setUser(data.user)
                }
            } catch (error) {
                console.error('Failed to load sidebar user:', error)
            }
        }

        fetchUser()

        return () => {
            isMounted = false
        }
    }, [])

    const roleName =
        user?.role === 'OWNER'
            ? 'Owner Account'
            : user?.role === 'ADMIN'
                ? 'Administrator'
                : 'Admin Panel'

    return (
        <aside className="inline-flex h-full flex-col gap-5 border-r border-slate-200 bg-white sm:min-w-60">

            {/* Official GLOBAL EARTH Logo */}
            <div className="flex flex-col gap-3 justify-center items-center pt-6 max-sm:hidden">

                <Link href="/admin" aria-label="GLOBAL EARTH Dashboard">
                    <Image
                        src="/logo-global-earth.png"
                        alt="GLOBAL EARTH"
                        width={180}
                        height={180}
                        priority
                        className="w-24 h-24 object-contain rounded-xl"
                    />
                </Link>

                <div className="text-center">
                    <p className="text-xs text-slate-400 mt-1">
                        Business Management
                    </p>
                </div>

                <div className="w-full px-4 mt-2 text-center">
                    <p className="text-sm font-semibold text-slate-700">
                        {user?.name || 'Loading...'}
                    </p>

                    <span className="inline-block mt-1 text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full">
                        {roleName}
                    </span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="max-sm:mt-6">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative flex items-center gap-3 p-3 text-slate-500 hover:bg-slate-50 transition ${
                                isActive ? 'bg-slate-100 text-slate-800' : ''
                            }`}
                        >
                            <link.icon size={18} className="sm:ml-5" />

                            <p className="max-sm:hidden text-sm">
                                {link.name}
                            </p>

                            {isActive && (
                                <span className="absolute bg-green-500 right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="mt-auto p-4 max-sm:hidden">
                <p className="text-xs text-center text-slate-400">
                    © {new Date().getFullYear()} GLOBAL EARTH
                </p>
            </div>

        </aside>
    )
}

export default AdminSidebar
