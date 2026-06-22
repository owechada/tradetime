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
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      <div className={getSidebarClasses()}>
        {/* Mobile close button */}
        {isMobile && isOverlay && (
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <IoMdMenu size={20} className="text-gray-600" />
            </button>
          </div>
        )}

        <div className={`${isMobile && isOverlay ? 'px-4 pb-6' : isTablet ? 'p-4' : 'p-6'} ${
          isTablet && isCollapsed ? 'px-2' : ''
        }`}>
          <div className={`${isTablet && isCollapsed ? 'mb-4' : 'mb-8'}`}>
                {(!isTablet || !isCollapsed) && (
              <>
                <h2 className={`font-bold text-gray-900 mb-2 ${
                  isMobile ? 'text-base' : 'text-lg'
                }`}>Navigation</h2>
                <div className="w-12 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full"></div>
              </>
            )}
          </div>

          <nav className="space-y-2">
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
              className={`group relative p-3 rounded-xl cursor-pointer font-medium text-sm transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary shadow-sm border border-primary/20"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                      ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md"
                      : "bg-gray-100 group-hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  {item.icon}
                </div>
                {(!isTablet || !isCollapsed) && (
                  <span
                    className={`font-medium ${
                      isActive ? "text-primary" : "text-gray-700"
                    }`}
                  >
                    {item.name}
                  </span>
                )}
              </div>

              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-blue-600 rounded-r-full"></div>
              )}
            </div>
          );
        })}
      </nav>

          {(!isTablet || !isCollapsed) && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-500 font-medium mb-3">
                Quick Stats
              </div>
              <div className="space-y-2">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 font-medium">
                    Market Coverage
                  </div>
                  <div className="text-lg font-bold text-blue-700">Global</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { Sidebar };
