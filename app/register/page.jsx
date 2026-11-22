
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { User, Mail, Lock, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match')
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
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed')
            }

            toast.success('Account created successfully')
            router.push('/')
            router.refresh()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const update = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <main className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                <Link href="/" className="block text-center text-2xl font-extrabold text-slate-900 mb-8">
                    GLOBAL <span className="text-cyan-500">EARTH.</span>
                </Link>

                <h1 className="text-2xl font-bold text-slate-900 text-center">
                    Create Your Account
                </h1>
                <p className="text-slate-500 text-sm text-center mt-2 mb-8">
                    Join GLOBAL EARTH and start shopping.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <div className="flex items-center border rounded-xl px-4">
                            <User size={18} className="text-slate-400" />
                            <input
                                required
                                name="name"
                                value={form.name}
                                onChange={update}
                                maxLength={100}
                                placeholder="Your full name"
                                className="w-full p-3 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <div className="flex items-center border rounded-xl px-4">
                            <Mail size={18} className="text-slate-400" />
                            <input
                                required
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={update}
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
                                minLength={8}
                                value={form.password}
                                onChange={update}
                                placeholder="At least 8 characters"
                                className="w-full p-3 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                        <div className="flex items-center border rounded-xl px-4">
                            <Lock size={18} className="text-slate-400" />
                            <input
                                required
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={update}
                                placeholder="Repeat your password"
                                className="w-full p-3 outline-none"
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-cyan-600 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-cyan-600 font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </main>
    )
}
