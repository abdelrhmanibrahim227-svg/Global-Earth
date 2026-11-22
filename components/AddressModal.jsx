
'use client'

import { XIcon } from "lucide-react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "react-hot-toast"
import { addAddress } from "@/lib/features/address/addressSlice"

const AddressModal = ({ setShowAddressModal }) => {
    const dispatch = useDispatch()
    const [saving, setSaving] = useState(false)

    const [address, setAddress] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'Egypt',
        phone: ''
    })

    const handleAddressChange = (e) => {
        setAddress(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (saving) return

        setSaving(true)

        try {
            const response = await fetch('/api/account/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(address),
            })

            const result = await response.json()

            if (response.status === 401) {
                toast.error('Please login first')
                return
            }

            if (!response.ok) {
                throw new Error(result.message || 'Unable to save address')
            }

            dispatch(addAddress(result.address))

            toast.success('Address saved successfully')
            setShowAddressModal(false)

        } catch (error) {
            console.error('Save address error:', error)
            toast.error(error.message || 'Something went wrong')
        } finally {
            setSaving(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="fixed inset-0 z-50 bg-white/60 backdrop-blur h-screen flex items-center justify-center"
        >
            <div className="relative flex flex-col gap-4 text-slate-700 w-full max-w-md mx-6 bg-white p-6 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl">
                    Add New <span className="font-semibold">Address</span>
                </h2>

                <input name="name" value={address.name} onChange={handleAddressChange} className="p-2 px-4 outline-none border border-slate-200 rounded w-full" type="text" placeholder="Full name" required />

                <input name="email" value={address.email} onChange={handleAddressChange} className="p-2 px-4 outline-none border border-slate-200 rounded w-full" type="email" placeholder="Email address" required />

                <input name="phone" value={address.phone} onChange={handleAddressChange} className="p-2 px-4 outline-none border border-slate-200 rounded w-full" type="tel" placeholder="Phone number" required />

                <input name="street" value={address.street} onChange={handleAddressChange} className="p-2 px-4 outline-none border border-slate-200 rounded w-full" type="text" placeholder="Street and building number" required />

                <div className="flex gap-3">
                    <input name="city" value={address.city} onChange={handleAddressChange} className="p-2 px-4 outline-none border border-slate-200 rounded w-full" type="text" placeholder="City" required />
                    <input name="state" value={address.state} onChange={handleAddressChange} className="p-2 px-4 outline-none border border-slate-200 rounded w-full" type="text" placeholder="Governorate" required />
                </div>

                <div className="flex gap-3">
                    <input name="zip" value={address.zip} onChange={handleAddressChange} className="p-2 px-4 outline-none border border-slate-200 rounded w-full" type="text" placeholder="Postal code (optional)" />
                    <input name="country" value={address.country} onChange={handleAddressChange} className="p-2 px-4 outline-none border border-slate-200 rounded w-full" type="text" placeholder="Country" required />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-slate-800 text-white text-sm font-medium py-3 rounded-md hover:bg-slate-900 disabled:opacity-50 transition-all"
                >
                    {saving ? 'SAVING...' : 'SAVE ADDRESS'}
                </button>
            </div>

            <button
                type="button"
                aria-label="Close"
                className="absolute top-5 right-5 text-slate-500 hover:text-slate-700"
                onClick={() => setShowAddressModal(false)}
            >
                <XIcon size={30} />
            </button>
        </form>
    )
}

export default AddressModal
