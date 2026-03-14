'use client';

import Image from 'next/image';

interface ProductProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
    isGold?: boolean;
    rating?: number;
    onSelect?: () => void;
}

export default function ProductCard({ id, name, price, image, isGold, rating = 5, onSelect }: ProductProps) {
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                // Full Star
                stars.push(
                    <svg key={i} className="w-3.5 h-3.5 text-[#eab308]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
                // Half Star
                stars.push(
                    <div key={i} className="relative w-3.5 h-3.5">
                        <svg className="absolute inset-0 w-3.5 h-3.5 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div className="absolute inset-0 overflow-hidden w-[50%]">
                            <svg className="w-3.5 h-3.5 text-[#eab308]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                    </div>
                );
            } else {
                // Empty Star
                stars.push(
                    <svg key={i} className="w-3.5 h-3.5 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            }
        }
        return stars;
    };

    return (
        <div
            onClick={onSelect}
            className={`card-bg rounded-2xl p-4 flex flex-col relative group transition-all duration-300 cursor-pointer hover:scale-[1.02] ${isGold ? 'neon-border-gold' : 'neon-border-purple'}`}
        >

            {/* Heart Icon (Top Right) */}
            <button className="absolute top-4 right-4 z-10 text-white/40 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            {/* Product Image */}
            <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-black/20 flex items-center justify-center p-4">
                <Image
                    src={image}
                    alt={name}
                    width={400}
                    height={400}
                    className="object-contain h-full w-full mix-blend-lighten group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-1 mt-auto">
                <h3 className="text-white font-medium text-lg truncate pr-2">
                    {name}
                </h3>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mt-1 mb-3">
                    {renderStars()}
                </div>

                {/* Price and Buy Now */}
                <div className="flex items-center justify-between mt-1">
                    <span className="text-xl font-bold text-[#eab308]">
                        ${price}
                    </span>
                    <button
                        className="neon-button text-sm px-5 py-1.5"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}
