'use client'

// components/OrderSummary.jsx
import {
    Banknote,
    Check,
    CreditCard,
    Loader2,
    MapPin,
    PlusIcon,
    ShieldCheck,
    SquarePenIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import AddressModal from './AddressModal'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '@/lib/features/cart/cartSlice'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/productUtils'

const OrderSummary = ({ totalPrice, items }) => {
    const router = useRouter()
    const dispatch = useDispatch()

    const addressList = useSelector(state => state.address?.list || [])

    const [paymentMethod] = useState('COD')
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const totalUnits = (items || []).reduce((sum, i) => sum + (i.quantity || 0), 0)

    // Auto-select the only saved address to save the customer a click
    useEffect(() => {
        if (!selectedAddress && addressList.length === 1) {
            setSelectedAddress(addressList[0])
        }
    }, [addressList, selectedAddress])

    const handlePlaceOrder = async () => {
        if (isSubmitting) return

        if (!items?.length) {
            toast.error('Your cart is empty')
            return
        }

        if (!selectedAddress?.id) {
            toast.error('Please select a delivery address')
            return
        }

        setIsSubmitting(true)
        const loadingToast = toast.loading('Placing your order...')

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    addressId: selectedAddress.id,
                    paymentMethod,
                    items: items.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                    })),
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Unable to place order')
            }

            dispatch(clearCart())

            toast.success('Your order has been placed successfully!', {
                id: loadingToast,
            })

            router.push('/orders')
        } catch (error) {
            console.error('PLACE ORDER ERROR:', error)

            toast.error(error.message || 'Something went wrong', {
                id: loadingToast,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <h2 className="text-xl font-extrabold text-slate-900">Order Summary</h2>

            {/* Payment */}
            <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                Payment method
            </p>

            <div className="space-y-2.5">
                <div className="flex items-center gap-3 rounded-2xl border-2 border-cyan-500 bg-cyan-50/60 px-4 py-3.5">
                    <Banknote size={22} className="text-cyan-700" />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">Cash on Delivery</p>
                        <p className="text-xs text-slate-500">Pay when you receive your order</p>
                    </div>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-white">
                        <Check size={13} />
                    </span>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3.5 opacity-60">
                    <CreditCard size={22} className="text-slate-400" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-700">Card payment</p>
                        <p className="text-xs text-slate-400">Coming soon</p>
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="mt-6 border-t border-slate-100 pt-6">
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Delivery address
                    </p>
                    {selectedAddress && (
                        <button
                            type="button"
                            onClick={() => setSelectedAddress(null)}
                            className="flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:underline"
                        >
                            <SquarePenIcon size={13} />
                            Change
                        </button>
                    )}
                </div>

                {selectedAddress ? (
                    <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                        <MapPin size={20} className="mt-0.5 shrink-0 text-cyan-600" />
                        <div className="text-sm leading-6 text-slate-600">
                            <p className="font-semibold text-slate-900">{selectedAddress.name}</p>
                            <p>
                                {selectedAddress.street}, {selectedAddress.city},{' '}
                                {selectedAddress.state}
                                {selectedAddress.zip ? `, ${selectedAddress.zip}` : ''}
                            </p>
                            {selectedAddress.phone && (
                                <p dir="ltr" className="text-left">
                                    {selectedAddress.phone}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {addressList.map(address => (
                            <button
                                key={address.id}
                                type="button"
                                onClick={() => setSelectedAddress(address)}
                                className="flex w-full gap-3 rounded-2xl border border-slate-200 p-4 text-left text-sm transition hover:border-cyan-400 hover:bg-cyan-50/40"
                            >
                                <MapPin size={18} className="mt-0.5 shrink-0 text-slate-400" />
                                <span className="text-slate-600">
                                    <strong className="block text-slate-900">{address.name}</strong>
                                    {address.street}, {address.city}, {address.state}
                                </span>
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => setShowAddressModal(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 py-3.5 text-sm font-semibold text-slate-600 transition hover:border-cyan-500 hover:text-cyan-700"
                        >
                            <PlusIcon size={17} />
                            Add new address
                        </button>
                    </div>
                )}
            </div>

            {/* Totals */}
            <div className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm">
                <div className="flex justify-between text-slate-500">
                    <span>Subtotal ({totalUnits} {totalUnits === 1 ? 'item' : 'items'})</span>
                    <span className="font-semibold text-slate-800">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                    <span>Delivery</span>
                    <span className="font-bold text-emerald-600">Free</span>
                </div>
                <div className="flex items-end justify-between border-t border-dashed border-slate-200 pt-4">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-extrabold text-slate-900">
                        {formatPrice(totalPrice)}
                    </span>
                </div>
            </div>

            <button
                type="button"
                disabled={isSubmitting || !items?.length}
                onClick={handlePlaceOrder}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-cyan-400 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-300/50 transition hover:bg-cyan-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 size={18} className="animate-spin" /> Placing order...
                    </>
                ) : (
                    'Place Order'
                )}
            </button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck size={14} />
                Secure checkout · 100% original products
            </p>

            {showAddressModal && (
                <AddressModal setShowAddressModal={setShowAddressModal} />
            )}
        </div>
    )
}

export default OrderSummary
