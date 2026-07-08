'use client';

import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  mainImage: string;
  galleryImages?: string[];
  productName: string;
  sku?: string;
}

export default function ProductImageGallery({ mainImage, galleryImages = [], productName, sku }: ProductImageGalleryProps) {
  // Combine main image + gallery into one list, deduped
  const allImages = [mainImage, ...galleryImages.filter(img => img && img !== mainImage)].filter(Boolean);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const selectedImage = allImages[selectedIndex] || '';

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }, []);

  const handleMouseEnter = useCallback(() => setIsZooming(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsZooming(false);
    setZoomPosition({ x: 50, y: 50 });
  }, []);

  const goToPrev = () => setSelectedIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  const goToNext = () => setSelectedIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));

  return (
    <div className="product-gallery-wrapper">
      {/* Main Image with Zoom */}
      <div
        ref={imageContainerRef}
        className="product-gallery-main"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {selectedImage ? (
          <div className="product-gallery-zoom-container">
            <img
              src={selectedImage}
              alt={productName}
              className={`product-gallery-img ${isZooming ? 'product-gallery-img--zooming' : ''}`}
              style={isZooming ? {
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: 'scale(2.5)',
              } : undefined}
              draggable={false}
            />
          </div>
        ) : (
          <div className="text-xs text-slate-400">No Image Available</div>
        )}

        {/* Navigation Arrows (only if > 1 image) */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              className="product-gallery-nav product-gallery-nav--left"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="product-gallery-nav product-gallery-nav--right"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* SKU Badge */}
        {sku && (
          <span className="absolute top-4 left-4 bg-white border border-blue-100 px-3 py-1 rounded-lg text-[10px] font-mono text-blue-700 uppercase shadow-sm notranslate z-10">
            SKU: {sku}
          </span>
        )}

        {/* Image counter */}
        {allImages.length > 1 && (
          <span className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
            {selectedIndex + 1} / {allImages.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="product-gallery-thumbs">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`product-gallery-thumb ${i === selectedIndex ? 'product-gallery-thumb--active' : ''}`}
            >
              <img src={img} alt={`${productName} view ${i + 1}`} draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
