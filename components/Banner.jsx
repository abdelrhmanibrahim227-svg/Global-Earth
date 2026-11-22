
'use client'

import React from 'react'
import toast from 'react-hot-toast'
import { useLanguage } from '@/app/LanguageProvider'

export default function Banner() {
    const [isOpen, setIsOpen] = React.useState(true)
    const { t, language, direction } = useLanguage()

    const handleClaim = async () => {
        try {
            await navigator.clipboard.writeText('NEW20')
            setIsOpen(false)
            toast.success(t('couponCopied'))
        } catch (error) {
            console.error('Clipboard error:', error)
            toast.error(
                language === 'ar'
                    ? 'تعذر نسخ كود الخصم'
                    : 'Unable to copy coupon code'
            )
        }
    }

    if (!isOpen) return null

    return (
        <div
            dir={direction}
            className="w-full px-4 sm:px-6 py-1 font-medium text-sm text-white text-center bg-gradient-to-r from-violet-500 via-[#9938CA] to-[#E0724A]"
        >
            <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
                <p className="flex-1 text-center">
                    {t('offer')}
                </p>

                <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                    <button
                        onClick={handleClaim}
                        type="button"
                        className="font-normal text-gray-800 bg-white px-4 sm:px-7 py-2 rounded-full max-sm:hidden hover:bg-gray-100 transition"
                    >
                        {t('claimOffer')}
                    </button>

                    <button
                        onClick={() => setIsOpen(false)}
                        type="button"
                        aria-label={
                            language === 'ar'
                                ? 'إغلاق الإعلان'
                                : 'Close banner'
                        }
                        className="font-normal text-gray-800 py-2 rounded-full hover:opacity-75 transition"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                y="12.532"
                                width="17.498"
                                height="2.1"
                                rx="1.05"
                                transform="rotate(-45.74 0 12.532)"
                                fill="#fff"
                            />
                            <rect
                                x="12.533"
                                y="13.915"
                                width="17.498"
                                height="2.1"
                                rx="1.05"
                                transform="rotate(-135.74 12.533 13.915)"
                                fill="#fff"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}
