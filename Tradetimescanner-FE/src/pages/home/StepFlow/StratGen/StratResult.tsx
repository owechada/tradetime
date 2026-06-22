import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { useState, useEffect } from "react";
import { CiTimer } from "react-icons/ci";
import { MdOutlineBookmarkAdd, MdPreview } from "react-icons/md";
import CountDownTimerModal from "../../../../components/generic/CountDownTimerModal";
import { useStateGetter } from "../../../../hooks/statehooks/UseStateGettersHook";
import { useStateSetter } from "../../../../hooks/statehooks/UseStateSettersHook";
import { usePickerhook } from "../../../../hooks/usePickerhook";
import { onSaveStrategy } from "../../../../services/user";
import { Button } from "../../../../components/forms";
import { IoMdArrowBack } from "react-icons/io";
import StrategyDetails from "../../../../components/generic/StrategyDetails";

export default ({ nextStep, previousStep, postdata }: any) => {
  const TimeZoneselecthook = usePickerhook();
  const { setScandetails, setLoading } = useStateSetter();
  const { strategyres, NextStep, authuser, PrevStep } = useStateGetter();

  const messages = [
    "Analysising strategy...",
    "Checking indicators...",
    "Fetching best strategy...",
    "Generating buy chart annotation",
    "Generating sell chart  annotation",
    "Generating buy chart annotation",
    "Generating sell chart annotation",
  ];

  const navigate = useNavigate();

  const SaveStrategy = async () => {
    if (!strategyData) {
      toast.error("No strategy data to save");
      return;
    }

    setLoading(true);
    try {
      const postData = {
        userid: authuser?.id || authuser?._id || "",
        strategyName: `Strategy ${new Date().toLocaleDateString()}`, // Optional: Generate a default name
        recommendedIndicators: strategyData.recommendedIndicators?.length > 0 ? strategyData.recommendedIndicators : [{ name: "AI Indicator", explanation: "Automatically generated indicator" }],
        recommendedPairs: strategyData.recommendedPairs?.length > 0 ? strategyData.recommendedPairs : ["Auto"],
        strategyExplanation: strategyData.strategyExplanation || strategyData.strategyexplanation || "No explanation provided.",
        tradePlan: strategyData.tradePlan || {},
        chartAnnotations: strategyData.chartAnnotations || "",
        // Legacy fields for backward compatibility
        recommendedtradetime:
          strategyData.recommendedtradetime ||
          strategyData.tradePlan?.timeFrame ||
          postdata?.tradetime ||
          "N/A",
        recommendedtimeframe:
          strategyData.recommendedtimeframe ||
          strategyData.tradePlan?.timeFrame ||
          postdata?.timeframe ||
          "N/A",
        signal_annotation: strategyData.signal_annotation || "", // Now using URL instead of base64
        strategyexplanation:
          strategyData.strategyexplanation ||
          strategyData.strategyExplanation ||
          "No explanation provided.",
        originalIndicators:
          postdata?.indicators?.map((ind: any) => ind.name).join(", ") || "",
        originalTradetime: postdata?.tradetime || "",
        originalTimeframe: postdata?.timeframe || "",
      };

      const res = await onSaveStrategy(postData);
      toast.success("Strategy saved successfully");
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 2000);
    } catch (e: any) {
      console.log(e);
      toast.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(postdata, "---");
  }, [postdata]);
  // Parse the strategy result if it's a JSON string
  const parseStrategyResult = () => {
    try {
      if (typeof strategyres === "string") {
        return JSON.parse(strategyres);
      }
      return strategyres;
    } catch (error) {
      console.error("Error parsing strategy result:", error);
      return null;
    }
  };

  const strategyData = parseStrategyResult();

  // Debug logging to check strategy data
  console.log("Raw strategyres:", strategyres);
  console.log("Parsed strategyData:", strategyData);
  console.log(
    "Signal annotation in strategyData:",
    strategyData?.signal_annotation
  );

  return (
    <div className="w-full overflow-x-hidden pb-6">
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {strategyData ? (
          <div className="bg-white rounded py-4 sm:py-6 px-2 sm:px-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6 px-1">
              <FaCheck className="text-green-500 text-lg sm:text-xl flex-shrink-0" />
              <h2 className="text-base sm:text-xl font-bold text-gray-800">
                Strategy Analysis Complete
              </h2>
            </div>

            {/* Strategy Details */}
            <StrategyDetails
              strategyData={strategyData}
              selectedCategory={
                postdata?.selectedCategory || postdata?.category
              }
            />
          </div>
        ) : (
          <div className="bg-white rounded max-h-[300px] overflow-y-auto p-3 sm:p-4 overflow-x-hidden">
            <p className="text-sm font-bold text-green-400 mb-2">
              Result <FaCheck className="inline" />
            </p>
            <hr />
            <div
              className="text-sm break-words"
              dangerouslySetInnerHTML={{ __html: strategyres }}
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="w-full mt-4">
        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3">
          <Button
            text={
              <>
                <IoMdArrowBack className="inline" /> Go back
              </>
            }
            onBtnClick={() => {
              window.location.reload();
            }}
          />
          <Button
            outlined
            text={
              <>
                <MdOutlineBookmarkAdd className="inline" /> Save strategy
              </>
            }
            onBtnClick={async () => {
              SaveStrategy();
            }}
          />
        </div>
      </div>
    </div>
  );
};
