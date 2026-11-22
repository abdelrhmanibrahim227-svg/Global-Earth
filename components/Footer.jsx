
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageProvider'

const Footer = () => {
    const { t, direction } = useLanguage()

    const phone = '01557040056'
    const email = 'globale280@gmail.com'
    const whatsapp = 'https://wa.me/201557040056'
    const facebook = 'https://www.facebook.com/share/14ugMrzCBHp/'

    const productLinks = [
        { key: 'computers', path: '/shop' },
        { key: 'mobiles', path: '/shop' },
        { key: 'cameras', path: '/shop' },
        { key: 'printers', path: '/shop' },
        { key: 'accessories', path: '/shop' },
    ]

    const websiteLinks = [
        { key: 'home', path: '/' },
        { key: 'shopAll', path: '/shop' },
        { key: 'myOrders', path: '/orders' },
        { key: 'contactUs', path: 'mailto:globale280@gmail.com' },
    ]

    const socialLinks = [
        {
            name: 'Facebook',
            url: facebook,
            external: true,
        },
        {
            name: 'WhatsApp',
            url: whatsapp,
            external: true,
        },
        {
            name: 'Email',
            url: `mailto:${email}`,
            external: false,
        },
    ]

    return (
        <footer
            dir={direction}
            className="mx-4 sm:mx-6 mt-16 bg-white text-slate-600"
        >
            <div className="max-w-7xl mx-auto">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-10 border-b border-slate-200">

                    {/* Company Identity */}
                    <div className="lg:col-span-1">

                        <Link
                            href="/"
                            aria-label="GLOBAL EARTH Home"
                            className="inline-flex items-center"
                        >
                            <Image
                                src="/logo-global-earth.png"
                                alt="GLOBAL EARTH"
                                width={180}
                                height={180}
                                priority={false}
                                className="w-32 h-32 object-contain rounded-xl"
                            />
                        </Link>

                        <p className="mt-4 text-sm leading-7 max-w-sm">
                            {t('description')}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-5">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target={social.external ? '_blank' : undefined}
                                    rel={
                                        social.external
                                            ? 'noopener noreferrer'
                                            : undefined
                                    }
                                    aria-label={social.name}
                                    className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 transition text-sm"
                                >
                                    {social.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-5">
                            {t('products')}
                        </h3>

                        <ul className="space-y-3 text-sm">
                            {productLinks.map((item) => (
                                <li key={item.key}>
                                    <Link
                                        href={item.path}
                                        className="hover:text-cyan-600 transition"
                                    >
                                        {t(item.key)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-5">
                            {t('customerService')}
                        </h3>

                        <ul className="space-y-3 text-sm">
                            {websiteLinks.map((item) => (
                                <li key={item.key}>
                                    {item.path.startsWith('mailto:') ? (
                                        <a
                                            href={item.path}
                                            className="hover:text-cyan-600 transition"
                                        >
                                            {t(item.key)}
                                        </a>
                                    ) : (
                                        <Link
                                            href={item.path}
                                            className="hover:text-cyan-600 transition"
                                        >
                                            {t(item.key)}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-5">
                            {t('contactGlobal')}
                        </h3>

                        <ul className="space-y-4 text-sm">

                            <li>
                                <span className="block text-slate-400 mb-1">
                                    {t('phone')}
                                </span>

                                <a
                                    href={`tel:${phone}`}
                                    dir="ltr"
                                    className="inline-block hover:text-cyan-600 transition"
                                >
                                    {phone}
                                </a>
                            </li>

                            <li>
                                <span className="block text-slate-400 mb-1">
                                    {t('email')}
                                </span>

                                <a
                                    href={`mailto:${email}`}
                                    dir="ltr"
                                    className="break-all hover:text-cyan-600 transition"
                                >
                                    {email}
                                </a>
                            </li>

                            <li>
                                <span className="block text-slate-400 mb-1">
                                    {t('location')}
                                </span>

                                <span>{t('egypt')}</span>
                            </li>

                            <li>
                                <a
                                    href={whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-4 py-2.5 font-medium text-white hover:bg-cyan-600 transition"
                                >
                                    {t('whatsapp')}
                                </a>
                            </li>

                        </ul>
                    </div>

                </div>

                {/* Copyright */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 py-5 text-xs text-slate-500">

                    <p dir="ltr">
                        © 2026 GLOBAL EARTH. {t('rights')}
                    </p>

                    <p>
                        {t('electronics')}
                    </p>

                </div>

            </div>
        </footer>
    )
}

export default Footer
