
'use client'

import { PlusIcon, SquarePenIcon } from 'lucide-react'
import { useState } from 'react'
import AddressModal from './AddressModal'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '@/lib/features/cart/cartSlice'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const OrderSummary = ({ totalPrice, items }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'ج.م'

    const formatMoney = (value) =>
        `${Number(value || 0).toLocaleString('en-EG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} ${currency}`

    const router = useRouter()
    const dispatch = useDispatch()

    const addressList = useSelector(
        state => state.address?.list || []
    )

    const [paymentMethod] = useState('COD')
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

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
                headers: {
                    'Content-Type': 'application/json',
                },
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
        <div className="w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7">

            <h2 className="text-xl font-medium text-slate-600">
                Payment Summary
            </h2>

            <p className="text-slate-400 text-xs my-4">
                Payment Method
            </p>

            <div className="flex gap-2 items-center">
                <input
                    type="radio"
                    id="COD"
                    checked
                    readOnly
                    className="accent-gray-500"
                />
                <label htmlFor="COD">
                    Cash on Delivery (COD)
                </label>
            </div>

            <p className="text-xs text-slate-400 mt-2">
                Stripe payment will be available after payment gateway setup.
            </p>

            <div className="my-4 py-4 border-y border-slate-200 text-slate-400">
                <p>Delivery Address</p>

                {selectedAddress ? (
                    <div className="flex gap-2 items-center justify-between mt-3">
                        <p className="text-slate-600 leading-6">
                            {selectedAddress.name},
                            {' '}{selectedAddress.street},
                            {' '}{selectedAddress.city},
                            {' '}{selectedAddress.state},
                            {' '}{selectedAddress.zip}
                        </p>

                        <SquarePenIcon
                            onClick={() => setSelectedAddress(null)}
                            className="cursor-pointer shrink-0"
                            size={18}
                        />
                    </div>
                ) : (
                    <div>
                        {addressList.length > 0 && (
                            <select
                                value=""
                                className="border border-slate-400 p-2 w-full my-3 outline-none rounded"
                                onChange={event => {
                                    const address = addressList.find(
                                        item => item.id === event.target.value
                                    )

                                    setSelectedAddress(address || null)
                                }}
                            >
                                <option value="" disabled>
                                    Select Address
                                </option>

                                {addressList.map(address => (
                                    <option
                                        key={address.id}
                                        value={address.id}
                                    >
                                        {address.name}, {address.city}, {address.state}
                                    </option>
                                ))}
                            </select>
                        )}

                        <button
                            type="button"
                            className="flex items-center gap-1 text-slate-600 mt-1"
                            onClick={() => setShowAddressModal(true)}
                        >
                            Add Address
                            <PlusIcon size={18} />
                        </button>
                    </div>
                )}
            </div>

            <div className="pb-4 border-b border-slate-200">
                <div className="flex justify-between">
                    <div className="flex flex-col gap-1 text-slate-400">
                        <p>Subtotal:</p>
                        <p>Shipping:</p>
                    </div>

                    <div className="flex flex-col gap-1 font-medium text-right">
                        <p>{formatMoney(totalPrice)}</p>
                        <p>Free</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between py-4">
                <p>Total:</p>

                <p className="font-medium text-right">
                    {formatMoney(totalPrice)}
                </p>
            </div>

            <button
                type="button"
                disabled={isSubmitting || !items?.length}
                onClick={handlePlaceOrder}
                className="w-full bg-slate-700 text-white py-3 rounded hover:bg-slate-900 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>

            {showAddressModal && (
                <AddressModal
                    setShowAddressModal={setShowAddressModal}
                />
            )}
        </div>
    )
}

export default OrderSummary