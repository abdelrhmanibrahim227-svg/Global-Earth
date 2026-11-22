
'use client'

import { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '../lib/store'
import { setProduct } from '../lib/features/product/productSlice'

export default function StoreProvider({ children }) {
    const storeRef = useRef(null)

    if (!storeRef.current) {
        storeRef.current = makeStore()
    }

    useEffect(() => {
        let cancelled = false

        async function loadProducts() {
            try {
                const response = await fetch('/api/products', {
                    method: 'GET',
                    cache: 'no-store',
                    credentials: 'include'
                })

                const result = await response.json()

                if (!response.ok) {
                    throw new Error(
                        result?.error ||
                        result?.message ||
                        `Failed to load products: ${response.status}`
                    )
                }

                const products = Array.isArray(result)
                    ? result
                    : Array.isArray(result?.products)
                        ? result.products
                        : Array.isArray(result?.data)
                            ? result.data
                            : []

                console.log(
                    'GLOBAL EARTH HOME PRODUCTS:',
                    products.length
                )

                if (!cancelled) {
                    // Load ALL products without filtering by inStock
                    storeRef.current.dispatch(setProduct(products))
                }

            } catch (error) {
                console.error(
                    'HOME PRODUCTS LOADING ERROR:',
                    error
                )
            }
        }

        loadProducts()

        return () => {
            cancelled = true
        }
    }, [])

    return (
        <Provider store={storeRef.current}>
            {children}
        </Provider>
    )
}
