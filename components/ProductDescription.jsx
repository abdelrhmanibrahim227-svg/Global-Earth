'use client'

import { StarIcon, MessageSquareText } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ProductDescription = ({ product }) => {
    const [selectedTab, setSelectedTab] = useState('Description');

    const description = product?.description || 'لا يوجد وصف متاح لهذا المنتج حالياً.';
    const ratings = Array.isArray(product?.rating) ? product.rating : [];

    const validRatings = ratings.filter(
        item => item && Number.isFinite(Number(item.rating))
    );

    const formatDate = (date) => {
        if (!date) return '';

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return '';

        return parsedDate.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <section className="my-16 sm:my-20 text-slate-700">

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-8">
                <div className="flex gap-8">
                    <button
                        type="button"
                        onClick={() => setSelectedTab('Description')}
                        className={`relative pb-4 text-sm sm:text-base font-semibold transition ${
                            selectedTab === 'Description'
                                ? 'text-slate-950'
                                : 'text-slate-400 hover:text-slate-700'
                        }`}
                    >
                        وصف المنتج

                        {selectedTab === 'Description' && (
                            <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-cyan-500 rounded-full" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedTab('Reviews')}
                        className={`relative pb-4 text-sm sm:text-base font-semibold transition ${
                            selectedTab === 'Reviews'
                                ? 'text-slate-950'
                                : 'text-slate-400 hover:text-slate-700'
                        }`}
                    >
                        التقييمات ({validRatings.length})

                        {selectedTab === 'Reviews' && (
                            <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-cyan-500 rounded-full" />
                        )}
                    </button>
                </div>
            </div>

            {/* Product Description */}
            {selectedTab === 'Description' && (
                <div className="max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">
                        تفاصيل المنتج
                    </h2>

                    <p className="text-sm sm:text-base leading-8 whitespace-pre-line break-words">
                        {description}
                    </p>
                </div>
            )}

            {/* Product Reviews */}
            {selectedTab === 'Reviews' && (
                <div className="max-w-4xl">
                    {validRatings.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {validRatings.map((item, index) => {
                                const userName = item?.user?.name || 'عميل';
                                const userImage = item?.user?.image;

                                const rating = Math.min(
                                    5,
                                    Math.max(0, Number(item.rating))
                                );

                                return (
                                    <article
                                        key={item.id || index}
                                        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                                    >
                                        <div className="flex items-start gap-4">

                                            {/* Customer Image */}
                                            {userImage ? (
                                                <Image
                                                    src={userImage}
                                                    alt={userName}
                                                    width={48}
                                                    height={48}
                                                    unoptimized
                                                    className="w-12 h-12 shrink-0 rounded-full object-cover border border-slate-200"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 shrink-0 rounded-full bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                                                    {userName.charAt(0)}
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <p className="font-bold text-slate-900">
                                                        {userName}
                                                    </p>

                                                    <span className="text-xs text-slate-400">
                                                        {formatDate(item.createdAt)}
                                                    </span>
                                                </div>

                                                {/* Rating Stars */}
                                                <div
                                                    className="flex items-center gap-1 mt-2"
                                                    aria-label={`التقييم ${rating} من 5`}
                                                >
                                                    {Array.from({ length: 5 }, (_, starIndex) => (
                                                        <StarIcon
                                                            key={starIndex}
                                                            size={16}
                                                            fill={
                                                                rating >= starIndex + 1
                                                                    ? '#06b6d4'
                                                                    : '#e5e7eb'
                                                            }
                                                            color={
                                                                rating >= starIndex + 1
                                                                    ? '#06b6d4'
                                                                    : '#e5e7eb'
                                                            }
                                                        />
                                                    ))}
                                                </div>

                                                {/* Review Text */}
                                                {item.review ? (
                                                    <p className="mt-4 text-sm leading-7 text-slate-600 whitespace-pre-line break-words">
                                                        {item.review}
                                                    </p>
                                                ) : (
                                                    <p className="mt-4 text-sm text-slate-400">
                                                        لم يكتب العميل تعليقاً.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 sm:p-12 text-center">
                            <MessageSquareText
                                size={38}
                                className="mx-auto text-slate-400 mb-4"
                            />

                            <h3 className="text-lg font-bold text-slate-800">
                                لا توجد تقييمات حتى الآن
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                كن أول من يشارك رأيه حول هذا المنتج.
                            </p>
                        </div>
                    )}
                </div>
            )}

        </section>
    );
};

export default ProductDescription;