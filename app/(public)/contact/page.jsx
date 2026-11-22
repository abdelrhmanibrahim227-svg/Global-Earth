
'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
    ArrowUpRight,
    MessageCircle,
    Facebook,
    Mail,
    Phone,
    Send,
    Headphones,
    ShieldCheck,
    Zap,
    Globe2,
    CheckCircle2,
    Sparkles,
    Clock3,
    MapPin,
} from 'lucide-react'
import { useLanguage } from '@/app/LanguageProvider'

const WHATSAPP_NUMBER = '201557040056'
const FACEBOOK_URL = 'https://www.facebook.com/share/14ugMrzCBHp/'
const EMAIL = 'globale280@gmail.com'
const PHONE = '01557040056'

export default function ContactPage() {
    const { direction } = useLanguage()
    const isArabic = direction === 'rtl'

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'purchase',
        message: '',
    })

    const [sent, setSent] = useState(false)

    const content = {
        eyebrow: isArabic ? 'نحن هنا لمساعدتك' : 'WE ARE HERE TO HELP',
        title: isArabic
            ? 'دعنا نبدأ'
            : "LET'S START",
        titleAccent: isArabic
            ? 'المحادثة.'
            : 'A CONVERSATION.',
        description: isArabic
            ? 'سواء كنت تبحث عن جهاز جديد، أو تحتاج إلى عرض سعر، أو لديك استفسار عن منتجاتنا، فريق GLOBAL EARTH جاهز لمساعدتك.'
            : 'Whether you are looking for your next device, need a quotation, or have a question about our products, the GLOBAL EARTH team is ready to help.',
        response: isArabic ? 'نحن على بُعد رسالة واحدة منك' : 'JUST ONE MESSAGE AWAY',
        contactTitle: isArabic ? 'تواصل معنا مباشرة' : 'GET IN TOUCH',
        contactDescription: isArabic
            ? 'اختر وسيلة التواصل المناسبة لك وسنكون سعداء بخدمتك.'
            : 'Choose your preferred way to reach us. We would love to hear from you.',
        whatsapp: isArabic ? 'واتساب' : 'WhatsApp',
        whatsappDesc: isArabic ? 'تحدث معنا مباشرة' : 'Chat with our team directly',
        facebook: isArabic ? 'فيسبوك' : 'Facebook',
        facebookDesc: isArabic ? 'تابع صفحتنا وتواصل معنا' : 'Connect with us on Facebook',
        email: isArabic ? 'البريد الإلكتروني' : 'Email',
        emailDesc: isArabic ? 'أرسل لنا استفسارك' : 'Send us your inquiry',
        phone: isArabic ? 'رقم الهاتف' : 'Phone',
        phoneDesc: isArabic ? 'اتصل بنا مباشرة' : 'Give us a call',
        formLabel: isArabic ? 'أرسل لنا رسالة' : 'SEND US A MESSAGE',
        formTitle: isArabic ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?',
        formDescription: isArabic
            ? 'املأ البيانات التالية وسنفتح لك محادثة واتساب برسالتك جاهزة للإرسال.'
            : 'Fill in the details below and we will prepare your message in WhatsApp.',
        name: isArabic ? 'الاسم بالكامل' : 'Full Name',
        emailField: isArabic ? 'البريد الإلكتروني' : 'Email Address',
        phoneField: isArabic ? 'رقم الهاتف' : 'Phone Number',
        subject: isArabic ? 'نوع الاستفسار' : 'Inquiry Type',
        message: isArabic ? 'اكتب رسالتك هنا...' : 'Write your message here...',
        namePlaceholder: isArabic ? 'اكتب اسمك' : 'Enter your name',
        emailPlaceholder: isArabic ? 'example@email.com' : 'example@email.com',
        phonePlaceholder: isArabic ? 'رقم هاتفك' : 'Your phone number',
        purchase: isArabic ? 'شراء منتجات' : 'Product Purchase',
        quotation: isArabic ? 'طلب عرض سعر' : 'Request a Quotation',
        support: isArabic ? 'الدعم الفني' : 'Technical Support',
        partnership: isArabic ? 'شراكة تجارية' : 'Business Partnership',
        other: isArabic ? 'استفسار آخر' : 'Other Inquiry',
        send: isArabic ? 'إرسال عبر واتساب' : 'SEND VIA WHATSAPP',
        note: isArabic
            ? 'سيتم فتح واتساب لتأكيد وإرسال رسالتك.'
            : 'WhatsApp will open so you can review and send your message.',
        why: isArabic ? 'لماذا GLOBAL EARTH؟' : 'WHY GLOBAL EARTH?',
        whyTitle: isArabic
            ? 'تجربة تقنية تستحق ثقتك.'
            : 'Technology you can trust.',
        whyDesc: isArabic
            ? 'نؤمن أن التكنولوجيا الجيدة تبدأ بمنتج مناسب وخدمة تهتم بتفاصيل تجربتك.'
            : 'We believe great technology starts with the right product and a service that cares about your experience.',
        supportTitle: isArabic ? 'دعم يهتم بك' : 'Customer First',
        supportDesc: isArabic ? 'نستمع إلى احتياجاتك ونساعدك في اختيار الأنسب.' : 'We listen and help you find what fits your needs.',
        qualityTitle: isArabic ? 'جودة واهتمام' : 'Quality Matters',
        qualityDesc: isArabic ? 'نهتم بتقديم تجربة شراء واضحة ومريحة.' : 'A clear and convenient shopping experience.',
        fastTitle: isArabic ? 'تواصل سريع' : 'Quick Communication',
        fastDesc: isArabic ? 'طرق تواصل مباشرة وسهلة.' : 'Simple and direct ways to reach us.',
        location: isArabic ? 'الموقع' : 'LOCATION',
        egypt: isArabic ? 'مصر' : 'Egypt',
        availability: isArabic ? 'يسعدنا استقبال استفساراتك' : 'WE WOULD LOVE TO HEAR FROM YOU',
        success: isArabic ? 'تم تجهيز رسالتك، أكمل الإرسال من واتساب.' : 'Your message is ready. Complete sending it in WhatsApp.',
    }

    const updateField = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
        setSent(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
            return
        }

        const subjectLabels = {
            purchase: content.purchase,
            quotation: content.quotation,
            support: content.support,
            partnership: content.partnership,
            other: content.other,
        }

        const message = [
            'GLOBAL EARTH - Contact Request',
            '------------------------------',
            `${content.name}: ${form.name}`,
            `${content.phoneField}: ${form.phone}`,
            `${content.emailField}: ${form.email || '-'}`,
            `${content.subject}: ${subjectLabels[form.subject]}`,
            `${content.message}: ${form.message}`,
        ].join('\n')

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

        setSent(true)
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    }

    const contactCards = [
        {
            icon: MessageCircle,
            title: content.whatsapp,
            description: content.whatsappDesc,
            value: PHONE,
            href: `https://wa.me/${WHATSAPP_NUMBER}`,
            color: 'green',
            external: true,
        },
        {
            icon: Facebook,
            title: content.facebook,
            description: content.facebookDesc,
            value: 'GLOBAL EARTH',
            href: FACEBOOK_URL,
            color: 'blue',
            external: true,
        },
        {
            icon: Mail,
            title: content.email,
            description: content.emailDesc,
            value: EMAIL,
            href: `mailto:${EMAIL}`,
            color: 'cyan',
        },
        {
            icon: Phone,
            title: content.phone,
            description: content.phoneDesc,
            value: PHONE,
            href: `tel:${PHONE}`,
            color: 'purple',
        },
    ]

    const features = [
        {
            icon: Headphones,
            title: content.supportTitle,
            description: content.supportDesc,
        },
        {
            icon: ShieldCheck,
            title: content.qualityTitle,
            description: content.qualityDesc,
        },
        {
            icon: Zap,
            title: content.fastTitle,
            description: content.fastDesc,
        },
    ]

    return (
        <main
            dir={direction}
            className="relative overflow-hidden bg-[#05090e] text-white"
        >
            <style jsx global>{`
                .ge-contact-grid {
                    background-image:
                        linear-gradient(rgba(76, 210, 255, .045) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(76, 210, 255, .045) 1px, transparent 1px);
                    background-size: 48px 48px;
                }

                .ge-glow {
                    background: radial-gradient(
                        circle,
                        rgba(45, 205, 245, .16) 0%,
                        rgba(45, 205, 245, .04) 42%,
                        transparent 72%
                    );
                }

                .ge-card {
                    background: linear-gradient(
                        145deg,
                        rgba(17, 30, 41, .92),
                        rgba(8, 15, 23, .96)
                    );
                    border: 1px solid rgba(148, 213, 240, .12);
                    transition: all .3s ease;
                }

                .ge-card:hover {
                    border-color: rgba(65, 211, 255, .45);
                    transform: translateY(-5px);
                    box-shadow: 0 18px 50px rgba(0, 160, 220, .09);
                }

                .ge-input {
                    width: 100%;
                    background: rgba(3, 10, 17, .72);
                    border: 1px solid rgba(148, 213, 240, .15);
                    border-radius: 12px;
                    padding: 14px 15px;
                    color: white;
                    outline: none;
                    transition: .25s;
                }

                .ge-input:focus {
                    border-color: #42d6f5;
                    box-shadow: 0 0 0 3px rgba(66, 214, 245, .09);
                }

                .ge-input::placeholder {
                    color: #647987;
                }

                .ge-gradient-text {
                    background: linear-gradient(100deg, #ffffff 10%, #77eaff 55%, #35bce9 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                @keyframes ge-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-13px); }
                }

                .ge-float {
                    animation: ge-float 6s ease-in-out infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .ge-float {
                        animation: none;
                    }

                    .ge-card {
                        transition: none;
                    }
                }
            `}</style>

            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0 ge-contact-grid opacity-70" />
            <div className="pointer-events-none absolute -top-48 left-[-150px] h-[550px] w-[550px] rounded-full ge-glow" />
            <div className="pointer-events-none absolute top-[550px] right-[-180px] h-[500px] w-[500px] rounded-full ge-glow" />

            {/* Hero */}
            <section className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20">
                <div className="grid lg:grid-cols-[1.15fr_.85fr] items-center gap-14">

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-xs sm:text-sm text-cyan-200 mb-8">
                            <Sparkles size={15} />
                            {content.eyebrow}
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-black leading-[1.12] tracking-tight">
                            {content.title}
                            <span className="block ge-gradient-text mt-2">
                                {content.titleAccent}
                            </span>
                        </h1>

                        <p className="mt-7 max-w-2xl text-base sm:text-lg text-slate-400 leading-8">
                            {content.description}
                        </p>

                        <div className="mt-9 flex flex-wrap gap-3">
                            <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#22c987] hover:bg-[#18b978] text-[#03130d] px-7 py-4 font-bold transition shadow-lg shadow-green-500/10"
                            >
                                <MessageCircle size={19} />
                                {content.whatsapp}
                                <ArrowUpRight size={17} />
                            </a>

                            <a
                                href="#contact-form"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 hover:border-cyan-300/50 hover:bg-white/5 px-7 py-4 font-semibold transition"
                            >
                                {content.send}
                                <ArrowUpRight size={17} />
                            </a>
                        </div>

                        <div className="mt-12 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 size={17} className="text-cyan-400" />
                                {content.response}
                            </span>
                        </div>
                    </div>

                    {/* Brand visual */}
                    <div className="relative flex items-center justify-center min-h-[340px] lg:min-h-[440px]">
                        <div className="absolute w-[320px] h-[320px] sm:w-[410px] sm:h-[410px] rounded-full border border-cyan-300/10" />
                        <div className="absolute w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] rounded-full border border-cyan-300/10 border-dashed" />

                        <div className="absolute w-[300px] h-[300px] sm:w-[390px] sm:h-[390px] rounded-full ge-glow" />

                        <div className="relative ge-float w-[260px] sm:w-[330px]">
                            <div className="rounded-[34px] border border-white/10 bg-[#0b1721]/80 p-8 sm:p-10 backdrop-blur-xl shadow-2xl shadow-cyan-950/40">
                                <Image
                                    src="/logo-global-earth.png"
                                    alt="GLOBAL EARTH Official Logo"
                                    width={500}
                                    height={500}
                                    priority
                                    className="w-full h-auto object-contain"
                                />

                                <div className="mt-6 text-center">
                                    <div className="text-xs tracking-[.35em] text-cyan-300 font-semibold">
                                        GLOBAL EARTH
                                    </div>
                                    <p className="mt-2 text-[11px] tracking-widest text-slate-500">
                                        TECHNOLOGY · ELECTRONICS · TRUST
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-8 right-2 sm:right-0 rounded-xl border border-cyan-300/15 bg-[#0c1924]/90 px-4 py-3 backdrop-blur-lg">
                            <Globe2 size={21} className="text-cyan-300" />
                        </div>

                        <div className="absolute bottom-10 left-0 rounded-xl border border-cyan-300/15 bg-[#0c1924]/90 px-4 py-3 backdrop-blur-lg">
                            <Zap size={21} className="text-cyan-300" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact cards */}
            <section className="relative max-w-7xl mx-auto px-5 sm:px-8 pb-24">
                <div className="mb-10">
                    <div className="text-xs font-bold tracking-[.25em] text-cyan-400 mb-3">
                        {content.contactTitle}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold">
                        {content.contactDescription}
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {contactCards.map((card) => {
                        const Icon = card.icon

                        const iconColors = {
                            green: 'bg-green-400/10 text-green-400',
                            blue: 'bg-blue-400/10 text-blue-400',
                            cyan: 'bg-cyan-400/10 text-cyan-400',
                            purple: 'bg-purple-400/10 text-purple-400',
                        }

                        return (
                            <a
                                key={card.title}
                                href={card.href}
                                target={card.external ? '_blank' : undefined}
                                rel={card.external ? 'noopener noreferrer' : undefined}
                                className="ge-card rounded-2xl p-6 group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColors[card.color]}`}>
                                        <Icon size={23} />
                                    </div>
                                    <ArrowUpRight
                                        size={20}
                                        className="text-slate-500 group-hover:text-cyan-300 transition"
                                    />
                                </div>

                                <h3 className="mt-6 text-xl font-bold">
                                    {card.title}
                                </h3>

                                <p className="mt-2 text-sm text-slate-400">
                                    {card.description}
                                </p>

                                <div
                                    dir="ltr"
                                    className="mt-5 text-sm text-cyan-300 font-medium break-all text-start"
                                >
                                    {card.value}
                                </div>
                            </a>
                        )
                    })}
                </div>
            </section>

            {/* Form + information */}
            <section
                id="contact-form"
                className="relative border-y border-white/[0.07] bg-[#08111a]/80"
            >
                <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
                    <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-12 lg:gap-20">

                        <div>
                            <div className="text-xs font-bold tracking-[.25em] text-cyan-400 mb-4">
                                {content.formLabel}
                            </div>

                            <h2 className="text-4xl sm:text-5xl font-black leading-tight">
                                {content.formTitle}
                            </h2>

                            <p className="mt-6 text-slate-400 leading-8">
                                {content.formDescription}
                            </p>

                            <div className="mt-10 space-y-7">
                                {features.map((feature) => {
                                    const Icon = feature.icon

                                    return (
                                        <div key={feature.title} className="flex gap-4">
                                            <div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
                                                <Icon size={21} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{feature.title}</h3>
                                                <p className="mt-1 text-sm leading-6 text-slate-400">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-cyan-300" size={20} />
                                    <div>
                                        <div className="text-xs text-slate-500 tracking-widest">
                                            {content.location}
                                        </div>
                                        <div className="mt-1 font-semibold">{content.egypt}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact form */}
                        <form
                            onSubmit={handleSubmit}
                            className="rounded-3xl border border-white/10 bg-[#0b1722] p-6 sm:p-9 shadow-2xl shadow-black/20"
                        >
                            <div className="grid sm:grid-cols-2 gap-5">

                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        {content.name} *
                                    </label>
                                    <input
                                        className="ge-input"
                                        name="name"
                                        value={form.name}
                                        onChange={updateField}
                                        placeholder={content.namePlaceholder}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        {content.phoneField} *
                                    </label>
                                    <input
                                        className="ge-input"
                                        name="phone"
                                        type="tel"
                                        dir="ltr"
                                        value={form.phone}
                                        onChange={updateField}
                                        placeholder={content.phonePlaceholder}
                                        required
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-semibold mb-2">
                                        {content.emailField}
                                    </label>
                                    <input
                                        className="ge-input"
                                        name="email"
                                        type="email"
                                        dir="ltr"
                                        value={form.email}
                                        onChange={updateField}
                                        placeholder={content.emailPlaceholder}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-semibold mb-2">
                                        {content.subject}
                                    </label>
                                    <select
                                        className="ge-input"
                                        name="subject"
                                        value={form.subject}
                                        onChange={updateField}
                                    >
                                        <option value="purchase">{content.purchase}</option>
                                        <option value="quotation">{content.quotation}</option>
                                        <option value="support">{content.support}</option>
                                        <option value="partnership">{content.partnership}</option>
                                        <option value="other">{content.other}</option>
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-semibold mb-2">
                                        {content.message} *
                                    </label>
                                    <textarea
                                        className="ge-input min-h-[145px] resize-y"
                                        name="message"
                                        value={form.message}
                                        onChange={updateField}
                                        placeholder={content.message}
                                        required
                                    />
                                </div>
                            </div>

                            {sent && (
                                <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-400/10 p-3 text-sm text-green-300">
                                    <CheckCircle2 size={18} />
                                    {content.success}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="mt-7 w-full flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 px-6 py-4 font-bold text-[#03111a] transition shadow-lg shadow-cyan-500/10"
                            >
                                <Send size={19} />
                                {content.send}
                                <ArrowUpRight size={18} />
                            </button>

                            <p className="mt-4 text-center text-xs text-slate-500 leading-6">
                                {content.note}
                            </p>
                        </form>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20">
                <div className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-[#102b3a] via-[#0a1a26] to-[#071019] p-8 sm:p-12">
                    <div className="absolute -top-24 right-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold tracking-[.2em] mb-4">
                                <Clock3 size={16} />
                                {content.availability}
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black">
                                GLOBAL EARTH
                            </h2>
                            <p className="mt-3 text-slate-400">
                                {isArabic
                                    ? 'التكنولوجيا التي تحتاجها، والتواصل الذي تستحقه.'
                                    : 'The technology you need. The connection you deserve.'}
                            </p>
                        </div>

                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 font-bold text-[#06121a] hover:bg-cyan-100 transition"
                        >
                            <MessageCircle size={20} />
                            {content.whatsapp}
                            <ArrowUpRight size={18} />
                        </a>
                    </div>
                </div>
            </section>
        </main>
    )
}
