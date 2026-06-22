import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useStateGetter } from "../hooks/statehooks/UseStateGettersHook";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import PremiumManagement from "../pages/admin/PremiumManagement";
import SystemSettings from "../pages/admin/SystemSettings";
import EmailMarketing from "../pages/admin/EmailMarketing";

function AdminprotectedRoutes() {
  const { isAdmin } = useStateGetter();
  const navigate = useNavigate();
  const isadmin = isAdmin();
  
  useEffect(() => {
    if (!isadmin) {
      toast("Unauthorised Access");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [isadmin, navigate]);

  if (!isadmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized Access</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin panel.</p>
          <p className="text-sm text-gray-500">Redirecting you back to the main application...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="premium" element={<PremiumManagement />} />
        <Route path="settings" element={<SystemSettings />} />
        <Route path="emails" element={<EmailMarketing />} />
        <Route path="*" element={<Navigate to="/adminpanel" replace />} />
      </Route>
    </Routes>
  );
}

export default AdminprotectedRoutes;

