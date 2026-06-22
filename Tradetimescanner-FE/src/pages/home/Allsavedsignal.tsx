import { IoIosArrowRoundBack } from "react-icons/io";
import { GoHistory } from "react-icons/go";
import { HiOutlineSignal } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { useNavigate } from "react-router-dom";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import EmptyList from "../../components/generic/EmptyList";
import { toast } from "react-toastify";
import ViewDetailsModal from "../../components/generic/ViewDetailsModal";
import { ScanItemDTO } from "../../utils/typings";
import { onDeleteSignal, onGetUserAllsaveSignal } from "../../services/strategy";
import { LongSignalCard, ShortSignalCard } from "../../components/signallab/GetSignal";
import { ResponsiveContainer } from "../../components/responsive/ResponsiveContainer";
import { useResponsive } from "../../hooks/useResponsive";

export default () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [showDetails, setshowDetails] = useState(false);
  const [selectedscan, setselectedscan] = useState<any>({});
  const [jsonItem, setjsonItem] = useState<ScanItemDTO>();

  const { setLoading } = useStateSetter();
  const { authuser } = useStateGetter();
  const [savedscan, setsavedscan] = useState([]);

  const getuserSaved = async () => {
    setLoading(true);
    try {
      var res = await onGetUserAllsaveSignal(authuser.id);
      setsavedscan(res.data);
    } catch (e: any) {
      toast.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getuserSaved();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 md:py-12 overflow-x-hidden">
      {showDetails && (
        <ViewDetailsModal
          item={selectedscan.market != "Strategy generator" ? jsonItem : selectedscan}
          show={setshowDetails}
        />
      )}

      <ResponsiveContainer maxWidth="xl" padding="md">
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-blue-500/10 p-6 md:p-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all text-primary"
              >
                <IoIosArrowRoundBack size={32} />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <HiOutlineSignal className="text-primary text-xs" />
                  <span className="text-primary font-black uppercase tracking-widest text-[10px]">Signal Archive</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  Saved <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Signals</span>
                </h1>
              </div>
            </div>

            <button
              onClick={() => navigate("/aisignallab")}
              className="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <HiOutlineSignal size={20} />
              New Signal
            </button>
          </div>

          <hr className="border-gray-100 mb-8" />

          {/* Signals Grid */}
          {savedscan.length !== 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-y-auto max-h-[65vh] custom-scrollbar pr-2 pb-4">
              {[...savedscan].reverse().map((item: any, index: number) => (
                <div
                  key={index}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {!(!!item.TP1) ? (
                    <ShortSignalCard {...{ ...item, pair: { name: item.pair } }} />
                  ) : (
                    <LongSignalCard {...{ ...item, pair: { name: item.pair } }} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20">
              <EmptyList />
            </div>
          )}
        </div>
      </ResponsiveContainer>

      {/* Global CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
