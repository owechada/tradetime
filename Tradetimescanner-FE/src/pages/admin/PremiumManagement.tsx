import React, { useEffect, useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Dialog } from "@headlessui/react";
import {
  getAllUsers,
  grantPremiumAccess,
  revokePremiumAccess,
  grantTrialAccess,
  revokeTrialAccess,
} from "../../services/admin";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { InputField } from "../../components/forms";
import Button from "../../components/forms/Button";
import Spinner from "../../components/generic/Spinner";
import {
  FaCrown,
  FaUserClock,
  FaSearch,
  FaFilter,
  FaPlus,
  FaTimes,
  FaCalendarAlt,
  FaGift,
  FaChartLine,
} from "react-icons/fa";

interface User {
  id: string;
  username: string;
  mail: string;
  premium_expiry?: string;
  trial_expiry?: string;
  subscription_id?: string;
  is_premium: boolean;
  is_trial: boolean;
  createdAt: string;
}

const PremiumManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalPremium: 0,
    totalTrial: 0,
    expiringPremium: 0,
    expiringTrial: 0,
  });

  const { setLoading: setGlobalLoading } = useStateSetter();
  const {
    control: premiumControl,
    handleSubmit: handlePremiumSubmit,
    reset: resetPremium,
  } = useForm();
  const {
    control: trialControl,
    handleSubmit: handleTrialSubmit,
    reset: resetTrial,
  } = useForm();

  const statusOptions = [
    { value: "all", label: "All Users" },
    { value: "premium", label: "Premium Only" },
    { value: "trial", label: "Trial Only" },
    { value: "expired_premium", label: "Expired Premium" },
    { value: "expired_trial", label: "Expired Trial" },
    { value: "no_subscription", label: "No Subscription" },
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
        const usersData = response.data.users || [];
        // Process users to add premium/trial status
        const processedUsers = usersData.map((user: any) => ({
          ...user,
          is_premium:
            user.premium_expiry && new Date(user.premium_expiry) > new Date(),
          is_trial:
            user.trial_expiry && new Date(user.trial_expiry) > new Date(),
        }));

        setUsers(processedUsers);
        setTotalPages(response.data.totalPages || 0);

        // Calculate stats
        const totalPremium = processedUsers.filter(
          (u: User) => u.is_premium
        ).length;
        const totalTrial = processedUsers.filter(
          (u: User) => u.is_trial
        ).length;
        const now = new Date();
        const oneWeekFromNow = new Date(
          now.getTime() + 7 * 24 * 60 * 60 * 1000
        );

        const expiringPremium = processedUsers.filter(
          (u: User) =>
            u.premium_expiry &&
            new Date(u.premium_expiry) > now &&
            new Date(u.premium_expiry) <= oneWeekFromNow
        ).length;

        const expiringTrial = processedUsers.filter(
          (u: User) =>
            u.trial_expiry &&
            new Date(u.trial_expiry) > now &&
            new Date(u.trial_expiry) <= oneWeekFromNow
        ).length;

        setStats({
          totalPremium,
          totalTrial,
          expiringPremium,
          expiringTrial,
        });
      }
    } catch (error: any) {
      console.error("Error loading users:", error);
      toast.error(error.toString());
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const handleGrantPremium = async (data: any) => {
    try {
      if (!selectedUser) return;

      setGlobalLoading(true);
      const response = await grantPremiumAccess(selectedUser.id, {
        expiryDate: data.expiryDate,
        subscriptionId: data.subscriptionId,
      });

      if (response.success) {
        toast.success("Premium access granted successfully");
        setShowPremiumModal(false);
        resetPremium();
        loadUsers();
      }
    } catch (error: any) {
      console.error("Error granting premium:", error);
      toast.error(error.toString());
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleGrantTrial = async (data: any) => {
    try {
      if (!selectedUser) return;

      setGlobalLoading(true);
      const response = await grantTrialAccess(selectedUser.id, {
        trialDays: data.trialDays || 7,
      });

      if (response.success) {
        toast.success("Trial access granted successfully");
        setShowTrialModal(false);
        resetTrial();
        loadUsers();
      }
    } catch (error: any) {
      console.error("Error granting trial:", error);
      toast.error(error.toString());
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleRevokePremium = async (userId: string) => {
    try {
      setGlobalLoading(true);
      const response = await revokePremiumAccess(userId);

      if (response.success) {
        toast.success("Premium access revoked successfully");
        loadUsers();
      }
    } catch (error: any) {
      console.error("Error revoking premium:", error);
      toast.error(error.toString());
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleRevokeTrial = async (userId: string) => {
    try {
      setGlobalLoading(true);
      const response = await revokeTrialAccess(userId);

      if (response.success) {
        toast.success("Trial access revoked successfully");
        loadUsers();
      }
    } catch (error: any) {
      console.error("Error revoking trial:", error);
      toast.error(error.toString());
    } finally {
      setGlobalLoading(false);
    }
  };

  const openPremiumModal = (user: User) => {
    setSelectedUser(user);
    // Set default expiry to 30 days from now
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 30);
    setShowPremiumModal(true);
  };

  const openTrialModal = (user: User) => {
    setSelectedUser(user);
    setShowTrialModal(true);
  };

  const getDaysRemaining = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate: string) => {
    const daysRemaining = getDaysRemaining(expiryDate);

    if (daysRemaining < 0) {
      return { text: "Expired", color: "bg-red-100 text-red-800" };
    } else if (daysRemaining <= 7) {
      return {
        text: `${daysRemaining} days left`,
        color: "bg-yellow-100 text-yellow-800",
      };
    } else {
      return {
        text: `${daysRemaining} days left`,
        color: "bg-green-100 text-green-800",
      };
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, statusFilter]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FaCrown className="mr-3 text-yellow-500" />
              Premium & Trial Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage user subscriptions and trial access
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={loadUsers}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <FaChartLine className="h-4 w-4" />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Premium Users"
          value={stats.totalPremium}
          icon={FaCrown}
          color="bg-yellow-500"
          subtitle="Active subscriptions"
        />
        <StatCard
          title="Trial Users"
          value={stats.totalTrial}
          icon={FaUserClock}
          color="bg-green-500"
          subtitle="Active trials"
        />
        <StatCard
          title="Expiring Premium"
          value={stats.expiringPremium}
          icon={FaCalendarAlt}
          color="bg-red-500"
          subtitle="Within 7 days"
        />
        <StatCard
          title="Expiring Trials"
          value={stats.expiringTrial}
          icon={FaCalendarAlt}
          color="bg-orange-500"
          subtitle="Within 7 days"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users by username or email..."
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

          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-600">
              Showing {users.length} users
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premium Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trial Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
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
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                      <div className="text-sm text-gray-500">{user.mail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.is_premium ? (
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <FaCrown className="mr-1 h-3 w-3" />
                          Premium
                        </span>
                        {user.premium_expiry && (
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                getExpiryStatus(user.premium_expiry).color
                              }`}
                            >
                              {getExpiryStatus(user.premium_expiry).text}
                            </span>
                          </div>
                        )}
                        {user.subscription_id && (
                          <div className="text-xs text-gray-500 mt-1">
                            ID: {user.subscription_id.substring(0, 10)}...
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No Premium
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.is_trial ? (
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FaUserClock className="mr-1 h-3 w-3" />
                          Trial
                        </span>
                        {user.trial_expiry && (
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                getExpiryStatus(user.trial_expiry).color
                              }`}
                            >
                              {getExpiryStatus(user.trial_expiry).text}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No Trial
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {!user.is_premium ? (
                        <button
                          onClick={() => openPremiumModal(user)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-yellow-600 transition-colors flex items-center space-x-1"
                        >
                          <FaPlus className="h-3 w-3" />
                          <span>Premium</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to revoke premium access?"
                              )
                            ) {
                              handleRevokePremium(user.id);
                            }
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-red-600 transition-colors flex items-center space-x-1"
                        >
                          <FaTimes className="h-3 w-3" />
                          <span>Revoke</span>
                        </button>
                      )}

                      {!user.is_trial ? (
                        <button
                          onClick={() => openTrialModal(user)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-green-600 transition-colors flex items-center space-x-1"
                        >
                          <FaPlus className="h-3 w-3" />
                          <span>Trial</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to revoke trial access?"
                              )
                            ) {
                              handleRevokeTrial(user.id);
                            }
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-red-600 transition-colors flex items-center space-x-1"
                        >
                          <FaTimes className="h-3 w-3" />
                          <span>Revoke</span>
                        </button>
                      )}
                    </div>
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

      {/* Grant Premium Modal */}
      <Dialog
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaCrown className="mr-2 text-yellow-500" />
              Grant Premium Access: {selectedUser?.username}
            </Dialog.Title>

            <form
              onSubmit={handlePremiumSubmit(handleGrantPremium)}
              className="space-y-4"
            >
              <InputField
                control={premiumControl}
                name="expiryDate"
                title="Premium Expiry Date"
                placeholder="Select expiry date"
                type="datetime-local"
                rules={{ required: "Expiry date is required" }}
              />
              <InputField
                control={premiumControl}
                name="subscriptionId"
                title="Subscription ID (Optional)"
                isDisabled
                defaultvalue="admin-granted"
                placeholder="Enter subscription ID"
              />

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex">
                  <FaGift className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Premium Access Benefits
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Unlimited scans and strategies</li>
                        <li>Advanced analytics features</li>
                        <li>Priority support</li>
                        <li>Export capabilities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  text="Grant Premium"
                  onBtnClick={handlePremiumSubmit(handleGrantPremium)}
                  style="flex-1"
                />
                <Button
                  text="Cancel"
                  onBtnClick={() => setShowPremiumModal(false)}
                  outlined
                  style="flex-1"
                />
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Grant Trial Modal */}
      <Dialog
        open={showTrialModal}
        onClose={() => setShowTrialModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaUserClock className="mr-2 text-green-500" />
              Grant Trial Access: {selectedUser?.username}
            </Dialog.Title>

            <form
              onSubmit={handleTrialSubmit(handleGrantTrial)}
              className="space-y-4"
            >
              <InputField
                control={trialControl}
                name="trialDays"
                title="Trial Duration (Days)"
                placeholder="Enter number of days (default: 7)"
                type="number"
                rules={{
                  required: "Trial duration is required",
                  min: { value: 1, message: "Minimum 1 day" },
                  max: { value: 365, message: "Maximum 365 days" },
                }}
              />

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex">
                  <FaUserClock className="h-5 w-5 text-green-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Trial Access Benefits
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Limited premium features</li>
                        <li>Test advanced functionality</li>
                        <li>Evaluate before purchase</li>
                        <li>No payment required</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  text="Grant Trial"
                  onBtnClick={handleTrialSubmit(handleGrantTrial)}
                  style="flex-1"
                />
                <Button
                  text="Cancel"
                  onBtnClick={() => setShowTrialModal(false)}
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

export default PremiumManagement;
