import { MdClearAll, MdHome, MdTrendingUp, MdSpeed, MdAccessTime } from "react-icons/md";
import { IoMdQrScanner, IoMdPulse } from "react-icons/io";
import { GoHistory, GoRocket } from "react-icons/go";
import { FaChartLine, FaBolt, FaRegLightbulb } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import ScanItem from "../../components/generic/ScanItem";
import { getuserById, onGetSaveScan } from "../../services/user";
import { useEffect, useState } from "react";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { useNavigate } from "react-router-dom";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import EmptyList from "../../components/generic/EmptyList";
import { toast } from "react-toastify";
import ViewDetailsModal from "../../components/generic/ViewDetailsModal";
import { ScanItemDTO } from "../../utils/typings";
import { ResponsiveContainer } from "../../components/responsive/ResponsiveContainer";
import { ResponsiveGrid } from "../../components/responsive/ResponsiveGrid";
import { useResponsive } from "../../hooks/useResponsive";
import TradeTimeStatus from "../../components/TradeTimeStatus";

export default () => {
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { authuser } = useStateGetter();
  const [savedscan, setsavedscan] = useState([]);
  const { setLoading, setAuthuser, setConfig } = useStateSetter();
  const [showDetails, setshowDetails] = useState(false);
  const [selectedscan, setselectedscan] = useState<any>({});
  const [jsonItem, setjsonItem] = useState<ScanItemDTO>();

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const refreshuser = async () => {
    try {
      var res = await getuserById(authuser.id);
      if (res.user) {
        localStorage.setItem(`UserData`, JSON.stringify(res?.user));
        localStorage.setItem(`AuthToken`, res?.token);
        setAuthuser(res?.user);
        const config = {
          headers: {
            Authorization: `Bearer ${res?.token}`,
          },
        };
        setConfig(config);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getuserSaved = async () => {
    let postdata = {
      userid: authuser.id,
    };

    setLoading(true);

    try {
      var res = await onGetSaveScan(postdata);
      setsavedscan(res);
    } catch (e: any) {
      toast.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    selectedscan.market != "Strategy generator" &&
      setjsonItem(JSON.parse(selectedscan.content ? selectedscan.content : "{}"));
  }, [selectedscan]);

  useEffect(() => {
    refreshuser();
    getuserSaved();
  }, []);

  // Quick action cards data
  const quickActions = [
    {
      icon: <FaChartLine className="text-white" size={isMobile ? 20 : 24} />,
      title: "Strategy Builder",
      description: "Create winning strategies",
      gradient: "from-violet-500 to-purple-600",
      onClick: () => navigate("/strategy"),
    },
    {
      icon: <IoMdQrScanner className="text-white" size={isMobile ? 20 : 24} />,
      title: "Market Scanner",
      description: "Find trading opportunities",
      gradient: "from-blue-500 to-cyan-500",
      onClick: () => navigate("/scanner"),
    },
    {
      icon: <IoMdPulse className="text-white" size={isMobile ? 20 : 24} />,
      title: "AI Signal Lab",
      description: "AI Powered trading signals",
      gradient: "from-emerald-500 to-teal-500",
      onClick: () => navigate("/aisignallab"),
    },
    {
      icon: <FaBolt className="text-white" size={isMobile ? 20 : 24} />,
      title: "Pro Analysis",
      description: "Advanced chart tools",
      gradient: "from-amber-500 to-orange-500",
      onClick: () => navigate("/pro-chart"),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {showDetails && (
        <ViewDetailsModal
          setselectedscan={setselectedscan}
          item={
            selectedscan.market != "Strategy generator"
              ? jsonItem
              : selectedscan
          }
          show={setshowDetails}
        />
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
        </div>

        <ResponsiveContainer maxWidth="full" padding="md" className="relative z-10 py-6 sm:py-8">
          {/* Greeting & Stats */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/50 shadow-xl shadow-blue-500/10 p-4 sm:p-6 lg:p-8 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              {/* Left: Greeting */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-primary via-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg shadow-primary/30">
                    <MdHome size={isMobile ? 24 : 32} className="text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className={`font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent ${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'}`}>
                      {getGreeting()}, {authuser?.username || 'Trader'}
                    </h1>
                    <HiOutlineSparkles className="text-amber-500" size={isMobile ? 18 : 24} />
                  </div>
                  <p className={`text-gray-500 mt-0.5 ${isMobile ? 'text-sm' : 'text-base'}`}>
                    Welcome to your trading command center
                  </p>
                </div>
              </div>

              {/* Right: Quick Stats */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <MdTrendingUp className="text-blue-600" size={isMobile ? 16 : 20} />
                  <div>
                    <p className={`font-bold text-gray-900 ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {savedscan.length}
                    </p>
                    <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>Total Scans</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                  <GoRocket className="text-emerald-600" size={isMobile ? 16 : 20} />
                  <div>
                    <p className={`font-bold text-gray-900 ${isMobile ? 'text-sm' : 'text-base'}`}>
                      Active
                    </p>
                    <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>Status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trade Time Status */}
          <div className="mb-6">
            <TradeTimeStatus />
          </div>

          {/* Quick Actions Grid */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FaRegLightbulb className="text-primary" size={isMobile ? 16 : 20} />
              <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>
                Quick Actions
              </h2>
            </div>
            <div className={`grid gap-3 sm:gap-4 ${isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-2' : 'grid-cols-4'}`}>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`group relative overflow-hidden bg-gradient-to-br ${action.gradient} p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300`}
                >
                  {/* Decorative circles */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/10 rounded-full" />

                  <div className="relative z-10">
                    <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {action.icon}
                    </div>
                    <h3 className={`font-bold text-white mb-0.5 ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {action.title}
                    </h3>
                    <p className={`text-white/80 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {action.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ResponsiveContainer>
      </div>

      {/* Recent Scans Section */}
      <ResponsiveContainer maxWidth="full" padding="md" className="pb-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/50 shadow-xl shadow-blue-500/10 p-4 sm:p-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
                <GoHistory className="text-white" size={isMobile ? 18 : 22} />
              </div>
              <div>
                <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  Recent Market Scans
                </h2>
                <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Your latest trading analysis results
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate("/allscans")}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 ${isMobile ? 'text-sm' : 'text-base'}`}
              >
                <MdClearAll size={isMobile ? 16 : 18} />
                View All
              </button>
              <button
                onClick={() => navigate("/scanner")}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-medium rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all duration-200 ${isMobile ? 'text-sm' : 'text-base'}`}
              >
                <IoMdQrScanner size={isMobile ? 16 : 18} />
                Scan Now
              </button>
            </div>
          </div>

          {/* Scans Grid */}
          {savedscan.length !== 0 ? (
            <div className="overflow-y-auto max-h-[60vh]">
              <ResponsiveGrid
                columns={{
                  mobile: 1,
                  tablet: 2,
                  desktop: 3
                }}
                gap={isMobile ? "md" : "lg"}
              >
                {[...savedscan]
                  .reverse()
                  .slice(0, isMobile ? 4 : isTablet ? 6 : 6)
                  ?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="transform hover:scale-[1.02] transition-all duration-300 animate-fadeIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <ScanItem
                        setshowmodal={setshowDetails}
                        setselectedscan={setselectedscan}
                        refresh={getuserSaved}
                        item={item}
                      />
                    </div>
                  ))}
              </ResponsiveGrid>
            </div>
          ) : (
            <div className="py-12">
              <EmptyList />
            </div>
          )}
        </div>
      </ResponsiveContainer>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};
