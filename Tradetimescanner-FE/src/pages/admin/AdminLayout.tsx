import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { 
  FaChartLine, 
  FaUsers, 
  FaCrown, 
  FaCog, 
  FaBars, 
  FaTimes,
  FaHome,
  FaSignOutAlt,
  FaUserShield,
  FaEnvelope
} from "react-icons/fa";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { authuser } = useStateGetter();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/adminpanel",
      icon: FaChartLine,
      description: "Overview and analytics"
    },
    {
      name: "User Management",
      path: "/adminpanel/users",
      icon: FaUsers,
      description: "Manage users and permissions"
    },
    {
      name: "Premium & Trials",
      path: "/adminpanel/premium",
      icon: FaCrown,
      description: "Subscription management"
    },
    {
      name: "Email Marketing",
      path: "/adminpanel/emails",
      icon: FaEnvelope,
      description: "Send promotional emails"
    },
    {
      name: "System Settings",
      path: "/adminpanel/settings",
      icon: FaCog,
      description: "System configuration"
    }
  ];

  const isActivePath = (path: string) => {
    if (path === "/adminpanel") {
      return location.pathname === "/adminpanel";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-primary text-white">
          <div className="flex items-center space-x-3">
            <FaUserShield className="h-8 w-8" />
            <div>
              <h1 className="text-lg font-bold">Admin Panel</h1>
              <p className="text-xs opacity-75">TradeTimeScanner</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
              {authuser?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{authuser?.username}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-3">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-3 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
                  isActivePath(item.path)
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${
                  isActivePath(item.path) ? 'text-white' : 'text-gray-400'
                }`} />
                <div>
                  <div>{item.name}</div>
                  <div className={`text-xs ${
                    isActivePath(item.path) ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t bg-white">
          <div className="space-y-2">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center px-3 py-2 text-left text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaHome className="mr-3 h-4 w-4 text-gray-400" />
              Back to App
            </button>
            <button
              onClick={() => {
                // Add logout functionality here
                navigate("/login");
              }}
              className="w-full flex items-center px-3 py-2 text-left text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt className="mr-3 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:w-[90%]  h-screen overflow-scroll">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <FaBars className="h-6 w-6 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <nav className="flex space-x-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActivePath(item.path)
                          ? 'bg-primary text-white'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{authuser?.username}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {authuser?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;