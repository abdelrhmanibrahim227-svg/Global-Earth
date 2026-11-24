'use client'

// components/Navbar.jsx
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
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
    ChevronDown,
    Truck,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: Store },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Mail },
]

const Navbar = () => {
    const router = useRouter()
    const pathname = usePathname()

    const [search, setSearch] = useState('')
    const [user, setUser] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)
    const [loggingOut, setLoggingOut] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const userMenuRef = useRef(null)

    const cartCount = useSelector(state => state.cart?.total ?? 0)

    useEffect(() => {
        const controller = new AbortController()

        async function loadUser() {
            try {
                const response = await fetch('/api/auth/me', {
                    cache: 'no-store',
                    signal: controller.signal,
                })

                if (response.status === 401) {
                    setUser(null)
                    return
                }

                const result = await response.json()

                if (!response.ok) {
                    throw new Error(result.message || 'Unable to load account')
                }

                setUser(result.user || null)
            } catch (error) {
                if (error.name === 'AbortError') return
                console.error('Account loading error:', error)
                setUser(null)
            } finally {
                if (!controller.signal.aborted) setAuthLoading(false)
            }
        }

        loadUser()
        return () => controller.abort()
    }, [])

    // Close menus after navigation
    useEffect(() => {
        setMobileMenuOpen(false)
        setUserMenuOpen(false)
    }, [pathname])

    // Shadow once the page is scrolled
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close the user dropdown on outside click / Escape
    useEffect(() => {
        if (!userMenuOpen) return

        const onClick = e => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false)
            }
        }
        const onKey = e => e.key === 'Escape' && setUserMenuOpen(false)

        document.addEventListener('mousedown', onClick)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('mousedown', onClick)
            document.removeEventListener('keydown', onKey)
        }
    }, [userMenuOpen])

    const handleSearch = e => {
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
            const response = await fetch('/api/auth/logout', { method: 'POST' })
            const result = await response.json()

            if (!response.ok) throw new Error(result.message || 'Logout failed')

            setUser(null)
            setMobileMenuOpen(false)
            setUserMenuOpen(false)

            toast.success('Logged out successfully')

            router.push('/')
            router.refresh()
        } catch (error) {
            toast.error(error.message || 'Unable to logout')
        } finally {
            setLoggingOut(false)
        }
    }

    const isActive = href => {
        if (href === '/') return pathname === '/'
        return pathname === href || pathname.startsWith(`${href}/`)
    }

    const initial = (user?.name || '?').trim().charAt(0).toUpperCase()

    return (
        <>
            {/* Announcement strip */}
            <div className="bg-cyan-400 px-4 py-2 text-center text-xs font-semibold text-slate-950">
                <span className="inline-flex items-center gap-2">
                    <Truck size={14} />
                    Free delivery across Egypt · Cash on delivery available
                </span>
            </div>

            <nav
                className={`sticky top-0 z-50 border-b border-white/10 bg-[#030a12]/90 backdrop-blur-xl transition-shadow ${
                    scrolled ? 'shadow-xl shadow-black/30' : ''
                }`}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="flex h-[72px] items-center justify-between gap-4">
                        {/* Logo */}
                        <Link
                            href="/"
                            aria-label="GLOBAL EARTH Home"
                            className="flex shrink-0 items-center gap-3"
                        >
                            <Image
                                src="/logo-global-earth.png"
                                alt="GLOBAL EARTH"
                                width={80}
                                height={80}
                                priority
                                className="h-12 w-12 rounded-xl object-contain"
                            />
                            <span className="hidden text-lg font-extrabold tracking-wide text-white sm:block">
                                GLOBAL <span className="text-cyan-400">EARTH</span>
                            </span>
                        </Link>

                        {/* Desktop links */}
                        <div className="hidden items-center gap-1 lg:flex">
                            {navLinks.map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        isActive(item.href)
                                            ? 'bg-white/10 text-cyan-300'
                                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop search */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden max-w-sm flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white transition focus-within:border-cyan-400 focus-within:bg-white/15 xl:flex"
                        >
                            <Search size={18} className="shrink-0 text-slate-400" />
                            <input
                                className="w-full bg-transparent outline-none placeholder:text-slate-400"
                                type="search"
                                placeholder="Search products..."
                                aria-label="Search products"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </form>

                        {/* Desktop actions */}
                        <div className="hidden items-center gap-3 lg:flex">
                            <Link
                                href="/cart"
                                aria-label="Shopping cart"
                                className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-cyan-400 hover:text-slate-950"
                            >
                                <ShoppingCart size={20} />
                                {Number(cartCount) > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#030a12]">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {!authLoading &&
                                (user ? (
                                    <div className="relative" ref={userMenuRef}>
                                        <button
                                            type="button"
                                            onClick={() => setUserMenuOpen(o => !o)}
                                            aria-expanded={userMenuOpen}
                                            aria-haspopup="menu"
                                            className="flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-white transition hover:bg-white/15"
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
                                                {initial}
                                            </span>
                                            <span className="max-w-24 truncate">{user.name}</span>
                                            <ChevronDown
                                                size={16}
                                                className={`transition ${userMenuOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {userMenuOpen && (
                                            <div
                                                role="menu"
                                                className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
                                            >
                                                <div className="border-b border-slate-100 px-5 py-4">
                                                    <p className="truncate font-bold text-slate-900">
                                                        {user.name}
                                                    </p>
                                                    <p className="truncate text-xs text-slate-500">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <div className="p-2 text-sm font-medium text-slate-700">
                                                    <Link
                                                        href="/account"
                                                        role="menuitem"
                                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50"
                                                    >
                                                        <CircleUserRound size={18} /> My Account
                                                    </Link>
                                                    <Link
                                                        href="/orders"
                                                        role="menuitem"
                                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50"
                                                    >
                                                        <Package size={18} /> My Orders
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        role="menuitem"
                                                        onClick={handleLogout}
                                                        disabled={loggingOut}
                                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                                                    >
                                                        <LogOut size={18} />
                                                        {loggingOut ? 'Logging out...' : 'Logout'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href="/login"
                                            className="rounded-full px-4 py-2.5 text-sm font-semibold text-white transition hover:text-cyan-300"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="flex items-center gap-1.5 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                                        >
                                            <UserPlus size={16} />
                                            Register
                                        </Link>
                                    </div>
                                ))}
                        </div>

                        {/* Mobile actions */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <Link
                                href="/cart"
                                aria-label="Shopping cart"
                                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
                            >
                                <ShoppingCart size={20} />
                                {Number(cartCount) > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#030a12]">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(o => !o)}
                                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                                aria-expanded={mobileMenuOpen}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-cyan-400 hover:text-slate-950"
                            >
                                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="absolute left-0 right-0 top-full max-h-[calc(100vh-72px)] overflow-y-auto border-t border-white/10 bg-[#030a12] shadow-2xl lg:hidden">
                        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
                            <form
                                onSubmit={handleSearch}
                                className="mb-5 flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-white focus-within:border-cyan-400"
                            >
                                <Search size={19} className="text-slate-400" />
                                <input
                                    type="search"
                                    placeholder="Search products..."
                                    aria-label="Search products"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                                />
                                <button type="submit" className="text-sm font-bold text-cyan-300">
                                    Go
                                </button>
                            </form>

                            <div className="space-y-1">
                                {navLinks.map(item => {
                                    const Icon = item.icon
                                    const active = isActive(item.href)

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center justify-between rounded-2xl px-4 py-3.5 transition ${
                                                active
                                                    ? 'bg-white/10 text-cyan-300'
                                                    : 'text-slate-200 hover:bg-white/5'
                                            }`}
                                        >
                                            <span className="flex items-center gap-3 font-semibold">
                                                <Icon size={20} />
                                                {item.label}
                                            </span>
                                            <ChevronRight size={18} className="text-slate-500" />
                                        </Link>
                                    )
                                })}
                            </div>

                            <div className="my-4 border-t border-white/10" />

                            {!authLoading &&
                                (user ? (
                                    <div className="space-y-1">
                                        <div className="mb-2 flex items-center gap-3 px-4 py-2">
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
                                                {initial}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate font-bold text-white">{user.name}</p>
                                                <p className="truncate text-xs text-slate-400">{user.email}</p>
                                            </div>
                                        </div>

                                        <Link
                                            href="/account"
                                            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-200 transition hover:bg-white/5"
                                        >
                                            <CircleUserRound size={20} /> My Account
                                        </Link>
                                        <Link
                                            href="/orders"
                                            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-200 transition hover:bg-white/5"
                                        >
                                            <Package size={20} /> My Orders
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            disabled={loggingOut}
                                            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-semibold text-rose-400 transition hover:bg-rose-500/10 disabled:opacity-60"
                                        >
                                            <LogOut size={20} />
                                            {loggingOut ? 'Logging out...' : 'Logout'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/login"
                                            className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-3 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
                                        >
                                            <UserRound size={18} />
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
                                        >
                                            <UserPlus size={18} />
                                            Register
                                        </Link>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </nav>
        </>
    )
}

export default Navbar
