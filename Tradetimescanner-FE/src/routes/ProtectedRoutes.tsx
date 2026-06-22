import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/generic/Navbar";
import { Sidebar } from "../components/generic/Sidebar";
import Home from "../pages/home/Home";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../utils/authentication";

const ProtectedRoute = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 644px)",
  });

  const auth = useAuth();
  return auth ? (
    <div className="w-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {isDesktopOrLaptop && (
          <div className="w-[260px] z-50 flex-shrink-0">
            <Sidebar />
          </div>
        )}
        <div
          className={`flex-1 overflow-y-auto ${isDesktopOrLaptop ? "ml-0" : "w-full"
            }`}
        >
          <div className="min-h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};
export default ProtectedRoute;
