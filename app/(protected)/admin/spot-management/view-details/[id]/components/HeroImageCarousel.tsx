'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroImageCarouselProps {
    images: string[];
    title: string;
    amenities: string[];
}

/**
 * HeroImageCarousel Component
 * Displays a carousel of spot images with navigation arrows and indicator dots.
 */
export default function HeroImageCarousel({ images, title, amenities }: HeroImageCarouselProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    return (
        <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden shadow-sm relative group">
            {images && images.length > 0 ? (
                <>
                    <img 
                        src={images[currentImageIndex]} 
                        alt={`${title} image ${currentImageIndex + 1}`} 
                        className="w-full h-full object-cover transition-opacity duration-300" 
                    />
                    {images.length > 1 && (
                        <>
                            <button 
                                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                            <div className="absolute bottom-4 right-4 flex gap-1.5">
                                {images.map((_: any, idx: number) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400">
                    No Image Available
                </div>
            )}
            <div className="absolute bottom-4 left-4 flex gap-2">
                {amenities.map((amenity: string) => (
                    <span key={amenity} className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-medium text-gray-700 rounded-full shadow-sm">
                        {amenity}
                    </span>
                ))}
            </div>
        </div>
    );
}
