
'use client'

import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { Trash2, TicketPercent, Loader2 } from "lucide-react"

const initialCoupon = {
    code: '',
    description: '',
    discount: '',
    forNewUser: false,
    forMember: false,
    isPublic: false,
    expiresAt: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
}

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([])
    const [newCoupon, setNewCoupon] = useState(initialCoupon)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deletingCode, setDeletingCode] = useState(null)

    const fetchCoupons = async () => {
        try {
            setLoading(true)

            const response = await fetch('/api/admin/coupons', {
                credentials: 'include',
                cache: 'no-store',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to load coupons')
            }

            setCoupons(data.coupons || [])
        } catch (error) {
            toast.error(error.message || 'Unable to load coupons')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCoupons()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target

        setNewCoupon(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAddCoupon = async (e) => {
        e.preventDefault()

        if (saving) return

        try {
            setSaving(true)

            const response = await fetch('/api/admin/coupons', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newCoupon,
                    code: newCoupon.code.trim().toUpperCase(),
                    discount: Number(newCoupon.discount),
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add coupon')
            }

            toast.success('Coupon added successfully')

            setNewCoupon(initialCoupon)

            await fetchCoupons()
        } catch (error) {
            toast.error(error.message || 'Unable to add coupon')
        } finally {
            setSaving(false)
        }
    }

    const deleteCoupon = async (code) => {
        if (deletingCode) return

        const confirmed = window.confirm(
            `Are you sure you want to delete coupon "${code}"?`
        )

        if (!confirmed) return

        try {
            setDeletingCode(code)

            const response = await fetch('/api/admin/coupons', {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete coupon')
            }

            setCoupons(prev => prev.filter(coupon => coupon.code !== code))

            toast.success('Coupon deleted successfully')
        } catch (error) {
            toast.error(error.message || 'Unable to delete coupon')
        } finally {
            setDeletingCode(null)
        }
    }

    const Toggle = ({ name, label }) => (
        <label className="flex items-center gap-3 cursor-pointer">
            <input
                type="checkbox"
                name={name}
                checked={newCoupon[name]}
                onChange={(e) => setNewCoupon(prev => ({
                    ...prev,
                    [name]: e.target.checked
                }))}
                className="w-4 h-4 accent-green-600"
            />
            <span className="text-sm text-slate-700">{label}</span>
        </label>
    )

    return (
        <div className="text-slate-600 mb-40">

            {/* Page Heading */}
            <div className="flex items-center gap-3 mb-7">
                <div className="p-3 rounded-xl bg-green-50 text-green-600">
                    <TicketPercent size={25} />
                </div>

                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">
                        GLOBAL EARTH Coupons
                    </h1>
                    <p className="text-sm text-slate-400">
                        Create and manage your store discount coupons
                    </p>
                </div>
            </div>

            {/* Add Coupon */}
            <form
                onSubmit={handleAddCoupon}
                className="max-w-xl bg-white border border-slate-200 rounded-xl p-5"
            >
                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                    Add New Coupon
                </h2>

                <div className="grid sm:grid-cols-2 gap-3">
                    <input
                        type="text"
                        placeholder="Coupon Code"
                        name="code"
                        value={newCoupon.code}
                        onChange={handleChange}
                        required
                        maxLength={50}
                        className="w-full p-3 border border-slate-200 rounded-lg outline-green-500 uppercase"
                    />

                    <input
                        type="number"
                        placeholder="Discount (%)"
                        name="discount"
                        value={newCoupon.discount}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        required
                        className="w-full p-3 border border-slate-200 rounded-lg outline-green-500"
                    />
                </div>

                <input
                    type="text"
                    placeholder="Coupon Description"
                    name="description"
                    value={newCoupon.description}
                    onChange={handleChange}
                    required
                    className="w-full mt-3 p-3 border border-slate-200 rounded-lg outline-green-500"
                />

                <label className="block mt-4">
                    <span className="text-sm font-medium">
                        Coupon Expiry Date
                    </span>

                    <input
                        type="date"
                        name="expiresAt"
                        value={newCoupon.expiresAt}
                        onChange={handleChange}
                        required
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="w-full mt-2 p-3 border border-slate-200 rounded-lg outline-green-500"
                    />
                </label>

                <div className="grid sm:grid-cols-2 gap-4 mt-5">
                    <Toggle name="forNewUser" label="For New Users" />
                    <Toggle name="forMember" label="For Members" />
                    <Toggle name="isPublic" label="Public Coupon" />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="mt-6 flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 transition"
                >
                    {saving && <Loader2 size={17} className="animate-spin" />}
                    {saving ? 'Adding...' : 'Add Coupon'}
                </button>
            </form>

            {/* Coupons List */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">
                            Coupon List
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">
                            {coupons.length} coupon(s) registered
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 max-w-6xl bg-white">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                {[
                                    'Code',
                                    'Description',
                                    'Discount',
                                    'Expires At',
                                    'New User',
                                    'Member',
                                    'Public',
                                    'Action'
                                ].map(title => (
                                    <th
                                        key={title}
                                        className="py-3 px-4 text-left font-semibold text-slate-600 whitespace-nowrap"
                                    >
                                        {title}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-10 text-slate-400">
                                        Loading coupons...
                                    </td>
                                </tr>
                            ) : coupons.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-10 text-slate-400">
                                        No coupons found. Add your first coupon above.
                                    </td>
                                </tr>
                            ) : (
                                coupons.map(coupon => (
                                    <tr key={coupon.code} className="hover:bg-slate-50">
                                        <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                                            {coupon.code}
                                        </td>

                                        <td className="py-3 px-4 min-w-48">
                                            {coupon.description}
                                        </td>

                                        <td className="py-3 px-4 font-semibold text-green-700">
                                            {coupon.discount}%
                                        </td>

                                        <td className="py-3 px-4 whitespace-nowrap">
                                            {format(new Date(coupon.expiresAt), 'yyyy-MM-dd')}
                                        </td>

                                        <td className="py-3 px-4">
                                            {coupon.forNewUser ? 'Yes' : 'No'}
                                        </td>

                                        <td className="py-3 px-4">
                                            {coupon.forMember ? 'Yes' : 'No'}
                                        </td>

                                        <td className="py-3 px-4">
                                            {coupon.isPublic ? 'Yes' : 'No'}
                                        </td>

                                        <td className="py-3 px-4">
                                            <button
                                                type="button"
                                                onClick={() => deleteCoupon(coupon.code)}
                                                disabled={deletingCode === coupon.code}
                                                title="Delete coupon"
                                                className="text-red-500 hover:text-red-700 disabled:opacity-40"
                                            >
                                                {deletingCode === coupon.code ? (
                                                    <Loader2 size={19} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={19} />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
