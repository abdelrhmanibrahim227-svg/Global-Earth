
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Login failed')
            }

            toast.success('Welcome back!')
            router.push('/')
            router.refresh()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                <Link href="/" className="block text-center text-2xl font-extrabold text-slate-900 mb-8">
                    GLOBAL <span className="text-cyan-500">EARTH.</span>
                </Link>

                <h1 className="text-2xl font-bold text-slate-900 text-center">
                    Welcome Back
                </h1>
                <p className="text-slate-500 text-sm text-center mt-2 mb-8">
                    Login to your GLOBAL EARTH account.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <div className="flex items-center border rounded-xl px-4">
                            <Mail size={18} className="text-slate-400" />
                            <input
                                required
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="name@example.com"
                                className="w-full p-3 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <div className="flex items-center border rounded-xl px-4">
                            <Lock size={18} className="text-slate-400" />
                            <input
                                required
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Your password"
                                className="w-full p-3 outline-none"
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-cyan-600 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-cyan-600 font-semibold hover:underline">
                        Create Account
                    </Link>
                </p>
            </div>
        </main>
    )
}
