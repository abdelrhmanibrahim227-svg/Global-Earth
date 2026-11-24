// components/AuthShell.jsx
import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react'

const perks = [
    { icon: BadgeCheck, title: '100% original products', text: 'Trusted brands, verified quality.' },
    { icon: Truck, title: 'Fast delivery in Egypt', text: 'Track every order from checkout to your door.' },
    { icon: Sparkles, title: 'VIP member perks', text: 'Early access to deals and new arrivals.' },
    { icon: ShieldCheck, title: 'Secure by design', text: 'Your data and payments stay protected.' },
]

export default function AuthShell({ title, subtitle, children, footer }) {
    return (
        <main className="grid min-h-[88vh] bg-white lg:grid-cols-[1.05fr_1fr]">
            <style>{`
                @keyframes ge-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-18px) } }
                @keyframes ge-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
                .ge-float { animation: ge-float 7s ease-in-out infinite }
                .ge-rise { animation: ge-rise .6s ease-out both }
                @media (prefers-reduced-motion: reduce) { .ge-float, .ge-rise { animation: none } }
            `}</style>

            {/* ===== Brand panel (desktop) ===== */}
            <aside className="relative hidden overflow-hidden bg-[#030a12] p-12 text-white lg:flex lg:flex-col lg:justify-between">
                <div className="ge-float pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-cyan-500/25 blur-[110px]" />
                <div
                    className="ge-float pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-sky-600/25 blur-[110px]"
                    style={{ animationDelay: '-3s' }}
                />
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />

                <Link href="/" className="relative inline-flex w-fit items-center gap-3" aria-label="GLOBAL EARTH home">
                    <Image
                        src="/logo-global-earth.png"
                        alt="GLOBAL EARTH"
                        width={64}
                        height={64}
                        className="h-14 w-14 rounded-xl object-contain"
                    />
                    <span className="text-xl font-extrabold tracking-wide">
                        GLOBAL <span className="text-cyan-400">EARTH</span>
                    </span>
                </Link>

                <div className="relative max-w-lg">
                    <h2 className="text-4xl font-extrabold leading-tight xl:text-5xl">
                        Your world of{' '}
                        <span className="bg-gradient-to-r from-cyan-300 to-sky-500 bg-clip-text text-transparent">
                            premium tech
                        </span>{' '}
                        starts here.
                    </h2>

                    <ul className="mt-10 space-y-5">
                        {perks.map(({ icon: Icon, title: t, text }, i) => (
                            <li
                                key={t}
                                className="ge-rise flex items-start gap-4"
                                style={{ animationDelay: `${0.15 * i + 0.2}s` }}
                            >
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                                    <Icon size={20} />
                                </span>
                                <div>
                                    <p className="font-semibold">{t}</p>
                                    <p className="text-sm text-slate-400">{text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative text-xs text-slate-500">
                    © 2026 GLOBAL EARTH. All rights reserved.
                </p>
            </aside>

            {/* ===== Form panel ===== */}
            <section className="flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 py-10 sm:px-8">
                <div className="ge-rise w-full max-w-md">
                    <Link
                        href="/"
                        className="mb-8 flex items-center justify-center gap-2 text-2xl font-extrabold text-slate-900 lg:hidden"
                    >
                        GLOBAL <span className="text-cyan-500">EARTH</span>
                    </Link>

                    <h1 className="text-3xl font-extrabold text-slate-900">{title}</h1>
                    <p className="mb-8 mt-2 text-sm text-slate-500">{subtitle}</p>

                    {children}

                    {footer && (
                        <p className="mt-8 text-center text-sm text-slate-500">{footer}</p>
                    )}
                </div>
            </section>
        </main>
    )
}
