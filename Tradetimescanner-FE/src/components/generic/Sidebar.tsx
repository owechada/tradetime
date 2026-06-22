import { useLocation, useNavigate } from "react-router-dom";
import { sidebarItems } from "../../constants/data/data";
import { useEffect, useState } from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { IoMdClose, IoMdMenu } from "react-icons/io";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isOverlay?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ 
  isCollapsed = false, 
  onToggleCollapse, 
  isOverlay = false, 
  onClose 
}: SidebarProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Handle responsive behavior
  const getSidebarClasses = () => {
    let baseClasses = "bg-white/95 backdrop-blur-sm shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out";
    
    if (isMobile) {
      // Mobile: Full overlay mode
      return `${baseClasses} fixed inset-y-0 left-0 z-50 w-64 transform ${
        isOverlay ? 'translate-x-0' : '-translate-x-full'
      }`;
    } else if (isTablet) {
      // Tablet: Collapsible mode
      return `${baseClasses} ${isCollapsed ? 'w-16' : 'w-64'}`;
    } else {
      // Desktop: Full width
      return `${baseClasses} w-[260px]`;
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && isOverlay && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div className={getSidebarClasses()}>
        {/* Mobile close button */}
        {isMobile && isOverlay && (
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <IoMdClose size={20} className="text-gray-600" />
            </button>
          </div>
        )}

        {/* Tablet collapse toggle */}
        {isTablet && onToggleCollapse && (
          <div className="flex justify-end p-4">
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <IoMdMenu size={20} className="text-gray-600" />
            </button>
          </div>
        )}

        <div className={`${isMobile && isOverlay ? 'px-4 pb-6' : isTablet ? 'p-4' : 'p-5'} ${
          isTablet && isCollapsed ? 'px-2' : ''
        }`}>
          <div className={`${isTablet && isCollapsed ? 'mb-4' : 'mb-6'}`}>
                {(!isTablet || !isCollapsed) && (
              <>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Menu</p>
                <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-full"></div>
              </>
            )}
          </div>

          <nav className="space-y-1">
        {sidebarItems.map((item: any, index: number) => {
          const isActive =
            item.url
              .replace("-", "")
              .toLowerCase()
              .includes(pathname.slice(1).replace(/-/g, " ").toLowerCase()) &&
            pathname.slice(1) != "";

          return (
            <div
              key={index}
              className={`group relative p-2.5 rounded-xl cursor-pointer font-medium text-sm transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-blue-600/5 text-primary border border-primary/15"
                  : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900"
              }`}
              onClick={() => {
                if (item.name.toLowerCase().includes("telegram")) {
                  window.location.href = item.url;
                } else {
                  navigate(item.url);
                }
              }}
            >
              <div className={`flex items-center ${isTablet && isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                <div
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md shadow-primary/25"
                      : "bg-gray-100/80 group-hover:bg-gray-200/80 text-gray-500 group-hover:text-gray-700"
                  }`}
                >
                  {item.icon}
                </div>
                {(!isTablet || !isCollapsed) && (
                  <span
                    className={`font-medium text-[13px] ${
                      isActive ? "text-primary" : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                  </span>
                )}
              </div>

              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-gradient-to-b from-primary to-blue-600 rounded-r-full"></div>
              )}
            </div>
          );
        })}
      </nav>

          {(!isTablet || !isCollapsed) && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="bg-gradient-to-br from-primary/5 to-blue-600/5 p-4 rounded-xl border border-primary/10">
                <div className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-1">
                  Coverage
                </div>
                <div className="text-base font-bold text-gray-900">Global Markets</div>
                <p className="text-xs text-gray-500 mt-1">Forex, Crypto, Indices</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { Sidebar };
