import React, { useEffect, useState } from "react";
import { getDashboardStats, getSystemInfo } from "../../services/admin";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { toast } from "react-toastify";
import Spinner from "../../components/generic/Spinner";
import {
  FaUsers,
  FaCrown,
  FaUserClock,
  FaChartLine,
  FaServer,
  FaMemory,
  FaClock,
  FaDesktop,
} from "react-icons/fa";

interface DashboardStats {
  totalUsers: number;
  premiumUsers: number;
  trialUsers: number;
  activeUsers: number;
  newUsersToday: number;
  premiumRevenue: number;
  contentMetrics: {
    totalScans: number;
    totalStrategies: number;
  };
}

interface SystemInfo {
  uptime: string;
  memoryUsage: {
    used: string;
    total: string;
    percentage: number;
  };
  nodeVersion: string;
  platform: string;
}

const AdminDashboard: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<any | null>(null);
  const [systemInfo, setSystemInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { setLoading: setGlobalLoading } = useStateSetter();

  useEffect(() => {
    console.log(dashboardStats, "change debug");
  }, [dashboardStats]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setGlobalLoading(true);

      const [statsResponse, systemResponse] = await Promise.all([
        getDashboardStats(),
        getSystemInfo(),
      ]);

      if (statsResponse.success) {
        setDashboardStats(statsResponse.data);
        console.log(statsResponse, "debug");
      }

      if (systemResponse.success) {
        setSystemInfo(systemResponse.data);
      }
    } catch (error: any) {
      console.error("Error loading dashboard data:", error);
      toast.error(error.toString());
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
  }: {
    title: string;
    value: string | number;
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
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {value?.toLocaleString()}
          </p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const SystemCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: string;
    icon: any;
    color: string;
  }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600 uppercase">{title}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner loading={loading} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to TradeTimeScanner Admin Panel
        </p>
      </div>

      {/* Stats Grid */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={dashboardStats.users.total}
            icon={FaUsers}
            color="bg-blue-500"
            subtitle="All registered users"
          />
          <StatCard
            title="Premium Users"
            value={dashboardStats.users.premium}
            icon={FaCrown}
            color="bg-yellow-500"
            subtitle="Active subscriptions"
          />
          <StatCard
            title="Trial Users"
            value={dashboardStats.users.trial}
            icon={FaUserClock}
            color="bg-green-500"
            subtitle="Free trial active"
          />
          <StatCard
            title="New Users Today"
            value={dashboardStats.users.recentRegistrations}
            icon={FaChartLine}
            color="bg-purple-500"
            subtitle="Registered today"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Metrics */}
        {dashboardStats && (
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Content Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Scans
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {dashboardStats.contentMetrics?.totalScans?.toLocaleString()}
                    </p>
                  </div>
                  <FaChartLine className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Strategies
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {dashboardStats.contentMetrics?.totalStrategies.toLocaleString()}
                    </p>
                  </div>
                  <FaChartLine className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>

            {dashboardStats.premiumRevenue && (
              <div className="mt-4 bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Premium Revenue
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      ${dashboardStats?.premiumRevenue?.toLocaleString()}
                    </p>
                  </div>
                  <FaCrown className="h-8 w-8 text-green-600" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* System Information */}
        {systemInfo && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              System Information
            </h2>
            <div className="space-y-4">
              <SystemCard
                title="Server Uptime"
                value={systemInfo.uptime}
                icon={FaClock}
                color="bg-blue-500"
              />
              <SystemCard
                title="Memory Usage"
                value={`${Math.round(
                  (systemInfo.memory.used / systemInfo.memory.total) * 100
                )}%`}
                icon={FaMemory}
                color="bg-red-500"
              />
              <SystemCard
                title="Node.js Version"
                value={systemInfo.node_version}
                icon={FaServer}
                color="bg-green-500"
              />
              <SystemCard
                title="Platform"
                value={systemInfo.platform}
                icon={FaDesktop}
                color="bg-gray-500"
              />
            </div>

            {/* Memory Usage Details */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Memory Details</p>
              <div className="flex justify-between text-sm">
                <span>Used: {Math.round(systemInfo.memory.used)}</span>
                <span>Total: {systemInfo.memory.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemInfo.memoryUsage?.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => loadDashboardData()}
            className="bg-primary text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            <FaChartLine className="h-4 w-4" />
            <span>Refresh Data</span>
          </button>
          <button className="bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2">
            <FaUsers className="h-4 w-4" />
            <span>Manage Users</span>
          </button>
          <button className="bg-yellow-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2">
            <FaCrown className="h-4 w-4" />
            <span>Premium Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
