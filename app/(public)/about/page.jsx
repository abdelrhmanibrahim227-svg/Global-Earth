
'use client'

import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  Laptop,
  Smartphone,
  Camera,
  Printer,
  Monitor,
  Headphones,
  ShieldCheck,
  Award,
  Target,
  Eye,
  Heart,
  Zap,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  PackageCheck,
  Clock3,
  Cpu,
} from 'lucide-react'

const products = [
  { icon: Laptop, number: '01', title: 'Laptops', description: 'Powerful machines for professionals, creators and everyday productivity.' },
  { icon: Smartphone, number: '02', title: 'Smartphones', description: 'Discover the latest mobile technology and connected experiences.' },
  { icon: Camera, number: '03', title: 'Cameras', description: 'Capture every detail with advanced photography and imaging technology.' },
  { icon: Monitor, number: '04', title: 'Computer Systems', description: 'High-performance desktops, monitors and complete computing solutions.' },
  { icon: Printer, number: '05', title: 'Printers & Scanners', description: 'Reliable printing and scanning solutions for home and business.' },
  { icon: Headphones, number: '06', title: 'Accessories', description: 'Essential accessories to complete and enhance your digital lifestyle.' },
]

const values = [
  { icon: ShieldCheck, title: 'Trust & Transparency', description: 'We believe every great customer relationship starts with honesty, clarity and confidence.' },
  { icon: Award, title: 'Quality First', description: 'We focus on carefully selected technology products that meet your expectations.' },
  { icon: Heart, title: 'Customer Experience', description: 'Your satisfaction is at the heart of every interaction and every decision we make.' },
  { icon: Zap, title: 'Innovation', description: 'We continuously explore new technologies to bring you a smarter digital experience.' },
]

const stats = [
  { value: '01', label: 'A destination for technology' },
  { value: '360°', label: 'A wide electronics experience' },
  { value: '24/7', label: 'Online shopping access' },
]

const experiences = [
  { icon: ShoppingBag, title: 'Easy Shopping', text: 'A convenient online shopping experience.' },
  { icon: PackageCheck, title: 'Product Discovery', text: 'Explore electronics across multiple categories.' },
  { icon: ShieldCheck, title: 'Secure Experience', text: 'A shopping experience designed with care.' },
  { icon: Clock3, title: 'Anytime Access', text: 'Browse our online store whenever you need.' },
]

function SectionLabel({ children }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,.9)]" />
      <span className="text-[10px] font-bold uppercase tracking-[.25em] text-cyan-300 sm:text-xs">
        {children}
      </span>
    </div>
  )
}

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b12] text-white selection:bg-cyan-300 selection:text-[#06101b]">

      {/* Global background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-40 h-[550px] w-[550px] rounded-full bg-cyan-500/[0.10] blur-[140px]" />
        <div className="absolute -right-48 top-[850px] h-[550px] w-[550px] rounded-full bg-blue-600/[0.10] blur-[140px]" />
        <div className="absolute -bottom-20 left-1/3 h-[450px] w-[450px] rounded-full bg-indigo-600/[0.09] blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:pb-32 lg:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          <div className="relative z-10">
            <SectionLabel>About GLOBAL EARTH</SectionLabel>

            <h1 className="mt-8 max-w-3xl text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Technology
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Beyond Limits.
              </span>
              <span className="mt-2 block text-white/90">Connected to You.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Welcome to GLOBAL EARTH — your destination for modern electronics and digital technology.
              We bring together the devices, tools and solutions that power your everyday life.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-7 py-4 font-black text-[#06101b] shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-cyan-500/40"
              >
                Explore Products
                <ArrowUpRight size={19} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-4 font-bold text-white backdrop-blur-xl transition hover:border-cyan-400/40 hover:bg-white/[0.08]"
              >
                Contact Us <ArrowRight size={18} />
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-5 border-t border-white/10 pt-8">
              {stats.map((stat) => (
                <div key={stat.value}>
                  <div className="text-2xl font-black text-cyan-300 sm:text-3xl">{stat.value}</div>
                  <p className="mt-2 max-w-[130px] text-xs leading-5 text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-[550px]">
            <div className="absolute inset-10 rounded-full bg-cyan-400/10 blur-[100px]" />

            <div className="relative rounded-[32px] border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl sm:p-5">
              <div className="relative flex min-h-[410px] flex-col justify-between overflow-hidden rounded-[25px] border border-white/10 bg-[#0b1422] p-6 sm:p-8">

                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-cyan-400/20" />
                <div className="absolute -right-14 -top-14 h-52 w-52 rounded-full border border-cyan-400/20" />
                <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                      <Globe2 size={27} />
                    </div>
                    <div>
                      <p className="font-black tracking-wider">GLOBAL EARTH</p>
                      <p className="text-[9px] tracking-[.25em] text-cyan-300">TECHNOLOGY STORE</p>
                    </div>
                  </div>
                  <Sparkles className="text-cyan-300" size={23} />
                </div>

                <div className="relative z-10 py-12 text-center">
                  <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-full border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 to-blue-500/5 shadow-[0_0_80px_rgba(34,211,238,0.12)] sm:h-56 sm:w-56">
                    <div className="absolute inset-4 animate-[spin_35s_linear_infinite] rounded-full border border-dashed border-cyan-300/30" />
                    <div className="absolute inset-9 rounded-full border border-cyan-300/20" />
                    <Globe2 size={110} strokeWidth={0.8} className="text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.35)]" />
                    <div className="absolute -right-2 top-8 rounded-xl border border-white/10 bg-[#101d2e] p-3 shadow-xl">
                      <Laptop className="text-blue-300" size={24} />
                    </div>
                    <div className="absolute -bottom-1 -left-3 rounded-xl border border-white/10 bg-[#101d2e] p-3 shadow-xl">
                      <Smartphone className="text-cyan-300" size={24} />
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[.25em] text-slate-500">Our philosophy</p>
                    <p className="mt-2 text-lg font-bold">Technology for Everyone.</p>
                  </div>
                  <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                    <ArrowUpRight size={21} />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-3 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#101a29]/95 p-4 shadow-2xl backdrop-blur-xl sm:flex">
              <div className="rounded-xl bg-green-400/10 p-3 text-green-400"><ShieldCheck size={24} /></div>
              <div>
                <p className="text-sm font-bold">A Smarter Choice</p>
                <p className="mt-1 text-xs text-slate-500">Technology made accessible</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="relative border-y border-white/[0.07] bg-white/[0.025] py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionLabel>Who We Are</SectionLabel>
            <h2 className="mt-7 text-4xl font-black leading-tight sm:text-5xl">
              More Than a Store.
              <span className="mt-2 block text-slate-500">A Technology Destination.</span>
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-slate-400">
            <p>
              GLOBAL EARTH is an electronics-focused online destination built around one simple idea:
              making modern technology easier to discover and access.
            </p>
            <p>
              From laptops and smartphones to cameras, printers, computer systems and essential accessories,
              our goal is to bring a wide range of electronic products together in one convenient place.
            </p>
            <p>
              We believe technology should make life easier, work smarter and help people stay connected
              to the opportunities of the digital world.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 font-bold text-cyan-300 transition hover:text-white">
              Discover our collection <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>What We Offer</SectionLabel>
            <h2 className="mt-6 text-4xl font-black sm:text-5xl">
              Explore Our <span className="text-cyan-300">World.</span>
            </h2>
            <p className="mt-5 max-w-2xl leading-8 text-slate-400">
              Explore technology essentials and discover products designed for your personal,
              professional and business needs.
            </p>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:text-white">
            Shop all products <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const Icon = product.icon
            return (
              <Link
                href="/shop"
                key={product.number}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.07] to-white/[0.015] p-7 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-[0_20px_70px_rgba(6,182,212,0.09)]"
              >
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/[0.04] blur-3xl transition group-hover:bg-cyan-400/[0.12]" />
                <div className="relative flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300 transition group-hover:bg-cyan-300 group-hover:text-[#07101b]">
                    <Icon size={27} />
                  </div>
                  <span className="text-sm font-bold tracking-widest text-slate-600">{product.number}</span>
                </div>
                <h3 className="relative mt-8 text-xl font-bold">{product.title}</h3>
                <p className="relative mt-3 text-sm leading-7 text-slate-400">{product.description}</p>
                <div className="relative mt-7 flex items-center justify-between border-t border-white/10 pt-5 text-sm font-semibold text-cyan-300">
                  Explore category
                  <ArrowUpRight size={19} className="transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Mission and vision */}
      <section className="relative overflow-hidden border-y border-white/[0.07] bg-[#0a1220] py-24">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-14 text-center">
            <SectionLabel>Our Purpose</SectionLabel>
            <h2 className="mt-6 text-4xl font-black sm:text-5xl">
              Driven by a <span className="text-cyan-300">Vision.</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="group rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/[0.10] to-transparent p-8 transition hover:border-cyan-300/40 sm:p-11">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                <Target size={32} />
              </div>
              <h3 className="mt-8 text-2xl font-black">Our Mission</h3>
              <p className="mt-5 text-base leading-8 text-slate-400">
                To make modern electronics more accessible by offering a convenient digital shopping
                experience, a diverse product selection and a customer-focused approach.
              </p>
            </div>

            <div className="group rounded-3xl border border-blue-300/20 bg-gradient-to-br from-blue-400/[0.10] to-transparent p-8 transition hover:border-blue-300/40 sm:p-11">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-300/10 text-blue-300">
                <Eye size={32} />
              </div>
              <h3 className="mt-8 text-2xl font-black">Our Vision</h3>
              <p className="mt-5 text-base leading-8 text-slate-400">
                To become a trusted destination for electronics and digital solutions,
                connecting people with technology that supports a smarter and more connected future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <SectionLabel>What Matters To Us</SectionLabel>
          <h2 className="mt-6 text-4xl font-black sm:text-5xl">
            The Values Behind <span className="text-cyan-300">Everything.</span>
          </h2>
          <p className="mt-5 leading-8 text-slate-400">
            The principles that guide our approach to technology, products and customer experience.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.055] to-transparent p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.05]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300 transition group-hover:bg-cyan-300 group-hover:text-[#07101b]">
                  <Icon size={27} />
                </div>
                <h3 className="mt-7 text-lg font-bold">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">{item.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Experience */}
      <section className="relative border-y border-white/[0.07] bg-white/[0.025] py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionLabel>Your Experience</SectionLabel>
              <h2 className="mt-7 text-4xl font-black leading-tight sm:text-5xl">
                Shopping Technology,
                <span className="block text-cyan-300">Made Simpler.</span>
              </h2>
              <p className="mt-6 leading-8 text-slate-400">
                We aim to make discovering and shopping for electronics straightforward.
                Browse products, compare your options and place your order through one convenient online destination.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {experiences.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="group rounded-2xl border border-white/10 bg-[#0b1422]/90 p-6 transition hover:-translate-y-1 hover:border-cyan-300/30">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
                      <Icon size={25} />
                    </div>
                    <h3 className="mt-5 font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-cyan-300/20 bg-gradient-to-br from-[#10263a] via-[#0d1929] to-[#11152a] p-8 text-center shadow-[0_20px_100px_rgba(6,182,212,0.08)] sm:p-16">
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-[90px]" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[90px]" />

          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
              <Globe2 size={32} />
            </div>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              The Future Is Connected
            </p>
            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              Ready to Explore
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Something New?
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-8 text-slate-400">
              Discover the technology that fits your world.
              Explore GLOBAL EARTH and find your next electronic essential.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/shop" className="inline-flex items-center gap-3 rounded-xl bg-cyan-300 px-8 py-4 font-black text-[#07111d] transition hover:-translate-y-1 hover:bg-white">
                Start Shopping <ArrowUpRight size={19} />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-3 rounded-xl border border-white/20 px-8 py-4 font-bold transition hover:border-cyan-300 hover:text-cyan-300">
                Get in Touch <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
