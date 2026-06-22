import { Menu, Transition } from "@headlessui/react";
import { IoIosSettings, IoMdMenu } from "react-icons/io";
import { Fragment } from "react/jsx-runtime";
import { icon, logo } from "../../constants/imports";
import { MdLogout, MdOutlineWorkspacePremium } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { RiAdminFill } from "react-icons/ri";
import { useResponsive } from "../../hooks/useResponsive";
import { useAccessibility } from "../../hooks/useAccessibility";
import SkipLinks from "../responsive/SkipLinks";
import MobileNav from "./MobileNav";

export default () => {
  var dispatcher = useDispatch();
  var navigate = useNavigate();
  const { authuser, isAdmin } = useStateGetter();
  const [showmobilenav, setshowmobilenav] = useState(false);
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { getAccessibilityClasses } = useAccessibility({
    componentType: 'navigation',
    size: 'md'
  });

  const logout = () => {
    localStorage.clear();
    dispatcher({ type: "set-auth-user", payload: {} });
    navigate("/login");
  };

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 644px)",
  });
  return (
    <>
      <SkipLinks />
      <nav
        id="navigation"
        role="navigation"
        aria-label="Main navigation"
        className={`w-screen shadow-lg border-b border-gray-200 z-[100] bg-white/95 backdrop-blur-sm flex justify-between items-center ${isMobile ? 'h-14 px-4' : isTablet ? 'h-16 px-5' : 'h-[10vh] px-6'
          }`}
      >
        <div className="flex items-center">
          <button
            onClick={() => navigate("/dashboard")}
            className={getAccessibilityClasses(`cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none p-1 rounded-lg`)}
            aria-label="Go to dashboard"
          >
            <img
              src={icon}
              alt="TradeTimeScanner Logo"
              className={`${isMobile ? 'w-12' : isTablet ? 'w-16' : 'w-[75px]'
                }`}
            />
          </button>
          {/* Responsive tagline display - hide on mobile, show abbreviated on tablet */}
          <div className={`${isMobile ? 'hidden' : 'block'} ml-2`}>
            <div className={`text-gray-500 font-semibold ${isTablet ? 'text-xs' : 'text-xs'
              }`}>
              TradeTimeScanner
            </div>
            <div className={`text-gray-400 ${isTablet ? 'text-xs hidden' : 'text-xs'
              }`}>
              Professional Trading Analysis
            </div>
          </div>
        </div>

        <div className={`flex justify-center items-center ${isMobile ? 'space-x-2' : 'space-x-4'
          }`}>
          <Menu as="div" className="self-center">
            <div>
              <Menu.Button className={getAccessibilityClasses(`p-1 flex text-sm rounded-full transition-all duration-200 hover:bg-gray-50 ${isMobile ? 'p-0.5' : 'p-1'
                }`)} aria-label="User menu">
                <div className={`bg-gradient-to-r from-primary to-blue-600 self-center rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow ${isMobile ? 'p-1.5' : 'p-2'
                  }`}>
                  <FaUserCircle size={isMobile ? 20 : 24} className="text-white" />
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95">

              <Menu.Items className={`origin-top-right absolute right-0 mt-2 rounded-lg shadow-xl p-2 bg-white/95 backdrop-blur-sm ring-1 ring-gray-200 py-3 z-[135454545454] focus:outline-none border border-gray-100 ${isMobile ? 'w-48 -mr-2' : isTablet ? 'w-52' : 'w-56'
                }`}>
                <Menu.Item>
                  <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 flex rounded-lg mb-2">
                    <div className="w-10 p-3 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white font-semibold text-sm">
                        {authuser && authuser.username
                          ? authuser.username.charAt(0).toUpperCase()
                          : "U"}
                      </span>
                    </div>
                    <div className="text-gray-100">
                      <p className="text-sm font-medium">
                        {authuser && authuser.username}
                      </p>
                      <p className="text-xs text-gray-300 truncate">
                        {authuser && authuser.mail}
                      </p>
                    </div>
                  </div>
                </Menu.Item>

                <div className="border-t border-gray-200 my-2"></div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${active
                          ? "bg-gradient-to-r from-yellow-50 to-orange-50"
                          : ""
                        } block text-sm rounded-lg p-3 text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 flex items-center space-x-3`}
                      onClick={() => {
                        navigate("/premium");
                      }}
                    >
                      <MdOutlineWorkspacePremium className="text-yellow-600 text-lg" />
                      <span className="font-medium">Premium</span>
                    </button>
                  )}
                </Menu.Item>
                {isAdmin() && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? "bg-gradient-to-r from-red-50 to-pink-50" : ""
                          } block text-sm rounded-lg p-3 text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 flex items-center space-x-3`}
                        onClick={() => {
                          navigate("/adminpanel");
                        }}
                      >
                        <RiAdminFill className="text-red-600 text-lg" />
                        <span className="font-medium">Admin Panel</span>
                      </button>
                    )}
                  </Menu.Item>
                )}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${active ? "bg-gradient-to-r from-red-50 to-pink-50" : ""
                        } block text-sm rounded-lg p-3 text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 flex items-center space-x-3`}
                      onClick={logout}
                    >
                      <MdLogout className="text-red-600 text-lg" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>

          {!isDesktopOrLaptop && (
            <button
              onClick={() => {
                setshowmobilenav((prev) => !prev);
              }}
              className={getAccessibilityClasses(`rounded-lg hover:bg-gray-100 transition-colors ${isMobile ? 'p-1.5' : 'p-2'
                }`)}
              aria-label="Toggle mobile navigation"
              aria-expanded={showmobilenav}
              aria-controls="mobile-navigation"
            >
              <IoMdMenu className="text-primary" size={isMobile ? 20 : 24} />
            </button>
          )}
        </div>
        <MobileNav show={setshowmobilenav} isVisible={showmobilenav} />
      </nav>
      <main id="main-content" tabIndex={-1}>
        {/* Main content will be rendered here by the router */}
      </main>
    </>
  );

};
