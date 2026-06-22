import { useEffect, useState } from "react";
import PackageSelectionmodal from "../../components/generic/PackageSelectionmodal";
import usePremiumHook from "../../hooks/usePremiumHook";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaChartArea } from "react-icons/fa";

export default () => {
  const navigate = useNavigate();
  const { hasaccess } = usePremiumHook();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      {!hasaccess && (
        <PackageSelectionmodal
          show={(state: boolean) => {
            navigate("/dashboard");
          }}
        />
      )}

      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all text-primary"
          >
            <IoIosArrowRoundBack size={32} />
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <FaChartArea className="text-primary text-xs" />
            <span className="text-primary font-black uppercase tracking-widest text-[10px]">Live Analysis</span>
          </div>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Iframe Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-blue-500/10 overflow-hidden">
          <iframe
            className="w-full"
            style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}
            src="https://tradetimescanner.com/indicator_test.html"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};
