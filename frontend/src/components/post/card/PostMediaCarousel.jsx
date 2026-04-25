import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PostMediaCarousel = ({ images, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : 0);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : images.length - 1);
  };

  const currentImage = images[currentIndex];
  const isVideo = currentImage.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-white/10 max-h-[500px] bg-surface ${className}`}>
      {isVideo ? (
        <video
          src={currentImage}
          controls
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={currentImage}
          alt="Post media"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
        />
      )}

      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 px-2 py-1 rounded-full text-white text-xs">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

export default PostMediaCarousel;
