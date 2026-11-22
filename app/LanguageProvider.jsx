
'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import { translations } from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    // English is the same initial language on server and client.
    // Browser language is detected after hydration.
    const [language, setLanguage] = useState('en');
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let selectedLanguage = null;

        try {
            selectedLanguage = localStorage.getItem('global-earth-language');
        } catch (error) {
            console.warn('Could not read saved language:', error);
        }

        if (selectedLanguage !== 'ar' && selectedLanguage !== 'en') {
            const browserLanguage =
                navigator.languages?.[0] ||
                navigator.language ||
                'en';

            selectedLanguage = browserLanguage
                .toLowerCase()
                .startsWith('ar')
                ? 'ar'
                : 'en';
        }

        setLanguage(selectedLanguage);
        setReady(true);
    }, []);

    useEffect(() => {
        const direction = language === 'ar' ? 'rtl' : 'ltr';

        document.documentElement.lang = language;
        document.documentElement.dir = direction;
    }, [language]);

    const changeLanguage = (nextLanguage) => {
        if (!['ar', 'en'].includes(nextLanguage)) return;

        setLanguage(nextLanguage);

        try {
            localStorage.setItem('global-earth-language', nextLanguage);
        } catch (error) {
            console.warn('Could not save language:', error);
        }
    };

    const t = (key) => {
        return translations[language]?.[key] ??
            translations.en[key] ??
            key;
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                direction: language === 'ar' ? 'rtl' : 'ltr',
                changeLanguage,
                t,
                ready,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            'useLanguage must be used inside LanguageProvider'
        );
    }

    return context;
}
