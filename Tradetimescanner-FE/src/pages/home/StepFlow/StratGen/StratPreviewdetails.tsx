import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import { NavigateBtns } from "../../../../components/generic/NavigateBtns";
import { useStateGetter } from "../../../../hooks/statehooks/UseStateGettersHook";
import { useStateSetter } from "../../../../hooks/statehooks/UseStateSettersHook";
import { usePickerhook } from "../../../../hooks/usePickerhook";
import {
  onGenerateStrategy,
  onRecommendOptionsStrategy,
  onRecommendForexStrategy,
  onRecommendCryptoStrategy,
  onRecommendGoldStrategy,
  onRecommendIndicesStrategy,
} from "../../../../services/generate";
import { CiTimer } from "react-icons/ci";
import { BsAppIndicator } from "react-icons/bs";
import { CgOptions } from "react-icons/cg";
import { indicators } from "../../../../constants/data/data";

export default ({ nextStep, previousStep, postdata }: any) => {
  const TimeZoneselecthook = usePickerhook();
  const { setStrategyresult } = useStateSetter();
  const [isloading, setisloading] = useState(false);

  const { PrevStep } = useStateGetter();
  const [isoptionrec, setisoptionrec] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const messages = [
    "Analysing strategy...",
    "Checking indicators...",
    "Fetching best strategy...",
    "Generating buy chart annotation",
    "Generating sell chart  annotation",
    "Generating buy chart annotation",
    "Generating sell chart annotation",
  ];

  const [loadingmsg, setloadingmsg] = useState(messages[0]);

  useEffect(() => {
    setInterval(() => {
      const randomNum = Math.floor(Math.random() * 6);
      setloadingmsg(messages[randomNum]);
    }, 4000);
  }, []);

  // useEffect(() => {
  //   const isRecommend = postdata.indicators?.some(
  //     (item: any) => item?.code == 555 || item?.code == 777
  //   );

  //   setisoptionrec(isRecommend);
  //   // Determine the selected category based on catkey
  //   if (postdata.catkey !== undefined) {
  //     const categories = [
  //       "Options Strategy",
  //       "Forex Strategy",
  //       "Crypto Strategy",
  //       "Gold Strategy (XAUUSD)",
  //       "Indices Strategy",
  //     ];
  //     setSelectedCategory(categories[postdata.catkey] || "");
  //   }
  // }, [postdata]);

  useEffect(() => {
    console.log(postdata, "postdata");
  }, [postdata]);

  const submit = async () => {
    console.log(postdata, "postdata");

    // return;

    // if (!isoptionrec) {
    //   let postddata = {
    //     data: {
    //       ...postdata,
    //       indicators: postdata.indicators.map((p: any) => p?.name),
    //     },
    //   };

    //   try {
    //     setisloading(true);
    //     var response = await onGenerateStrategy(postddata);
    //     setTimeout(() => {
    //       setStrategyresult(response);
    //       setisloading(false);
    //       nextStep();
    //     }, 3000);
    //   } catch (e: any) {
    //     console.log(e);
    //     toast.error(e);
    //     setisloading(false);
    //   }
    // } else {

    let selectedCategory = postdata.selectedCategory;

    let postddata_ = {
      data: {
        indicators: postdata.indicators,
        timeframe: postdata.timeframe,
      },
    };

    try {
      setisloading(true);
      let response: any;
      // Call the appropriate service based on the selected category
      switch (selectedCategory) {
        case "Options Strategy":
          let postddata_options = {
            data: {
              timming: postdata.timming,
              markettype: postdata.optionsmarkettype,
              indicators: postdata.indicators,
              timeframe: postdata.timeframe,
              tradetime: postdata.tradetime,
            },
          };

          response = await onRecommendOptionsStrategy(postddata_options);
          break;
        case "Forex Strategy":
          response = await onRecommendForexStrategy(postddata_);
          break;
        case "Crypto Strategy":
          response = await onRecommendCryptoStrategy(postddata_);
          break;
        case "Gold Strategy (XAUUSD)":
          response = await onRecommendGoldStrategy(postddata_);
          break;
        case "Indices Strategy":
          response = await onRecommendIndicesStrategy(postddata_);
          break;
        default:
          // Fallback to options strategy for backward compatibility
          response = await onRecommendOptionsStrategy(postddata_);
          break;
      }

      setTimeout(() => {
        setStrategyresult(response);
        setisloading(false);
        nextStep();
      }, 3000);
    } catch (e: any) {
      console.log(e);
      toast.error(e);
      setisloading(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden pb-6">
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Strategy Preview Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-xl font-bold text-gray-800">
            Strategy Preview
          </h2>
          <p className="text-[11px] sm:text-sm text-gray-500 mt-0.5">
            Review your strategy configuration before generation
          </p>
        </div>

        {/* Strategy Details */}
        <div className="p-3 sm:p-5">
          {isoptionrec ? (
            <div className="space-y-3">
              {/* Options Trade Type */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CgOptions className="text-blue-600 text-sm" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Options Trade Type
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Selected market type
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-gray-200">
                  <span className="text-gray-700 font-medium text-sm break-words">
                    {postdata.optionsmarkettype}
                  </span>
                </div>
              </div>

              {/* Indicators */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BsAppIndicator className="text-green-600 text-sm" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Indicators
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      AI recommended indicators
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-gray-200">
                  <span className="text-gray-700 font-medium text-sm">
                    Recommend for me
                  </span>
                </div>
              </div>

              {/* Time Settings */}
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CiTimer className="text-purple-600 text-sm flex-shrink-0" />
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Time Frame
                    </h3>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                    <span className="text-gray-700 font-medium text-sm">
                      Recommend for me
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CiTimer className="text-orange-600 text-sm flex-shrink-0" />
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Trade Time
                    </h3>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                    <span className="text-gray-700 font-medium text-sm">
                      Recommend for me
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Indicators */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BsAppIndicator className="text-green-600 text-sm" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Selected Indicators
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      {postdata.indicators?.length || 0} indicators selected
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2 border border-gray-200">
                  <div className="flex flex-wrap gap-1.5">
                    {postdata.indicators?.map(
                      (indicator: any, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {indicator?.name}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Time Settings */}
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CiTimer className="text-purple-600 text-sm flex-shrink-0" />
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Time Frame
                    </h3>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-gray-200">
                    <span className="text-gray-700 font-medium text-sm break-words">
                      {postdata.timeframe}
                    </span>
                  </div>
                </div>
                {postdata.tradetime && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CiTimer className="text-orange-600 text-sm flex-shrink-0" />
                      <h3 className="font-semibold text-gray-800 text-sm">
                        Trade Time
                      </h3>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-gray-200">
                      <span className="text-gray-700 font-medium text-sm break-words">
                        {postdata.tradetime}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isloading && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 sm:px-6 py-6 border-t border-gray-200">
            <div className="flex flex-col items-center justify-center space-y-3">
              <PulseLoader
                color={"#350080"}
                loading={isloading}
                size={14}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <p className="text-gray-600 font-medium animate-pulse text-center text-xs sm:text-sm">
                {loadingmsg}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-4">
        <NavigateBtns
          shownext
          showprev
          islast
          actionPrev={PrevStep}
          nextCondition={!isloading}
          actionNext={async () => {
            await submit();
          }}
        />
      </div>
    </div>
  );
};
