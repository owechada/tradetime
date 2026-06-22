import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StepWizard from "react-step-wizard";
import Progressbar from "../../components/forms/Progressbar";
import { PiClockFill } from "react-icons/pi";
import { BsAppIndicator } from "react-icons/bs";
import { VscGithubAction } from "react-icons/vsc";
import Indicatorpick from "./StepFlow/StratGen/Indicatorpick";
import Timming from "./StepFlow/StratGen/Timming";
import StratScanner from "./StepFlow/StratScanner";
import PackageSelectionmodal from "../../components/generic/PackageSelectionmodal";
import usePremiumHook from "../../hooks/usePremiumHook";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaBookmark } from "react-icons/fa";
import { ResponsiveContainer } from "../../components/responsive/ResponsiveContainer";
import { useResponsive } from "../../hooks/useResponsive";

export default () => {
  const [postdata, setpostdata] = useState({});
  const { element, setpercentage } = Progressbar();
  const [mainActive, setmainActive] = useState<number>(1);
  const { isMobile } = useResponsive();

  useEffect(() => {
    setpercentage((mainActive / 3) * 100);
  }, [mainActive]);

  const headerindicators = [
    {
      name: isMobile ? "Indicators" : "Indicators selection",
      icon: <BsAppIndicator className="inline" />,
    },
    {
      name: isMobile ? "Time" : "TradeTime Settings",
      icon: <PiClockFill className="inline" />,
    },
    {
      name: isMobile ? "Strategy" : "Strategy Result",
      icon: <VscGithubAction className="inline" />,
    },
  ];
  const navigate = useNavigate();
  const { hasaccess } = usePremiumHook();

  useEffect(() => {
    var root = document.getElementsByTagName("div");
    var rootArray = Array.from(root);
    rootArray.forEach((element) =>
      element.scrollTo({ top: 0, behavior: "smooth" })
    );
  }, [mainActive]);

  const IndicatorItem = ({
    icon,
    name,
    key_,
  }: {
    icon: JSX.Element;
    name: string;
    key_: number;
  }) => (
    <div
      className={`flex items-center justify-center flex-1 py-3 px-2 transition-all duration-300 ${mainActive == key_ + 1
        ? "text-primary font-bold border-b-2 border-primary bg-primary/5"
        : "text-gray-400 hover:text-gray-600"
        }`}
    >
      <span className={isMobile ? "text-lg" : "text-xl"}>{icon}</span>
      <span className={`ml-2 whitespace-nowrap ${isMobile ? "text-[10px]" : "text-sm"}`}>{name}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 md:py-12 overflow-x-hidden">
      {!hasaccess && (
        <PackageSelectionmodal
          show={(_: boolean) => {
            navigate("/dashboard");
          }}
        />
      )}

      <ResponsiveContainer maxWidth="xl" padding="sm" className="flex flex-col items-center">
        {/* Main Wizard Card */}
        <div className="w-full bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-blue-500/10 overflow-hidden flex flex-col min-h-[80vh]">

          {/* Header Part */}
          <div className="p-3 sm:p-6 md:p-8 border-b border-gray-100 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-6">
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all text-primary"
              >
                <IoIosArrowRoundBack size={32} />
              </button>

              <div className="text-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary/50 block mb-1">Strategy Builder</span>
                <h1 className="text-xl md:text-2xl font-black text-gray-900">
                  Step <span className="text-primary">{mainActive}</span> of 3
                </h1>
              </div>

              <Link
                to="/saved-strategies"
                className={`inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-all font-bold shadow-sm ${isMobile ? 'text-[10px] px-2 py-1' : 'text-sm'}`}
              >
                <FaBookmark className={isMobile ? "text-xs" : "text-sm"} />
                <span>{isMobile ? "Saved" : "View Saved"}</span>
              </Link>
            </div>

            {/* Progress Bar Section */}
            <div className="w-full max-w-md mx-auto mb-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Build Status</p>
                <p className="text-xs font-black text-primary">{Math.round((mainActive / 3) * 100)}%</p>
              </div>
              {element}
              {/* <p className="text-center text-gray-400 text-[10px] mt-3 font-medium uppercase tracking-widest italic">"Engineered for success"</p> */}
            </div>

            {/* Step Selection Tabs */}
            <div className="w-full flex bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
              {headerindicators.map((item, index) => (
                <IndicatorItem key={index} icon={item.icon} key_={index} name={item.name} />
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-2 sm:p-4 md:p-10 overflow-y-auto custom-scrollbar">
            <StepWizard
              className="w-full overflow-x-hidden"
              onStepChange={(stepChange: {
                previousStep: number;
                activeStep: number;
              }) => {
                setmainActive(stepChange.activeStep);
              }}
            >
              <Indicatorpick setpostdata={setpostdata} postdata={postdata} />
              <Timming
                mainActive={mainActive}
                postdata={postdata}
                setpostdata={setpostdata}
              />
              <StratScanner postdata={postdata} setpostdata={setpostdata} />
            </StepWizard>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};
