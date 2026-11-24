'use client'

import { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '@/lib/store'
import { addToCart } from '@/lib/features/cart/cartSlice'

export default function StoreProvider({ children }) {
    const storeRef = useRef(null)
    const restoredRef = useRef(false)

    if (!storeRef.current) {
        storeRef.current = makeStore()
    }

    const store = storeRef.current

    useEffect(() => {
        // Restore the cart once. The guard stops React Strict Mode (dev)
        // from running this twice and doubling every quantity.
        if (!restoredRef.current) {
            restoredRef.current = true

            try {
                const savedCart = localStorage.getItem('global-earth-cart')

                if (savedCart) {
                    const parsed = JSON.parse(savedCart)
                    const cartItems = parsed?.cartItems || {}

                    Object.entries(cartItems).forEach(([productId, quantity]) => {
                        const count = Number(quantity)

                        if (
                            productId &&
                            Number.isInteger(count) &&
                            count > 0 &&
                            count <= 100
                        ) {
                            for (let i = 0; i < count; i++) {
                                store.dispatch(addToCart({ productId }))
                            }
                        }
                    })
                }
            } catch (error) {
                console.error('Cart restore error:', error)
            }
        }

        // Save the cart whenever it changes
        const unsubscribe = store.subscribe(() => {
            try {
                localStorage.setItem(
                    'global-earth-cart',
                    JSON.stringify(store.getState().cart)
                )
            } catch (error) {
                console.error('Cart save error:', error)
            }
        })

        return unsubscribe
    }, [store])

    return <Provider store={store}>{children}</Provider>
}
