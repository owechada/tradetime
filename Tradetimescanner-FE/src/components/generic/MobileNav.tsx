import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sidebarItems } from "../../constants/data/data";
import { useResponsive } from "../../hooks/useResponsive";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

interface MobileNavProps {
  show: (visible: boolean) => void;
  isVisible: boolean;
}

interface NavigationItem {
  name: string;
  url: string;
  title: string;
  icon: React.ReactNode;
}

const MobileNav = ({ show, isVisible }: MobileNavProps): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  
  // Responsive hooks
  const { isMobile, isTablet, orientation } = useResponsive();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Handle click outside to close navigation
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        show(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        show(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when nav is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible, show]);

  // Handle navigation item click
  const handleNavigation = (item: NavigationItem) => {
    // External links
    if (item.url.startsWith('http')) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(item.url);
    }
    show(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, item: NavigationItem) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation(item);
    }
  };

  // Dynamic positioning based on screen size and orientation
  const getPositionClasses = () => {
    const baseClasses = "absolute z-[3000000] bg-customBlack rounded-[8px] shadow-2xl";
    
    if (isMobile) {
      if (orientation === 'portrait') {
        // Portrait mobile: full width with margins
        return `${baseClasses} left-4 right-4 top-16 max-h-[calc(100vh-5rem)]`;
      } else {
        // Landscape mobile: smaller width, positioned right
        return `${baseClasses} right-4 top-12 w-64 max-h-[calc(100vh-4rem)]`;
      }
    } else if (isTablet) {
      // Tablet: medium width, right positioned
      return `${baseClasses} right-6 top-14 w-72 max-h-[calc(100vh-5rem)]`;
    } else {
      // Desktop fallback (shouldn't normally be used)
      return `${baseClasses} right-5 top-12 min-w-[200px] max-w-[280px]`;
    }
  };

  // Animation classes based on user preference
  const getAnimationClasses = () => {
    if (prefersReducedMotion) {
      return isVisible ? "opacity-100" : "opacity-0 pointer-events-none";
    }
    
    return isVisible 
      ? "opacity-100 transform translate-y-0 scale-100" 
      : "opacity-0 transform translate-y-[-10px] scale-95 pointer-events-none";
  };

  const transitionClasses = prefersReducedMotion 
    ? "transition-opacity duration-200 ease-in-out"
    : "transition-all duration-300 ease-out";

  return (
    <div
      ref={navRef}
      className={`${getPositionClasses()} ${getAnimationClasses()} ${transitionClasses}`}
      role="navigation"
      aria-label="Mobile navigation menu"
      aria-hidden={!isVisible}
    >
      <div className="p-4 overflow-y-auto max-h-full">
        <nav role="list">
          {sidebarItems.map((item: NavigationItem, index: number) => {
            const isActive = pathname.toLowerCase().includes(item.name.toLowerCase());
            const isExternal = item.url.startsWith('http');
            
            return (
              <div
                key={`${item.name}-${index}`}
                className={`
                  my-2 p-3 rounded-lg cursor-pointer text-sm font-medium
                  transition-all duration-200 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-customBlack
                  hover:bg-gray-800 hover:transform hover:scale-[1.02]
                  active:transform active:scale-[0.98]
                  min-h-[44px] flex items-center gap-3
                  ${isActive 
                    ? "bg-[#F2F2FD] text-customBlack font-semibold shadow-sm" 
                    : "text-white hover:text-gray-200"
                  }
                  ${isMobile ? 'text-base p-4 min-h-[48px]' : ''}
                `}
                onClick={() => handleNavigation(item)}
                onKeyDown={(e) => handleKeyDown(e, item)}
                tabIndex={isVisible ? 0 : -1}
                role="button"
                aria-label={`Navigate to ${item.name}${isExternal ? ' (opens in new tab)' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span 
                  className={`flex-shrink-0 ${isMobile ? 'text-lg' : 'text-base'}`}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <span className="flex-1 text-left">
                  {item.name}
                </span>
                {isExternal && (
                  <span 
                    className="flex-shrink-0 text-xs opacity-70"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      
      {/* Backdrop for mobile */}
      {isMobile && isVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[-1]"
          onClick={() => show(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export { MobileNav };
export default MobileNav;