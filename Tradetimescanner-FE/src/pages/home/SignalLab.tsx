import React, { useEffect, useState } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { HiOutlineSignal } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/forms";
import { SignalLoader } from "../../components/generic/SigalLoader";
import StepWizard from "react-step-wizard";
import Analyze from "../../components/signallab/Analyze";
import TradeTypeDuration from "../../components/signallab/TradeTypeDuration";
import GetSignal from "../../components/signallab/GetSignal";
import Stablepairs from "../../components/signallab/Stablepairs";
import { GoArrowUpRight } from "react-icons/go";
import usePremiumHook from "../../hooks/usePremiumHook";
import PackageSelectionmodal from "../../components/generic/PackageSelectionmodal";
import TradeTimeStatus from "../../components/TradeTimeStatus";

const Item: React.FC<{ mainActive: number; title: string; index: number }> = ({
  title,
  index,
  mainActive,
}) => {
  return (
    <div
      className={`flex gap-1 justify-center items-center  ${mainActive == index
        ? " border-b py-3 border-primary rounded-lg text-primary"
        : "opacity-60 text-gray-600 "
        }   ${index == mainActive}`}
    >
      <CiLocationArrow1
        size={30}
        className="!text-primary  border rounded-full p-1"
      />
      <p className="">{title}</p>
      <div className="w-[80px] h-[1px] bg-gray-300 mr-3 hidden md:block"></div>
    </div>
  );
};

export default () => {
  const [mainActive, setmainActive] = useState(1);
  const [postdata, setPostdata] = useState<any>({});
  const navigate = useNavigate();
  const { hasaccess } = usePremiumHook();

  const [totalSignal, setTotalSignal] = useState(0);
  const [won, setWon] = useState(0);
  const [loss, setLoss] = useState(0);
  const [isMarketActive, setIsMarketActive] = useState<boolean>(true);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pb-12 overflow-x-hidden pt-8 md:pt-10">
      {!hasaccess && (
        <PackageSelectionmodal
          show={(state: boolean) => {
            navigate("/dashboard");
          }}
        />
      )}
      <SignalLoader isloading={false} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all text-primary"
          >
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="32" width="32" xmlns="http://www.w3.org/2000/svg"><path d="M216.4 163.7c5.1 5 5.1 13.3.1 18.4L155.8 243h231.3c7.1 0 12.9 5.8 12.9 13s-5.8 13-12.9 13H155.8l60.8 60.9c5 5.1 4.9 13.3-.1 18.4-5.1 5-13.2 5-18.3-.1l-82.4-83c-1.1-1.2-2-2.5-2.7-4.1-.7-1.6-1-3.3-1-5 0-3.4 1.3-6.6 3.7-9.1l82.4-83c4.9-5.2 13.1-5.3 18.2-.3z"></path></svg>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/saved-signals")}
              className="px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 font-bold text-sm bg-white text-gray-600 shadow-md hover:shadow-lg"
            >
              <GoArrowUpRight className="text-lg" />
              <span>Saved Signals</span>
            </button>
          </div>
        </div>

        {/* Page Title Section */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <HiOutlineSignal className="text-primary text-xs" />
            <span className="text-primary font-black uppercase tracking-widest text-[10px]">AI-Powered Signals</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            AI <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Signal Lab</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">
            Analyze live market conditions, identify stable forex currency pairs, and generate smart, AI-powered trade signals for users based on their selected trade duration.
          </p>
        </div>

        {/* Trade Time Status */}
        <div className="w-full max-w-3xl mx-auto my-6">
          <TradeTimeStatus onStatusChange={setIsMarketActive} />
        </div>

        {/* Main Content Areas */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 border border-white shadow-2xl shadow-blue-500/5 items-center flex flex-col pt-8 space-y-4">

          <div className="flex flex-col md:flex-row  my-2 mx-1  items-start justify-start gap-4">
            <Item mainActive={mainActive} index={1} title="Send & Analyze" />
            <Item
              mainActive={mainActive}
              index={2}
              title="Stable Currency Pairs"
            />
            <Item
              mainActive={mainActive}
              index={3}
              title="Trade Type & Duration"
            />
            <Item mainActive={mainActive} index={4} title="Get signal" />
          </div>
          <hr />

          <StepWizard
            className="w-full flex justify-center items-center"
            onStepChange={(stepChange: {
              previousStep: number;
              activeStep: number;
            }) => {
              setmainActive(stepChange.activeStep);
              var root = document.getElementsByTagName("div");
              var rootArray = Array.from(root);
              rootArray.forEach((element) =>
                element.scrollTo({ top: 0, behavior: "smooth" })
              );
            }}
          >
            <Analyze
              session={{
                won,
                loss,
                setWon,
                setLoss,
                totalSignal,
                setTotalSignal,
              }}
              postdata={postdata}
              setPostdata={setPostdata}
              mainActive={mainActive}
            />
            <Stablepairs
              postdata={postdata}
              setPostdata={setPostdata}
              mainActive={mainActive}
            />
            <TradeTypeDuration
              postdata={postdata}
              setPostdata={setPostdata}
              mainActive={mainActive}
            />
            <GetSignal
              session={{
                won,
                loss,
                setWon,
                setLoss,
                totalSignal,
                setTotalSignal,
              }}
              postdata={postdata}
              setPostdata={setPostdata}
              mainActive={mainActive}
            />
          </StepWizard>
        </div>
      </div>
    </div>
  );
};
