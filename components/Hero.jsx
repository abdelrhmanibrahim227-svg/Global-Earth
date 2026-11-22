
'use client'

import { useEffect, useState } from 'react'
import { assets } from '@/assets/assets'
import {
    ArrowRightIcon,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import CategoriesMarquee from './CategoriesMarquee'

const ads = [
    {
        id: 'main',
        image: '/images/global-earth-main-banner.png',
        alt: 'GLOBAL EARTH - Complete Technology Store',
    },
    {
        id: 'tech',
        image: '/images/Global Earth Tech Showcase .png',
        alt: 'GLOBAL EARTH - Technology and Electronics',
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

const Hero = () => {
    const [active, setActive] = useState(0)
    const [paused, setPaused] = useState(false)

    const next = () => {
        setActive(prev => (prev + 1) % ads.length)
    }

    const previous = () => {
        setActive(prev => (prev - 1 + ads.length) % ads.length)
    }

    useEffect(() => {
        if (paused) return

        const timer = setInterval(() => {
            setActive(prev => (prev + 1) % ads.length)
        }, 6000)

        return () => clearInterval(timer)
    }, [paused])

    return (
        <div className="bg-white">
            <div className="mx-4 sm:mx-6">
                <div className="mx-auto my-8 flex max-w-7xl flex-col gap-6 xl:flex-row">

                    {/* Main Advertising Slider */}
                    <section
                        className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-[#030a12] shadow-2xl shadow-cyan-950/20 sm:rounded-3xl"
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                        aria-label="GLOBAL EARTH advertising banners"
                    >
                        {/* Banner image area */}
                        <div className="relative aspect-[16/9] min-h-[210px] w-full overflow-hidden bg-[#030a12] sm:min-h-[300px] lg:min-h-[380px] xl:min-h-[420px]">

                            {/* Background glow */}
                            <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_50%,rgba(0,190,255,0.12),transparent_65%)]" />

                            {/* Sliding track */}
                            <div
                                className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
                                style={{
                                    transform: `translateX(-${active * 100}%)`,
                                }}
                                dir="ltr"
                            >
                                {ads.map((ad, index) => (
                                    <div
                                        key={ad.id}
                                        className="relative h-full min-w-full shrink-0 overflow-hidden bg-[#030a12]"
                                    >
                                        <Image
                                            src={ad.image}
                                            alt={ad.alt}
                                            fill
                                            priority={index === 0}
                                            sizes="(max-width: 1280px) 100vw, 70vw"
                                            quality={95}
                                            unoptimized
                                            className="z-[2] object-contain object-center"
                                        />

                                        {/* Subtle edge shading */}
                                        <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r from-black/10 via-transparent to-black/10" />

                                        {/* Clickable banner */}
                                        <Link
                                            href="/shop"
                                            aria-label={`Explore ${ad.alt}`}
                                            tabIndex={active === index ? 0 : -1}
                                            className="absolute inset-0 z-[5]"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Previous button */}
                            <button
                                type="button"
                                onClick={previous}
                                aria-label="Previous banner"
                                className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white shadow-lg backdrop-blur-md transition hover:border-cyan-300 hover:bg-cyan-400 hover:text-slate-950 sm:left-5 sm:h-12 sm:w-12"
                            >
                                <ChevronLeft size={23} />
                            </button>

                            {/* Next button */}
                            <button
                                type="button"
                                onClick={next}
                                aria-label="Next banner"
                                className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white shadow-lg backdrop-blur-md transition hover:border-cyan-300 hover:bg-cyan-400 hover:text-slate-950 sm:right-5 sm:h-12 sm:w-12"
                            >
                                <ChevronRight size={23} />
                            </button>

                            {/* Slide indicators */}
                            <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2 sm:bottom-5">
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
                                                : 'w-2 bg-white/60 hover:bg-white'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Slide counter */}
                            <div className="absolute bottom-3 left-4 z-20 hidden text-[10px] font-bold tracking-widest text-white/80 sm:block">
                                {String(active + 1).padStart(2, '0')} / {String(ads.length).padStart(2, '0')}
                            </div>
                        </div>
                    </section>

                    {/* Original promotional cards */}
                    <div className="flex w-full flex-col gap-5 text-slate-900 md:flex-row xl:max-w-sm xl:flex-col">

                        {/* First card */}
                        <Link
                            href="/shop"
                            className="group flex flex-1 items-center justify-between gap-3 overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-6 transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-100"
                        >
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-cyan-700">
                                    Explore
                                </p>

                                <h2 className="mt-2 max-w-40 text-2xl font-bold leading-tight text-slate-900">
                                    Discover Our Products
                                </h2>

                                <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-cyan-700">
                                    Shop Products
                                    <ArrowRightIcon
                                        size={17}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </p>
                            </div>

                            <Image
                                className="w-28 object-contain transition-transform duration-500 group-hover:scale-110 sm:w-32"
                                src={assets.hero_product_img1}
                                alt="Featured electronics"
                            />
                        </Link>

                        {/* Second card */}
                        <Link
                            href="/shop"
                            className="group flex flex-1 items-center justify-between gap-3 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-white p-6 transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl hover:shadow-slate-200"
                        >
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-cyan-700">
                                    Special Offers
                                </p>

                                <h2 className="mt-2 max-w-40 text-2xl font-bold leading-tight text-slate-900">
                                    Great Deals on Tech
                                </h2>

                                <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-cyan-700">
                                    View Offers
                                    <ArrowRightIcon
                                        size={17}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </p>
                            </div>

                            <Image
                                className="w-28 object-contain transition-transform duration-500 group-hover:scale-110 sm:w-32"
                                src={assets.hero_product_img2}
                                alt="Electronics special offers"
                            />
                        </Link>
                    </div>
                </div>

                {/* Categories */}
                <div className="mx-auto max-w-7xl">
                    <CategoriesMarquee />
                </div>
            </div>
        </div>
    )
}

export default Hero
