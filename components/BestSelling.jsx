'use client'

import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const BestSelling = () => {
    const displayQuantity = 8
    const products = useSelector(state => state.product?.list)
    const productList = Array.isArray(products) ? products : []

    const getRatingCount = (product) =>
        Array.isArray(product?.rating) ? product.rating.length : 0

    const bestSellingProducts = [...productList]
        .sort((a, b) => getRatingCount(b) - getRatingCount(a))
        .slice(0, displayQuantity)

    return (
        <div className="px-6 my-30 max-w-6xl mx-auto">
            <Title
                title="Best Selling"
                description={`Showing ${Math.min(productList.length, displayQuantity)} of ${productList.length} products`}
                href="/shop"
            />

            <div className="mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12">
                {bestSellingProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {productList.length === 0 && (
                <p className="mt-6 text-center text-slate-500">
                    لا توجد منتجات متاحة حاليًا.
                </p>
            )}
        </div>
    )
}

export default BestSelling
