'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon, ShoppingCart, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

const ProductDetails = ({ product }) => {
    const productId = product?.id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'ج.م';

    const cart = useSelector(state => state.cart?.cartItems || {});
    const dispatch = useDispatch();
    const router = useRouter();

    const images = useMemo(() => {
        if (Array.isArray(product?.images)) {
            return product.images.filter(image => typeof image === 'string' && image.trim());
        }

        if (typeof product?.images === 'string') {
            try {
                const parsed = JSON.parse(product.images);
                if (Array.isArray(parsed)) {
                    return parsed.filter(image => typeof image === 'string' && image.trim());
                }
            } catch {
                return [product.images];
            }

            return [product.images];
        }

        return [];
    }, [product?.images]);

    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        setMainImage(images[0] || '');
    }, [images]);

    const ratings = Array.isArray(product?.rating) ? product.rating : [];
    const validRatings = ratings.filter(item => Number.isFinite(Number(item?.rating)));

    const averageRating = validRatings.length
        ? validRatings.reduce((sum, item) => sum + Number(item.rating), 0) / validRatings.length
        : 0;

    const price = Number(product?.price) || 0;
    const mrp = Number(product?.mrp) || 0;
    const hasDiscount = mrp > price && mrp > 0;
    const discount = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;
    const inCart = Boolean(cart[productId]);

    const addToCartHandler = () => {
        if (!productId) return;
        dispatch(addToCart({ productId }));
    };

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 py-6">
            {/* Product Images */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 min-w-0">
                {images.length > 1 && (
                    <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
                        {images.map((image, index) => (
                            <button
                                type="button"
                                key={`${image}-${index}`}
                                onClick={() => setMainImage(image)}
                                aria-label={`عرض الصورة ${index + 1}`}
                                aria-pressed={mainImage === image}
                                className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 p-2 rounded-xl border transition ${
                                    mainImage === image
                                        ? 'border-cyan-500 bg-cyan-50'
                                        : 'border-slate-200 bg-white hover:border-cyan-300'
                                }`}
                            >
                                <Image
                                    src={image}
                                    alt={`${product?.name || 'Product'} - ${index + 1}`}
                                    width={100}
                                    height={100}
                                    unoptimized
                                    className="w-full h-full object-contain"
                                />
                            </button>
                        ))}
                    </div>
                )}

                <div className="relative flex-1 min-w-0 h-[320px] sm:h-[420px] lg:h-[500px] rounded-2xl border border-slate-200 bg-white p-5 flex items-center justify-center overflow-hidden">
                    {mainImage ? (
                        <Image
                            src={mainImage}
                            alt={product?.name || 'Product'}
                            width={900}
                            height={900}
                            unoptimized
                            priority
                            className="max-w-full max-h-full w-auto h-auto object-contain"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                            <ShoppingCart size={42} />
                            <p>لا توجد صورة متاحة لهذا المنتج</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Information */}
            <div className="flex flex-col">
                <p className="text-sm font-semibold tracking-widest text-cyan-600 uppercase mb-3">
                    GLOBAL EARTH · Electronics
                </p>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-relaxed text-slate-900">
                    {product?.name || 'منتج إلكتروني'}
                </h1>

                <div className="flex items-center flex-wrap gap-2 mt-4">
                    <div className="flex items-center gap-1" aria-label={`التقييم ${averageRating.toFixed(1)} من 5`}>
                        {Array.from({ length: 5 }, (_, index) => (
                            <StarIcon
                                key={index}
                                size={17}
                                fill={averageRating >= index + 1 ? '#06b6d4' : '#e5e7eb'}
                                color={averageRating >= index + 1 ? '#06b6d4' : '#e5e7eb'}
                            />
                        ))}
                    </div>

                    <span className="text-sm text-slate-500">
                        {averageRating.toFixed(1)} ({validRatings.length} تقييم)
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-7">
                    <p className="text-3xl font-bold text-slate-900">
                        {price.toLocaleString('en-US')} {currency}
                    </p>

                    {hasDiscount && (
                        <p className="text-lg text-slate-400 line-through">
                            {mrp.toLocaleString('en-US')} {currency}
                        </p>
                    )}
                </div>

                {hasDiscount && (
                    <div className="flex items-center gap-2 mt-4 text-emerald-700">
                        <TagIcon size={18} />
                        <span className="text-sm font-semibold">
                            وفّر {discount}% على سعر المنتج
                        </span>
                    </div>
                )}

                {product?.description && (
                    <p className="mt-6 text-slate-600 leading-8 whitespace-pre-line">
                        {product.description}
                    </p>
                )}

                <div className="flex flex-wrap items-end gap-4 mt-8">
                    {inCart && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-semibold text-slate-700">الكمية</p>
                            <Counter productId={productId} />
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => inCart ? router.push('/cart') : addToCartHandler()}
                        className="flex items-center justify-center gap-3 min-h-12 px-8 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-cyan-600 transition active:scale-[0.98]"
                    >
                        <ShoppingCart size={19} />
                        {inCart ? 'عرض سلة المشتريات' : 'أضف إلى السلة'}
                    </button>
                </div>

                <hr className="border-slate-200 my-7" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 text-slate-600">
                        <EarthIcon className="text-cyan-600 shrink-0" size={22} />
                        <span className="text-sm">خدمات توصيل</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                        <ShieldCheck className="text-cyan-600 shrink-0" size={22} />
                        <span className="text-sm">تجربة شراء موثوقة</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                        <CreditCardIcon className="text-cyan-600 shrink-0" size={22} />
                        <span className="text-sm">خيارات دفع آمنة</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetails;