import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useResponsive } from '../../hooks/useResponsive';
import { MdClose } from 'react-icons/md';

export interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  preventScroll?: boolean;
}

const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  overlayClassName = '',
  preventScroll = true,
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle body scroll prevention
  useEffect(() => {
    if (!isOpen || !preventScroll) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen, preventScroll]);

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Get responsive modal classes
  const getModalClasses = () => {
    const baseClasses = 'bg-white rounded-lg shadow-xl transform transition-all';
    
    if (isMobile) {
      // Full screen on mobile for better UX
      return `${baseClasses} fixed inset-0 w-full h-full max-h-screen rounded-none`;
    }

    // Size classes for tablet and desktop
    const sizeClasses = {
      sm: 'max-w-sm w-full mx-4',
      md: 'max-w-md w-full mx-4',
      lg: 'max-w-lg w-full mx-4',
      xl: 'max-w-xl w-full mx-4',
      full: 'max-w-4xl w-full mx-4',
    };

    if (isTablet) {
      return `${baseClasses} ${sizeClasses[size]} max-h-[90vh]`;
    }

    return `${baseClasses} ${sizeClasses[size]} max-h-[85vh]`;
  };

  // Get overlay classes
  const getOverlayClasses = () => {
    const baseClasses = 'fixed inset-0 z-50 flex items-center justify-center transition-opacity';
    
    if (isMobile) {
      return `${baseClasses} bg-white`;
    }
    
    return `${baseClasses} bg-black bg-opacity-50 backdrop-blur-sm p-4`;
  };

  // Get content container classes
  const getContentClasses = () => {
    if (isMobile) {
      return 'flex flex-col h-full overflow-hidden';
    }
    return 'flex flex-col max-h-full overflow-hidden';
  };

  // Get header classes
  const getHeaderClasses = () => {
    if (isMobile) {
      return 'flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50';
    }
    return 'flex items-center justify-between p-6 border-b border-gray-200';
  };

  // Get body classes
  const getBodyClasses = () => {
    if (isMobile) {
      return 'flex-1 overflow-y-auto p-4';
    }
    return 'flex-1 overflow-y-auto p-6';
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`${getOverlayClasses()} ${overlayClassName}`}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`${getModalClasses()} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={getContentClasses()}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className={getHeaderClasses()}>
              {title && (
                <h2 className={`font-semibold text-gray-900 ${
                  isMobile ? 'text-lg' : 'text-xl'
                }`}>
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={`text-gray-400 hover:text-gray-600 transition-colors ${
                    isMobile ? 'p-1' : 'p-2'
                  }`}
                  aria-label="Close modal"
                >
                  <MdClose size={isMobile ? 20 : 24} />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className={getBodyClasses()}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ResponsiveModal;