'use client'

// components/AuthFields.jsx
import { useState } from 'react'
import { AlertTriangle, Eye, EyeOff, Lock } from 'lucide-react'

const wrap =
    'group flex items-center gap-3 rounded-2xl border bg-white px-4 transition focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100'
const input =
    'w-full min-w-0 bg-transparent py-3.5 text-[15px] text-slate-900 outline-none placeholder:text-slate-400'
const labelCls = 'mb-2 block text-sm font-semibold text-slate-700'

export function TextField({ label, icon: Icon, hint, error, ...props }) {
    const id = props.id || props.name

    return (
        <div>
            <label htmlFor={id} className={labelCls}>
                {label}
            </label>
            <div className={`${wrap} ${error ? 'border-rose-400' : 'border-slate-200'}`}>
                {Icon && (
                    <Icon
                        size={18}
                        className="shrink-0 text-slate-400 transition group-focus-within:text-cyan-600"
                    />
                )}
                <input id={id} className={input} {...props} />
            </div>
            {error ? (
                <p className="mt-1.5 text-xs text-rose-600">{error}</p>
            ) : hint ? (
                <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
            ) : null}
        </div>
    )
}

export function getPasswordScore(password) {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return password.length < 8 ? Math.min(score, 1) : Math.max(score, 1)
}

const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']
const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-lime-500', 'bg-emerald-500']

export function PasswordInput({
    label,
    showStrength = false,
    error,
    hint,
    ...props
}) {
    const [visible, setVisible] = useState(false)
    const [caps, setCaps] = useState(false)
    const id = props.id || props.name
    const value = String(props.value || '')
    const score = getPasswordScore(value)

    return (
        <div>
            <label htmlFor={id} className={labelCls}>
                {label}
            </label>

            <div className={`${wrap} ${error ? 'border-rose-400' : 'border-slate-200'}`}>
                <Lock
                    size={18}
                    className="shrink-0 text-slate-400 transition group-focus-within:text-cyan-600"
                />
                <input
                    id={id}
                    type={visible ? 'text' : 'password'}
                    className={input}
                    onKeyUp={e => setCaps(e.getModifierState?.('CapsLock') || false)}
                    onBlur={() => setCaps(false)}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setVisible(v => !v)}
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    className="shrink-0 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {caps && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-600">
                    <AlertTriangle size={13} /> Caps Lock is on
                </p>
            )}

            {showStrength && value && (
                <div className="mt-2.5">
                    <div className="flex gap-1.5">
                        {[0, 1, 2, 3].map(i => (
                            <span
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-colors ${
                                    i < score ? strengthColors[score - 1] : 'bg-slate-200'
                                }`}
                            />
                        ))}
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">
                        Password strength:{' '}
                        <strong className="text-slate-700">
                            {value.length < 8 ? 'Too short' : strengthLabels[score - 1]}
                        </strong>
                    </p>
                </div>
            )}

            {error ? (
                <p className="mt-1.5 text-xs text-rose-600">{error}</p>
            ) : hint ? (
                <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
            ) : null}
        </div>
    )
}
