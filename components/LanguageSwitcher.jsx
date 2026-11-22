
'use client';

import { Languages } from 'lucide-react';
import { useLanguage } from '@/app/LanguageProvider';

export default function LanguageSwitcher() {
    const { language, changeLanguage } = useLanguage();

    return (
        <button
            type="button"
            onClick={() =>
                changeLanguage(language === 'ar' ? 'en' : 'ar')
            }
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-500 hover:text-cyan-700 transition"
            aria-label="Change language"
        >
            <Languages size={17} />
            {language === 'ar' ? 'English' : 'العربية'}
        </button>
    );
}
