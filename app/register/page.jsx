'use client'

// app/register/page.jsx
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { ArrowRight, Check, Loader2, Mail, MessageCircle, User } from 'lucide-react'
import AuthShell from '@/components/AuthShell'
import SocialButtons from '@/components/SocialButtons'
import { PasswordInput, TextField } from '@/components/AuthFields'
import { safeNext } from '@/lib/safeNext'

const COUNTRIES = [
    { code: '20', label: 'EG +20' },
    { code: '966', label: 'SA +966' },
    { code: '971', label: 'AE +971' },
    { code: '965', label: 'KW +965' },
    { code: '974', label: 'QA +974' },
    { code: '962', label: 'JO +962' },
    { code: '212', label: 'MA +212' },
    { code: '44', label: 'GB +44' },
    { code: '1', label: 'US +1' },
]

function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const next = safeNext(searchParams.get('next'))

    const [loading, setLoading] = useState(false)
    const [country, setCountry] = useState('20')
    const [phone, setPhone] = useState('')
    const [whatsappOptIn, setWhatsappOptIn] = useState(true)
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const update = e => setForm({ ...form, [e.target.name]: e.target.value })

    const passwordsMatch =
        form.confirmPassword.length > 0 && form.password === form.confirmPassword
    const mismatch =
        form.confirmPassword.length > 0 && form.password !== form.confirmPassword

    const handleSubmit = async e => {
        e.preventDefault()

        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        // Build full international number (digits only), e.g. 01012345678 -> 201012345678
        const digits = phone.replace(/\D/g, '').replace(/^0+/, '')
        if (digits && (digits.length < 6 || digits.length > 12)) {
            toast.error('Please enter a valid phone number')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    phone: digits ? `${country}${digits}` : '',
                    whatsappOptIn: Boolean(digits) && whatsappOptIn,
                }),
            })
            const result = await response.json()

            if (!response.ok) throw new Error(result.message || 'Registration failed')

            const sent = []
            if (result.welcome?.email) sent.push('email')
            if (result.welcome?.whatsapp) sent.push('WhatsApp')

            toast.success(
                sent.length
                    ? `Welcome to GLOBAL EARTH! We sent you a welcome message on ${sent.join(' and ')}.`
                    : 'Welcome to GLOBAL EARTH! Your account is ready.',
                { duration: 5000 }
            )

            router.push(next)
            router.refresh()
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthShell
            title="Create your account"
            subtitle="Join the GLOBAL EARTH VIP team and shop smarter."
            footer={
                <>
                    Already have an account?{' '}
                    <Link
                        href={`/login${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`}
                        className="font-semibold text-cyan-600 hover:underline"
                    >
                        Sign in
                    </Link>
                </>
            }
        >
            <SocialButtons next={next} verb="Sign up" />

            <form onSubmit={handleSubmit} className="space-y-5">
                <TextField
                    label="Full name"
                    icon={User}
                    required
                    name="name"
                    autoComplete="name"
                    maxLength={100}
                    value={form.name}
                    onChange={update}
                    placeholder="Your full name"
                />

                <TextField
                    label="Email address"
                    icon={Mail}
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={update}
                    placeholder="name@example.com"
                />

                {/* Phone */}
                <div>
                    <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        WhatsApp number{' '}
                        <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 transition focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100">
                        <select
                            aria-label="Country code"
                            value={country}
                            onChange={e => setCountry(e.target.value)}
                            className="rounded-xl bg-slate-100 px-2 py-2.5 text-sm font-medium text-slate-700 outline-none"
                        >
                            {COUNTRIES.map(c => (
                                <option key={c.code} value={c.code}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                        <input
                            id="phone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel-national"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="1012345678"
                            className="min-w-0 flex-1 bg-transparent py-3.5 text-[15px] outline-none placeholder:text-slate-400"
                        />
                    </div>

                    {phone.trim() && (
                        <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            <input
                                type="checkbox"
                                checked={whatsappOptIn}
                                onChange={e => setWhatsappOptIn(e.target.checked)}
                                className="mt-0.5 h-4 w-4 accent-emerald-600"
                            />
                            <span className="flex items-start gap-2">
                                <MessageCircle size={16} className="mt-0.5 shrink-0" />
                                Send my welcome message on WhatsApp
                            </span>
                        </label>
                    )}
                </div>

                <PasswordInput
                    label="Password"
                    required
                    name="password"
                    minLength={8}
                    maxLength={72}
                    autoComplete="new-password"
                    showStrength
                    value={form.password}
                    onChange={update}
                    placeholder="At least 8 characters"
                />

                <div>
                    <PasswordInput
                        label="Confirm password"
                        required
                        name="confirmPassword"
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        onChange={update}
                        placeholder="Repeat your password"
                        error={mismatch ? 'Passwords do not match' : ''}
                    />
                    {passwordsMatch && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600">
                            <Check size={14} /> Passwords match
                        </p>
                    )}
                </div>

                <button
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-300/50 transition hover:bg-cyan-300 active:scale-[0.99] disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" /> Creating account...
                        </>
                    ) : (
                        <>
                            Create account
                            <ArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </>
                    )}
                </button>
            </form>
        </AuthShell>
    )
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-[80vh]" />}>
            <RegisterForm />
        </Suspense>
    )
}
