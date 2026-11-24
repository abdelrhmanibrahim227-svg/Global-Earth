'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { assets } from '@/assets/assets'
import {
    ArrowRightIcon,
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    Truck,
    ShieldCheck,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import CategoriesMarquee from './CategoriesMarquee'

// NOTE: the old 'Global Earth Tech Showcase .png' (name with a trailing space)
// was removed: it duplicated the encoded one below and breaks on many servers.
// Rename your files to kebab-case (e.g. global-earth-tech-showcase.png).
const ads = [
    {
        id: 'main',
        image: '/images/global-earth-main-banner.png',
        alt: 'GLOBAL EARTH - Complete Technology Store',
    },
    {
        id: 'offers',
        image: '/images/global-earth-offers-banner.png',
        alt: 'GLOBAL EARTH - Special Offers',
    },
    {
        id: 'showcase',
        image: '/images/Global%20Earth%20Tech%20Showcase.png',
        alt: 'GLOBAL EARTH - Tech Showcase',
    },
]

const AUTOPLAY_MS = 6000

const Hero = () => {
    const [active, setActive] = useState(0)
    const [paused, setPaused] = useState(false)
    const [reducedMotion, setReducedMotion] = useState(false)
    const touchStartX = useRef(null)

    const next = useCallback(
        () => setActive(prev => (prev + 1) % ads.length),
        []
    )
    const previous = useCallback(
        () => setActive(prev => (prev - 1 + ads.length) % ads.length),
        []
    )

    // Respect the user's "reduce motion" setting
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        setReducedMotion(mq.matches)
    }, [])

    // Autoplay: stops on hover, when the tab is hidden, or with reduced motion
    useEffect(() => {
        if (paused || reducedMotion) return

        const timer = setInterval(() => {
            if (!document.hidden) next()
        }, AUTOPLAY_MS)

        return () => clearInterval(timer)
    }, [paused, reducedMotion, next])

    // Swipe support for phones
    const onTouchStart = e => {
        touchStartX.current = e.touches[0].clientX
    }
    const onTouchEnd = e => {
        if (touchStartX.current === null) return
        const diff = e.changedTouches[0].clientX - touchStartX.current
        if (Math.abs(diff) > 50) {
            diff < 0 ? next() : previous()
        }
        touchStartX.current = null
    }

    const onKeyDown = e => {
        if (e.key === 'ArrowRight') next()
        if (e.key === 'ArrowLeft') previous()
    }

    return (
        <div className="bg-white">
            {/* ========== DARK BRAND HERO ========== */}
            <section className="relative overflow-hidden bg-[#030a12] text-white">
                {/* Ambient glows */}
                <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />
                <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-sky-600/20 blur-[120px]" />
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />

                <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:py-16">
                    {/* ----- Text side ----- */}
                    <div className="text-center lg:text-left">
                        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-300">
                            <BadgeCheck size={14} />
                            Authentic Tech · Worldwide Standard
                        </span>

                        <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl xl:text-6xl">
                            The Future of Tech,{' '}
                            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-500 bg-clip-text text-transparent">
                                Delivered to Your Door
                            </span>
                        </h1>

                        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg lg:mx-0">
                            Premium electronics from the world&apos;s leading brands.
                            100% original products, secure payment and fast
                            delivery across Egypt.
                        </p>

                        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                            <Link
                                href="/shop"
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-300 hover:shadow-cyan-400/50 sm:w-auto"
                            >
                                Shop Now
                                <ArrowRightIcon
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                            <Link
                                href="/shop"
                                className="inline-flex w-full items-center justify-center rounded-full border border-white/25 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-300 sm:w-auto"
                            >
                                View Deals
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-300 lg:justify-start">
                            <span className="flex items-center gap-2">
                                <ShieldCheck size={18} className="text-cyan-400" />
                                Official Warranty
                            </span>
                            <span className="flex items-center gap-2">
                                <Truck size={18} className="text-cyan-400" />
                                Fast Delivery
                            </span>
                        </div>
                    </div>

                    {/* ----- Slider side ----- */}
                    <div
                        className="relative"
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                        onKeyDown={onKeyDown}
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="GLOBAL EARTH advertising banners"
                    >
                        <div
                            className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#050f1a] shadow-2xl shadow-cyan-950/40"
                            onTouchStart={onTouchStart}
                            onTouchEnd={onTouchEnd}
                        >
                            <div
                                className="absolute inset-0 flex transition-transform duration-700 ease-out will-change-transform"
                                style={{ transform: `translateX(-${active * 100}%)` }}
                                dir="ltr"
                            >
                                {ads.map((ad, index) => (
                                    <div
                                        key={ad.id}
                                        className="relative h-full min-w-full shrink-0"
                                        aria-hidden={active !== index}
                                    >
                                        <Image
                                            src={ad.image}
                                            alt={ad.alt}
                                            fill
                                            priority={index === 0}
                                            loading={index === 0 ? 'eager' : 'lazy'}
                                            sizes="(max-width: 1024px) 100vw, 55vw"
                                            quality={80}
                                            className="object-contain object-center"
                                        />
                                        <Link
                                            href="/shop"
                                            aria-label={`Explore ${ad.alt}`}
                                            tabIndex={active === index ? 0 : -1}
                                            className="absolute inset-0 z-[5]"
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={previous}
                                aria-label="Previous banner"
                                className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-md transition hover:border-cyan-300 hover:bg-cyan-400 hover:text-slate-950 sm:left-4 sm:h-11 sm:w-11"
                            >
                                <ChevronLeft size={22} />
                            </button>
                            <button
                                type="button"
                                onClick={next}
                                aria-label="Next banner"
                                className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-md transition hover:border-cyan-300 hover:bg-cyan-400 hover:text-slate-950 sm:right-4 sm:h-11 sm:w-11"
                            >
                                <ChevronRight size={22} />
                            </button>

                            <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
                                {ads.map((ad, index) => (
                                    <button
                                        key={ad.id}
                                        type="button"
                                        onClick={() => setActive(index)}
                                        aria-label={`Show banner ${index + 1}`}
                                        aria-current={active === index}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            active === index
                                                ? 'w-8 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]'
                                                : 'w-2 bg-white/50 hover:bg-white'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ----- Promo cards ----- */}
                <div className="relative mx-auto grid max-w-7xl gap-4 px-4 pb-10 sm:px-6 md:grid-cols-2">
                    <PromoCard
                        eyebrow="Explore"
                        title="Discover Our Products"
                        cta="Shop Products"
                        image={assets.hero_product_img1}
                        alt="Featured electronics"
                    />
                    <PromoCard
                        eyebrow="Special Offers"
                        title="Great Deals on Tech"
                        cta="View Offers"
                        image={assets.hero_product_img2}
                        alt="Electronics special offers"
                    />
                </div>
            </section>

            {/* ========== CATEGORIES ========== */}
            <div className="mx-4 sm:mx-6">
                <div className="mx-auto max-w-7xl">
                    <CategoriesMarquee />
                </div>
            </div>
        </div>
    )
}

const PromoCard = ({ eyebrow, title, cta, image, alt }) => (
    <Link
        href="/shop"
        className="group flex items-center justify-between gap-4 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-400/60 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-cyan-950/50"
    >
        <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                {eyebrow}
            </p>
            <h2 className="mt-2 max-w-48 text-2xl font-bold leading-tight text-white">
                {title}
            </h2>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-cyan-300">
                {cta}
                <ArrowRightIcon
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                />
            </p>
        </div>
        <Image
            className="w-28 object-contain transition-transform duration-500 group-hover:scale-110 sm:w-32"
            src={image}
            alt={alt}
        />
    </Link>
)

export default Hero
