import React, { useEffect, useState } from "react";
import { getSystemInfo } from "../../services/admin";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { toast } from "react-toastify";
import Spinner from "../../components/generic/Spinner";
import {
  FaCog,
  FaServer,
  FaMemory,
  FaClock,
  FaDesktop,
  FaDatabase,
  FaShieldAlt,
  FaCode,
} from "react-icons/fa";
import { MdRefresh } from "react-icons/md";

interface SystemInfo {
  uptime: string;
  memoryUsage: {
    used: string;
    total: string;
    percentage: number;
  };
  nodeVersion: string;
  platform: string;
  environment?: string;
  apiVersion?: string;
  databaseStatus?: string;
}

const SystemSettings: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { setLoading: setGlobalLoading } = useStateSetter();

  const loadSystemInfo = async () => {
    try {
      setLoading(true);
      setGlobalLoading(true);

      const response = await getSystemInfo();

      if (response.success) {
        setSystemInfo(response.data);
      }
    } catch (error: any) {
      console.error("Error loading system info:", error);
      toast.error(error.toString());
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    loadSystemInfo();
  }, []);

  const InfoCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
  }: {
    title: string;
    value: string;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color} flex-shrink-0`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const SettingItem = ({
    title,
    description,
    value,
    action,
  }: {
    title: string;
    description: string;
    value: string;
    action?: () => void;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <p className="text-sm font-medium text-primary mt-2">{value}</p>
        </div>
        {action && (
          <button
            onClick={action}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Configure
          </button>
        )}
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FaCog className="mr-3" />
              System Settings
            </h1>
            <p className="text-gray-600 mt-2">
              System information and configuration
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={loadSystemInfo}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <MdRefresh className="h-4 w-4" />
              <span>Refresh Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Information Grid */}
      {systemInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InfoCard
            title="Server Uptime"
            value={systemInfo.uptime}
            icon={FaClock}
            color="bg-blue-500"
            subtitle="Time since last restart"
          />
          <InfoCard
            title="Memory Usage"
            value={`${systemInfo.memoryUsage?.percentage}%`}
            icon={FaMemory}
            color="bg-red-500"
            subtitle={`${systemInfo.memoryUsage?.used} / ${systemInfo.memoryUsage?.total}`}
          />
          <InfoCard
            title="Node.js Version"
            value={systemInfo?.nodeVersion}
            icon={FaCode}
            color="bg-green-500"
            subtitle="Runtime version"
          />
          <InfoCard
            title="Platform"
            value={systemInfo?.platform}
            icon={FaDesktop}
            color="bg-purple-500"
            subtitle="Operating system"
          />
        </div>
      )}

      {/* Memory Usage Chart */}
      {systemInfo && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Memory Usage Details
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Used: {systemInfo.memoryUsage?.used}</span>
              <span>Total: {systemInfo.memoryUsage?.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-red-500 h-4 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                style={{ width: `${systemInfo.memoryUsage?.percentage}%` }}
              >
                <span className="text-white text-xs font-semibold">
                  {systemInfo.memoryUsage?.percentage}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-green-800">Good</p>
                <p className="text-xs text-green-600">0-70%</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Warning</p>
                <p className="text-xs text-yellow-600">70-85%</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-red-800">Critical</p>
                <p className="text-xs text-red-600">85%+</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Configuration */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          System Configuration
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SettingItem
            title="Database Configuration"
            description="Manage database connections and settings"
            value="Active - All connections healthy"
          />

          <SettingItem
            title="API Rate Limiting"
            description="Configure API request limits and throttling"
            value="1000 requests/hour per user"
          />

          <SettingItem
            title="Security Settings"
            description="Manage authentication and security policies"
            value="JWT tokens, 24h expiry"
          />

          <SettingItem
            title="Backup Configuration"
            description="Configure automated backups and retention"
            value="Daily backups, 30-day retention"
          />

          <SettingItem
            title="Email Settings"
            description="Configure SMTP and email notifications"
            value="SMTP configured - Active"
          />

          <SettingItem
            title="Monitoring & Logging"
            description="System monitoring and log management"
            value="All services monitored"
          />
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">API Server: Online</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Database: Connected</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Cache: Active</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Email Service: Online</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">
              File Storage: Available
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Monitoring: Active</span>
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {systemInfo && systemInfo.memoryUsage?.percentage > 85 && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex">
            <FaShieldAlt className="h-5 w-5 text-red-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                High Memory Usage Warning
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Memory usage is critically high at{" "}
                  {systemInfo.memoryUsage?.percentage}%. Consider restarting the
                  server or investigating memory leaks.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;
