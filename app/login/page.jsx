'use client'

// app/login/page.jsx
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { ArrowRight, Loader2, Mail } from 'lucide-react'
import AuthShell from '@/components/AuthShell'
import SocialButtons from '@/components/SocialButtons'
import { PasswordInput, TextField } from '@/components/AuthFields'
import { safeNext } from '@/lib/safeNext'

const OAUTH_ERRORS = {
    provider_not_configured: 'This sign-in method is not available yet.',
    state_mismatch: 'Your sign-in session expired. Please try again.',
    access_denied: 'Sign-in was cancelled.',
    no_email: 'We could not get an email address from that account.',
    email_not_verified: 'Your email address is not verified with that provider.',
    oauth_failed: 'Sign-in failed. Please try again.',
}

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const next = safeNext(searchParams.get('next'))

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({ email: '', password: '' })

    // Errors coming back from Google / Facebook
    useEffect(() => {
        const code = searchParams.get('error')
        if (code) toast.error(OAUTH_ERRORS[code] || OAUTH_ERRORS.oauth_failed)
    }, [searchParams])

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const result = await response.json()

            if (!response.ok) throw new Error(result.message || 'Login failed')

            toast.success('Welcome back!')
            router.push(next)
            router.refresh()
        } catch (err) {
            setError(err.message)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthShell
            title="Welcome back"
            subtitle="Sign in to track orders, save favorites and check out faster."
            footer={
                <>
                    New to GLOBAL EARTH?{' '}
                    <Link
                        href={`/register${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`}
                        className="font-semibold text-cyan-600 hover:underline"
                    >
                        Create an account
                    </Link>
                </>
            }
        >
            <SocialButtons next={next} verb="Continue" />

            <form onSubmit={handleSubmit} className="space-y-5">
                <TextField
                    label="Email address"
                    icon={Mail}
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                />

                <PasswordInput
                    label="Password"
                    required
                    name="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Your password"
                />

                {error && (
                    <p
                        role="alert"
                        className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
                    >
                        {error}
                    </p>
                )}

                <button
                    disabled={loading}
                    className="group flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#030a12] py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" /> Signing in...
                        </>
                    ) : (
                        <>
                            Sign in
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

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-[80vh]" />}>
            <LoginForm />
        </Suspense>
    )
}
