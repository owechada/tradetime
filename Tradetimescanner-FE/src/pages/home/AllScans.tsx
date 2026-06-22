import { IoIosArrowRoundBack, IoMdQrScanner } from "react-icons/io";
import { GoHistory } from "react-icons/go";
import ScanItem from "../../components/generic/ScanItem";
import { onGetSaveScan } from "../../services/user";
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
    getuserSaved();
  }, []);

  useEffect(() => {
    selectedscan.market != "Strategy generator" &&
      setjsonItem(
        JSON.parse(selectedscan.content ? selectedscan.content : "{}")
      );
  }, [selectedscan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 md:py-12 overflow-x-hidden">
      {showDetails && (
        <ViewDetailsModal
          item={
            selectedscan.market != "Strategy generator"
              ? jsonItem
              : selectedscan
          }
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
                  <GoHistory className="text-primary text-xs" />
                  <span className="text-primary font-black uppercase tracking-widest text-[10px]">Archived Reports</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  All Saved <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Scans</span>
                </h1>
              </div>
            </div>

            <button
              onClick={() => navigate("/scanner")}
              className="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <IoMdQrScanner size={20} />
              Launch Scanner
            </button>
          </div>

          <hr className="border-gray-100 mb-8" />

          {/* Scans Grid */}
          {savedscan.length !== 0 ? (
            <div className="overflow-y-auto max-h-[65vh] custom-scrollbar pr-2">
              <ResponsiveGrid
                columns={{
                  mobile: 1,
                  tablet: 2,
                  desktop: 3
                }}
                gap="lg"
              >
                {[...savedscan]
                  .reverse()
                  ?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="transform hover:scale-[1.02] transition-all duration-300 animate-fadeIn"
                      style={{ animationDelay: `${index * 50}ms` }}
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
            <div className="py-20">
              <EmptyList />
            </div>
          )}
        </div>
      </ResponsiveContainer>

    </div>
  );
};
