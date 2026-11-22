
'use client'

import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'ج.م';

    const formatMoney = (value) =>
        `${Number(value || 0).toLocaleString('en-EG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} ${currency}`;

    const cartItems = useSelector(state => state.cart?.cartItems || {});
    const products = useSelector(state => state.product?.list || []);

    const dispatch = useDispatch();

    const cartArray = useMemo(() => {
        if (!Array.isArray(products)) return [];

        return Object.entries(cartItems)
            .map(([productId, quantity]) => {
                const product = products.find(
                    item => String(item.id) === String(productId)
                );

                if (!product) return null;

                let images = [];

                if (Array.isArray(product.images)) {
                    images = product.images;
                } else if (typeof product.images === 'string') {
                    try {
                        const parsed = JSON.parse(product.images);
                        images = Array.isArray(parsed)
                            ? parsed
                            : [product.images];
                    } catch {
                        images = [product.images];
                    }
                }

                return {
                    ...product,
                    images: images.filter(
                        image => typeof image === 'string' && image.trim()
                    ),
                    quantity: Number(quantity) || 0,
                };
            })
            .filter(item => item && item.quantity > 0);
    }, [cartItems, products]);

    const totalPrice = useMemo(() => {
        return cartArray.reduce(
            (total, item) => total + Number(item.price || 0) * item.quantity,
            0
        );
    }, [cartArray]);

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }));
    };

    return cartArray.length > 0 ? (
        <div className="min-h-screen mx-6 text-slate-800">
            <div className="max-w-7xl mx-auto">
                <PageTitle
                    heading="My Cart"
                    text="items in your cart"
                    linkText="Add more"
                />

                <div className="flex items-start justify-between gap-5 max-lg:flex-col">
                    <div className="w-full max-w-4xl overflow-x-auto">
                        <table className="w-full min-w-[600px] text-slate-600 table-auto">
                            <thead>
                                <tr className="max-sm:text-sm border-b border-slate-200">
                                    <th className="text-left py-3">Product</th>
                                    <th>Quantity</th>
                                    <th>Total Price</th>
                                    <th className="max-md:hidden">Remove</th>
                                </tr>
                            </thead>

                            <tbody>
                                {cartArray.map(item => (
                                    <tr key={item.id} className="border-b border-slate-100">
                                        <td className="py-4">
                                            <div className="flex gap-3 items-center">
                                                <div className="flex items-center justify-center bg-slate-100 size-18 rounded-md shrink-0">
                                                    {item.images.length > 0 ? (
                                                        <Image
                                                            src={item.images[0]}
                                                            className="h-14 w-full object-contain"
                                                            alt={item.name || 'Product'}
                                                            width={70}
                                                            height={70}
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <ShoppingCart className="text-slate-400" />
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="max-sm:text-sm font-medium">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {item.category}
                                                    </p>
                                                    <p className="text-sm mt-1">
                                                        {formatMoney(item.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="text-center">
                                            <Counter productId={item.id} />
                                        </td>

                                        <td className="text-center font-semibold">
                                            {formatMoney(Number(item.price || 0) * item.quantity)}
                                        </td>

                                        <td className="text-center max-md:hidden">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteItemFromCart(item.id)}
                                                aria-label={`Remove ${item.name} from cart`}
                                                className="text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all"
                                            >
                                                <Trash2Icon size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <OrderSummary
                        totalPrice={totalPrice}
                        items={cartArray}
                    />
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] mx-6 flex flex-col gap-4 items-center justify-center text-slate-400">
            <ShoppingCart size={48} />
            <h1 className="text-2xl sm:text-4xl font-semibold">
                Your cart is empty
            </h1>
        </div>
    );
}