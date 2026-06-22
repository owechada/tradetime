import React, { useEffect, useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Menu, Transition, Dialog } from "@headlessui/react";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserActivity,
  grantPremiumAccess,
  revokePremiumAccess,
  grantTrialAccess,
  revokeTrialAccess,
  promoteToAdmin,
  revokeAdminPrivileges,
  bulkUpdateUsers,
  bulkDeleteUsers,
  toggleFreeTrialStatus,
} from "../../services/admin";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { InputField } from "../../components/forms";
import Button from "../../components/forms/Button";
import Spinner from "../../components/generic/Spinner";
import {
  FaUsers,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaCrown,
  FaUserClock,
  FaUserShield,
  FaEye,
  FaToggleOn,
  FaToggleOff,
  FaChevronDown,
  FaCheck,
  FaTimes,
  FaPlus,
  FaDownload,
  FaGift,
} from "react-icons/fa";

interface User {
  id: string;
  username: string;
  mail: string;
  trade_view_name?: string;
  createdAt: string;
  checked: number;
  is_admin: number;
  exp_date?: string;
  subExpiryDate?: string;
  is_trial?: string;
  subscription_id?: string;
  comment?: string;
  activation?: string;
  is_sub_before?: string;
  token?: string;
  ip?: string;
  mail_chimp?: string;
  updatedAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userActivity, setUserActivity] = useState<any>(null);
  const [bulkAction, setBulkAction] = useState("");

  const { setLoading: setGlobalLoading } = useStateSetter();
  const { control, handleSubmit, reset, setValue } = useForm();
  const {
    control: bulkControl,
    handleSubmit: handleBulkSubmit,
    reset: resetBulk,
  } = useForm();

  const statusOptions = [
    { value: "all", label: "All Users" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "premium", label: "Premium" },
    { value: "trial", label: "Trial" },
    { value: "free_trial_available", label: "Free Trial Available" },
    { value: "free_trial_used", label: "Free Trial Used" },
    { value: "admin", label: "Admin" },
  ];

  const bulkActions = [
    { value: "activate", label: "Activate Users" },
    { value: "deactivate", label: "Deactivate Users" },
    { value: "grant_premium", label: "Grant Premium" },
    { value: "revoke_premium", label: "Revoke Premium" },
    { value: "grant_trial", label: "Grant Trial" },
    { value: "revoke_trial", label: "Revoke Trial" },
    { value: "promote_admin", label: "Promote to Admin" },
    { value: "delete", label: "Delete Users" },
  ];

  const loadUsers = async () => {
    try {
      setLoading(true);
      setGlobalLoading(true);

      const response = await getAllUsers({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        status: statusFilter,
      });

      if (response.success) {
        const usersData = response.data || [];

        // Process users to add premium/trial status
        let processedUsers = usersData.map((user: any) => ({
          ...user,
          is_premium:
            user.exp_date &&
            user.subscription_id !== "NULL" &&
            new Date(user.exp_date) > new Date(),
          is_trial:
            user.is_trial && user.is_trial !== "NULL" && user.is_trial === "1",
        }));

        // Apply free trial status filter
        if (statusFilter === "free_trial_available") {
          processedUsers = processedUsers.filter((user: any) => user.subExpiryDate === "0");
        } else if (statusFilter === "free_trial_used") {
          processedUsers = processedUsers.filter((user: any) => user.subExpiryDate === "1");
        }

        setUsers(processedUsers);
        setTotalPages(response.pagination.pages || 0);
        setTotalUsers(response.pagination.total || 0);
      }
    } catch (error: any) {
      console.error("Error loading users:", error);
      toast.error(error.toString());
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const handleUserAction = async (
    action: string,
    userId: string,
    data?: any
  ) => {
    try {
      setGlobalLoading(true);
      let response;

      switch (action) {
        case "toggle_status":
          response = await toggleUserStatus(userId);
          break;
        case "grant_premium":
          response = await grantPremiumAccess(userId, data);
          break;
        case "revoke_premium":
          response = await revokePremiumAccess(userId);
          break;
        case "grant_trial":
          response = await grantTrialAccess(userId, data);
          break;
        case "revoke_trial":
          response = await revokeTrialAccess(userId);
          break;
        case "promote_admin":
          response = await promoteToAdmin(userId);
          break;
        case "revoke_admin":
          response = await revokeAdminPrivileges(userId);
          break;
        case "enable_free_trial":
          response = await toggleFreeTrialStatus(userId);
          break;
        case "disable_free_trial":
          response = await toggleFreeTrialStatus(userId);
          break;
        case "delete":
          response = await deleteUser(userId);
          break;
        default:
          throw new Error("Invalid action");
      }

      if (response.success) {
        toast.success(response.message || "Action completed successfully");
        loadUsers();
      }
    } catch (error: any) {
      console.error(`Error performing ${action}:`, error);
      toast.error(error.toString());
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleBulkAction = async (data: any) => {
    try {
      if (selectedUsers.length === 0) {
        toast.error("Please select users first");
        return;
      }

      setGlobalLoading(true);
      let response;

      switch (bulkAction) {
        case "activate":
          response = await bulkUpdateUsers(selectedUsers, { checked: 0 });
          break;
        case "deactivate":
          response = await bulkUpdateUsers(selectedUsers, { checked: 1 });
          break;
        case "grant_premium":
          for (const userId of selectedUsers) {
            await grantPremiumAccess(userId, { expiryDate: data.expiryDate });
          }
          response = {
            success: true,
            message: "Premium access granted to selected users",
          };
          break;
        case "revoke_premium":
          for (const userId of selectedUsers) {
            await revokePremiumAccess(userId);
          }
          response = {
            success: true,
            message: "Premium access revoked from selected users",
          };
          break;
        case "grant_trial":
          for (const userId of selectedUsers) {
            await grantTrialAccess(userId, { trialDays: data.trialDays || 7 });
          }
          response = {
            success: true,
            message: "Trial access granted to selected users",
          };
          break;
        case "revoke_trial":
          for (const userId of selectedUsers) {
            await revokeTrialAccess(userId);
          }
          response = {
            success: true,
            message: "Trial access revoked from selected users",
          };
          break;
        case "promote_admin":
          for (const userId of selectedUsers) {
            await promoteToAdmin(userId);
          }
          response = { success: true, message: "Users promoted to admin" };
          break;
        case "delete":
          response = await bulkDeleteUsers(selectedUsers);
          break;
        default:
          throw new Error("Invalid bulk action");
      }

      if (response.success) {
        toast.success(response.message || "Bulk action completed successfully");
        setSelectedUsers([]);
        setShowBulkModal(false);
        resetBulk();
        loadUsers();
      }
    } catch (error: any) {
      console.error("Error performing bulk action:", error);
      toast.error(error.toString());
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleEditUser = async (data: any) => {
    try {
      if (!selectedUser) return;

      setGlobalLoading(true);
      const response = await updateUser(selectedUser.id, data);

      if (response.success) {
        toast.success("User updated successfully");
        setShowUserModal(false);
        reset();
        loadUsers();
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.toString());
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleViewActivity = async (user: User) => {
    try {
      setSelectedUser(user);
      setGlobalLoading(true);
      const response = await getUserActivity(user.id);

      if (response.success) {
        setUserActivity(response.data);
        setShowActivityModal(true);
      }
    } catch (error: any) {
      console.error("Error loading user activity:", error);
      toast.error(error.toString());
    } finally {
      setGlobalLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setValue("username", user.username);
    setValue("mail", user.mail);
    setValue(
      "trade_view_name",
      user.trade_view_name && user.trade_view_name !== "NULL"
        ? user.trade_view_name
        : ""
    );
    setValue(
      "comment",
      user.comment && user.comment !== "NULL" ? user.comment : ""
    );
    setShowUserModal(true);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === users.length ? [] : users.map((user) => user.id)
    );
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, statusFilter]);

  const getStatusBadge = (user: User) => {
    const isPremium =
      user.exp_date &&
      user.subscription_id !== "NULL" &&
      new Date(user.exp_date) > new Date();
    const isTrial =
      user.is_trial && user.is_trial !== "NULL" && user.is_trial === "1";
    const isActive = user.checked === 0;
    const isAdmin = user.is_admin === 1;

    if (isAdmin) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
          Admin
        </span>
      );
    }
    if (isPremium) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
          Premium
        </span>
      );
    }
    if (isTrial) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
          Trial
        </span>
      );
    }
    if (isActive) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
          Active
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
        Inactive
      </span>
    );
  };

  const getFreeTrialBadge = (user: User) => {
    // Check if user has taken free trial based on subExpiryDate
    const hasTakenFreeTrial = user.subExpiryDate === "1";
    const canTakeFreeTrial = user.subExpiryDate === "0";
    
    if (hasTakenFreeTrial) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">
          Used
        </span>
      );
    }
    if (canTakeFreeTrial) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
          Available
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-gray-800 rounded-full">
        Not used
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FaUsers className="mr-3" />
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage users, permissions, and subscriptions
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => setShowBulkModal(true)}
              disabled={selectedUsers.length === 0}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <FaEdit className="h-4 w-4" />
              <span>Bulk Actions ({selectedUsers.length})</span>
            </button>
            <button
              onClick={loadUsers}
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <FaDownload className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users by username, email, or trade view name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing {users.length} of {totalUsers} users
            </span>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length === users.length && users.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Free Trial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                      <div className="text-sm text-gray-500">{user.mail}</div>
                      {user.trade_view_name &&
                        user.trade_view_name !== "NULL" && (
                          <div className="text-xs text-gray-400">
                            TV: {user.trade_view_name}
                          </div>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      {getStatusBadge(user)}
                      {user.checked === 0 ? (
                        <FaToggleOn className="text-green-500 h-5 w-5" />
                      ) : (
                        <FaToggleOff className="text-red-500 h-5 w-5" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      {getFreeTrialBadge(user)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>
                      <div>
                        Status: {user.checked === 0 ? "Active" : "Inactive"}
                      </div>
                      <div>Admin: {user.is_admin === 1 ? "Yes" : "No"}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                        <FaChevronDown className="h-4 w-4" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => openEditModal(user)}
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                >
                                  <FaEdit className="mr-3 h-4 w-4" />
                                  Edit User
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleViewActivity(user)}
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                >
                                  <FaEye className="mr-3 h-4 w-4" />
                                  View Activity
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() =>
                                    handleUserAction("toggle_status", user.id)
                                  }
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                >
                                  {user.checked === 0 ? (
                                    <FaToggleOff className="mr-3 h-4 w-4" />
                                  ) : (
                                    <FaToggleOn className="mr-3 h-4 w-4" />
                                  )}
                                  {user.checked === 0
                                    ? "Deactivate"
                                    : "Activate"}
                                </button>
                              )}
                            </Menu.Item>
                            {/* <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() =>
                                    handleUserAction("grant_premium", user.id)
                                  }
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                >
                                  <FaCrown className="mr-3 h-4 w-4" />
                                  Grant Premium
                                </button>
                              )}
                            </Menu.Item> */}
                            {/* <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() =>
                                    handleUserAction("grant_trial", user.id)
                                  }
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                >
                                  <FaUserClock className="mr-3 h-4 w-4" />
                                  Grant Trial
                                </button>
                              )}
                            </Menu.Item> */}
                            {user.is_admin === 0 ? (
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleUserAction("promote_admin", user.id)
                                    }
                                    className={`${
                                      active ? "bg-gray-100" : ""
                                    } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                  >
                                    <FaUserShield className="mr-3 h-4 w-4" />
                                    Promote to Admin
                                  </button>
                                )}
                              </Menu.Item>
                            ) : (
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleUserAction("revoke_admin", user.id)
                                    }
                                    className={`${
                                      active ? "bg-gray-100" : ""
                                    } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                  >
                                    <FaUserShield className="mr-3 h-4 w-4" />
                                    Revoke Admin
                                  </button>
                                )}
                              </Menu.Item>
                            )}
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    const action = user.subExpiryDate === "0" ? "disable_free_trial" : "enable_free_trial";
                                    const message = user.subExpiryDate === "0" 
                                      ? "Are you sure you want to disable free trial access for this user?" 
                                      : "Are you sure you want to enable free trial access for this user?";
                                    if (window.confirm(message)) {
                                      handleUserAction(action, user.id);
                                    }
                                  }}
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                >
                                  <FaGift className="mr-3 h-4 w-4" />
                                  {user.subExpiryDate === "0" ? "Disable Free Trial" : "Enable Free Trial"}
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to delete this user? This action cannot be undone."
                                      )
                                    ) {
                                      handleUserAction("delete", user.id);
                                    }
                                  }}
                                  className={`${
                                    active ? "bg-red-50" : ""
                                  } group flex w-full items-center px-4 py-2 text-sm text-red-700`}
                                >
                                  <FaTrash className="mr-3 h-4 w-4" />
                                  Delete User
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="bg-white border border-gray-300 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="bg-white border border-gray-300 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <Dialog
        open={showUserModal}
        onClose={() => setShowUserModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
              Edit User: {selectedUser?.username}
            </Dialog.Title>

            <form onSubmit={handleSubmit(handleEditUser)} className="space-y-4">
              <InputField
                control={control}
                name="username"
                title="Username"
                placeholder="Enter username"
                rules={{ required: "Username is required" }}
              />
              <InputField
                control={control}
                name="mail"
                title="Email"
                placeholder="Enter email"
                type="email"
                rules={{ required: "Email is required" }}
              />
              <InputField
                control={control}
                name="trade_view_name"
                title="TradingView Name"
                placeholder="Enter TradingView name"
              />
              <InputField
                control={control}
                name="comment"
                title="Admin Comment"
                placeholder="Add admin comment"
                isTextArea
              />

              <div className="flex space-x-3 pt-4">
                <Button
                  text="Save Changes"
                  onBtnClick={handleSubmit(handleEditUser)}
                  style="flex-1"
                />
                <Button
                  text="Cancel"
                  onBtnClick={() => setShowUserModal(false)}
                  outlined
                  style="flex-1"
                />
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* User Activity Modal */}
      <Dialog
        open={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
              User Activity: {selectedUser?.username}
            </Dialog.Title>

            {userActivity ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Saved Scans
                    </h3>
                    <p className="text-2xl font-bold text-primary">
                      {userActivity.savedScansCount || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Saved Strategies
                    </h3>
                    <p className="text-2xl font-bold text-primary">
                      {userActivity.savedStrategiesCount || 0}
                    </p>
                  </div>
                </div>

                {userActivity.recentActivity &&
                  userActivity.recentActivity.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Recent Activity
                      </h3>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {userActivity.recentActivity.map(
                          (activity: any, index: number) => (
                            <div
                              key={index}
                              className="bg-gray-50 p-3 rounded-lg"
                            >
                              <p className="text-sm text-gray-700">
                                {activity.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No activity data available for this user.
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                text="Close"
                onBtnClick={() => setShowActivityModal(false)}
                outlined
              />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Bulk Actions Modal */}
      <Dialog
        open={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
              Bulk Actions ({selectedUsers.length} users selected)
            </Dialog.Title>

            <form
              onSubmit={handleBulkSubmit(handleBulkAction)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Action
                </label>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Choose an action...</option>
                  {bulkActions.map((action) => (
                    <option key={action.value} value={action.value}>
                      {action.label}
                    </option>
                  ))}
                </select>
              </div>

              {bulkAction === "grant_premium" && (
                <InputField
                  control={bulkControl}
                  name="expiryDate"
                  title="Premium Expiry Date"
                  placeholder="Select expiry date"
                  type="datetime-local"
                />
              )}

              {bulkAction === "grant_trial" && (
                <InputField
                  control={bulkControl}
                  name="trialDays"
                  title="Trial Duration (days)"
                  placeholder="Enter number of days"
                  type="number"
                />
              )}

              <div className="flex space-x-3 pt-4">
                <Button
                  text="Execute Action"
                  onBtnClick={handleBulkSubmit(handleBulkAction)}
                  style="flex-1"
                />
                <Button
                  text="Cancel"
                  onBtnClick={() => setShowBulkModal(false)}
                  outlined
                  style="flex-1"
                />
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Spinner loading={loading} />
    </div>
  );
};

export default UserManagement;
