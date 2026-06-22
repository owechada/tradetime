import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MdClose, MdChevronLeft, MdChevronRight } from 'react-icons/md';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string | string[];
  alt: string;
  title?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  src,
  alt,
  title = "Chart Annotation"
}) => {
  // Convert src to array for consistent handling
  const images = Array.isArray(src) ? src : [src];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  // Handle escape key and arrow keys
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, currentIndex]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Touch handlers for swipe gestures
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      {/* Modal Container */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full  overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {images.length > 1 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close (Esc)"
          >
            <MdClose size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Image Container with Navigation */}
        <div className="relative bg-gray-50">
          <div 
            className="p-4 flex items-center justify-center overflow-auto max-h-[calc(90vh-120px)]"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={images[currentIndex]}
              alt={`${alt} ${images.length > 1 ? `(${currentIndex + 1}/${images.length})` : ''}`}
              className="max-w-full h-auto rounded-lg shadow-lg"
              onLoad={() => {
                console.log('Image loaded in modal:', images[currentIndex]);
              }}
              onError={() => {
                console.error('Failed to load image in modal:', images[currentIndex]);
              }}
            />
          </div>

        
        </div>
  {/* Navigation Arrows - Only show if multiple images */}
  <div className=' flex justify-between w-full'>
  {images.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={handlePrevious}
                className=" left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Previous (←)"
              >
                <MdChevronLeft size={28} className="text-gray-800" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className=" right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Next (→)"
              >
                <MdChevronRight size={28} className="text-gray-800" />
              </button>
            </>
          )}

  </div>
        
        {/* Image Labels - Only show if multiple images */}
        {images.length > 1 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    index === currentIndex
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  title={`View ${index === 0 ? 'Call (Buy)' : 'Put (Sell)'} setup`}
                >
                  {index === 0 ? '📈 Call (Buy)' : '📉 Put (Sell)'}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 mt-3">
              {images.length > 1 && '💡 Swipe or use arrow keys to navigate between setups'}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ImageModal;