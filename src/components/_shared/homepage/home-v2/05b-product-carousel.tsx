'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import Image from 'next/image';

const ProductCarouselSection: React.FC = () => {
    const { websiteSubCategory } = useWebsiteSubCategory();
    const mainColor = websiteSubCategory?.main_color ?? '#0091FF';

    // Mock product data based on user request "program jualan bimbelio"
    // Using placeholder logic or assuming files exist in public/product/
    const products = [
        { id: 1, src: '/product/product-1.png', alt: 'Program Bimbel 1' },
        { id: 2, src: '/product/product-2.png', alt: 'Program Bimbel 2' },
        { id: 3, src: '/product/product-3.png', alt: 'Program Bimbel 3' },
        { id: 4, src: '/product/product-4.png', alt: 'Program Bimbel 4' },
        { id: 5, src: '/product/product-5.png', alt: 'Program Bimbel 5' },
        { id: 6, src: '/product/product-6.png', alt: 'Program Bimbel 6' },
    ];

    return (
        <section className="py-20 bg-gray-50 overflow-hidden relative">
            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .scroller {
                    animation: scroll 40s linear infinite;
                }
                .scroller:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
                 <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    Program Unggulan <span style={{ color: mainColor }}>Bimbelio</span>
                 </h2>
                 <p className="text-gray-500 max-w-2xl mx-auto">
                    Pilih paket belajar yang paling cocok dengan kebutuhan dan targetmu.
                 </p>
            </div>

            <div className="relative w-full">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none hidden md:block" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none hidden md:block" />

                <div className="flex w-max scroller gap-6 px-4">
                    {/* Render list twice to create seamless loop */}
                    {[...products, ...products].map((product, idx) => (
                        <div
                            key={`${product.id}-${idx}`}
                            className="relative flex-shrink-0 w-[300px] md:w-[400px] aspect-[4/3] rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white"
                        >
                           <Image
                                src={product.src}
                                alt={product.alt}
                                fill
                                className="object-cover"
                                // Use a placeholder if image fails to load (optional handling, but standard Next.js image might break if 404)
                                onError={(e) => {
                                    // Fallback if needed, but CSS styling is usually enough to hide broken image icon
                                    e.currentTarget.style.display = 'none'; // simple fallback
                                }}
                           />
                           {/* Overlay for "Sold Out" or tags can be added here */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductCarouselSection;
