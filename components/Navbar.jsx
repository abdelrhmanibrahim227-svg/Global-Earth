
'use client'

import Image from "next/image"
import { useEffect, useState } from "react"
import {
    Search,
    ShoppingCart,
    UserRound,
    LogOut,
    Package,
    UserPlus,
    CircleUserRound,
    Menu,
    X,
    Home,
    Store,
    Info,
    Mail,
    ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"

const Navbar = () => {
    const router = useRouter()
    const pathname = usePathname()

    const [search, setSearch] = useState('')
    const [user, setUser] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)
    const [loggingOut, setLoggingOut] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const cartCount = useSelector(state => state.cart?.total ?? 0)

    useEffect(() => {
        let active = true

        async function loadUser() {
            try {
                const response = await fetch('/api/auth/me', {
                    cache: 'no-store',
                })

                if (response.status === 401) {
                    if (active) setUser(null)
                    return
                }

                const result = await response.json()

                if (!response.ok) {
                    throw new Error(result.message || 'Unable to load account')
                }

                if (active) setUser(result.user || null)

            } catch (error) {
                console.error('Account loading error:', error)
                if (active) setUser(null)

            } finally {
                if (active) setAuthLoading(false)
            }
        }

        loadUser()

        return () => {
            active = false
        }
    }, [])

    // Close mobile menu after navigation
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [pathname])

    const handleSearch = (e) => {
        e.preventDefault()

        const query = search.trim()
        if (!query) return

        setMobileMenuOpen(false)
        router.push(`/shop?search=${encodeURIComponent(query)}`)
    }

    const handleLogout = async () => {
        if (loggingOut) return

        setLoggingOut(true)

        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Logout failed')
            }

            setUser(null)
            setMobileMenuOpen(false)

            toast.success('Logged out successfully')

            router.push('/')
            router.refresh()

        } catch (error) {
            toast.error(error.message || 'Unable to logout')

        } finally {
            setLoggingOut(false)
        }
    }

    const navLinks = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/shop', label: 'Shop', icon: Store },
        { href: '/about', label: 'About', icon: Info },
        { href: '/contact', label: 'Contact', icon: Mail },
    ]

    const isActive = (href) => {
        if (href === '/') return pathname === '/'
        return pathname === href || pathname.startsWith(`${href}/`)
    }

    return (
        <nav className="relative z-50 bg-white shadow-sm">

            <div className="mx-auto max-w-7xl px-4 sm:px-6">

                <div className="flex min-h-[76px] items-center justify-between gap-3">

                    {/* Logo */}
                    <Link
                        href="/"
                        aria-label="GLOBAL EARTH Home"
                        className="flex shrink-0 items-center"
                    >
                        <Image
                            src="/logo-global-earth.png"
                            alt="GLOBAL EARTH"
                            width={80}
                            height={80}
                            priority
                            className="h-14 w-14 rounded-lg object-contain sm:h-16 sm:w-16"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-5 text-sm font-semibold text-slate-600 lg:flex">

                        {navLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`transition hover:text-cyan-600 ${
                                    isActive(item.href)
                                        ? 'font-bold text-cyan-600'
                                        : ''
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}

                    </div>

                    {/* Desktop Search */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden w-56 items-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm focus-within:ring-2 focus-within:ring-cyan-400 xl:flex 2xl:w-64"
                    >
                        <Search size={18} className="shrink-0 text-slate-500" />
                        <input
                            className="w-full bg-transparent outline-none"
                            type="search"
                            placeholder="Search products"
                            aria-label="Search products"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>

                    {/* Desktop Actions */}
                    <div className="hidden items-center gap-3 lg:flex">

                        <Link
                            href="/cart"
                            className="relative flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-cyan-600"
                        >
                            <ShoppingCart size={20} />
                            Cart

                            {Number(cartCount) > 0 && (
                                <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-600 px-1 text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {!authLoading && (
                            user ? (
                                <div className="flex items-center gap-2">

                                    <Link
                                        href="/account"
                                        className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-cyan-600"
                                    >
                                        <UserRound size={19} />
                                        <span className="max-w-24 truncate">
                                            {user.name}
                                        </span>
                                    </Link>

                                    <Link
                                        href="/orders"
                                        title="My Orders"
                                        className="rounded-lg p-2 text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-600"
                                    >
                                        <Package size={19} />
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        disabled={loggingOut}
                                        className="flex items-center gap-1 rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-red-600 disabled:opacity-60"
                                    >
                                        <LogOut size={16} />
                                        {loggingOut ? 'Logging out...' : 'Logout'}
                                    </button>

                                </div>
                            ) : (
                                <div className="flex items-center gap-2">

                                    <Link
                                        href="/login"
                                        className="rounded-full bg-slate-900 px-5 py-2.5 text-sm text-white transition hover:bg-cyan-600"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="flex items-center gap-1 rounded-full border border-cyan-600 px-4 py-2.5 text-sm text-cyan-700 transition hover:bg-cyan-50"
                                    >
                                        <UserPlus size={16} />
                                        Register
                                    </Link>

                                </div>
                            )
                        )}
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-4 lg:hidden">

                        <Link
                            href="/cart"
                            aria-label="Shopping cart"
                            className="relative rounded-lg p-2 text-slate-700 transition hover:bg-slate-100"
                        >
                            <ShoppingCart size={23} />

                            {Number(cartCount) > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-600 px-1 text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {!authLoading && user && (
                            <Link
                                href="/account"
                                aria-label="My Account"
                                className="rounded-lg p-2 text-cyan-700 transition hover:bg-cyan-50"
                            >
                                <UserRound size={23} />
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={mobileMenuOpen}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-800 transition hover:border-cyan-300 hover:bg-cyan-50"
                        >
                            {mobileMenuOpen
                                ? <X size={23} />
                                : <Menu size={23} />
                            }
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute left-0 right-0 top-full z-50 border-t border-slate-200 bg-white shadow-2xl lg:hidden">

                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

                        {/* Mobile Search */}
                        <form
                            onSubmit={handleSearch}
                            className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-cyan-400"
                        >
                            <Search size={19} className="text-slate-500" />
                            <input
                                type="search"
                                placeholder="Search products..."
                                aria-label="Search products"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                            />
                            <button
                                type="submit"
                                className="text-sm font-bold text-cyan-700"
                            >
                                Search
                            </button>
                        </form>

                        {/* Main Links */}
                        <div className="space-y-1">

                            {navLinks.map((item) => {
                                const Icon = item.icon
                                const active = isActive(item.href)

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center justify-between rounded-xl px-4 py-3.5 transition ${
                                            active
                                                ? 'bg-cyan-50 text-cyan-700'
                                                : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span className="flex items-center gap-3 font-semibold">
                                            <Icon size={20} />
                                            {item.label}
                                        </span>
                                        <ChevronRight size={18} className="text-slate-400" />
                                    </Link>
                                )
                            })}

                        </div>

                        <div className="my-4 border-t border-slate-100" />

                        {/* Account Links */}
                        {!authLoading && (
                            user ? (
                                <div className="space-y-2">

                                    <Link
                                        href="/account"
                                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <CircleUserRound size={20} />
                                        My Account
                                    </Link>

                                    <Link
                                        href="/orders"
                                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <Package size={20} />
                                        My Orders
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        disabled={loggingOut}
                                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                                    >
                                        <LogOut size={20} />
                                        {loggingOut ? 'Logging out...' : 'Logout'}
                                    </button>

                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">

                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-cyan-700"
                                    >
                                        <UserRound size={18} />
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="flex items-center justify-center gap-2 rounded-xl border border-cyan-600 px-4 py-3 font-semibold text-cyan-700 transition hover:bg-cyan-50"
                                    >
                                        <UserPlus size={18} />
                                        Register
                                    </Link>

                                </div>
                            )
                        )}

                        <div className="mt-5 rounded-xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-4">
                            <p className="text-sm font-bold text-slate-800">
                                GLOBAL EARTH
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Your destination for electronics and digital technology.
                            </p>
                        </div>

                    </div>
                </div>
            )}

            <hr className="border-slate-200" />

        </nav>
    )
}

export default Navbar
