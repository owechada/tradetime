import { useEffect, useState } from "react";
import { NavigateBtns } from "../generic/NavigateBtns";
import { FaCheck } from "react-icons/fa";
import { onGetStablePairs } from "../../services/generate";
import { CirclesWithBar, LineWave } from "react-loader-spinner";

export default ({
  nextStep,
  previousStep,
  postdata,
  setPostdata,
  mainActive,
}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [listPairs, setListPairs] = useState<string[]>([]);
  const getStablePairs = async () => {
    setIsLoading(true);
    try {
      const resonse = await onGetStablePairs({});
      setListPairs(resonse.currency_data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const [Selected, setSelected] = useState<any>();
  useEffect(() => {
    if (mainActive == 2) {
      getStablePairs();
    }
  }, [mainActive]);

  if (isLoading) {
    return <LoadingPairs />;
  }
  return (
    <div className="w-screen p-3 flex flex-col justify-center items-center gap-3">
      <h2 className="uppercase text-gray-600">
        Select from the most stable pairs
      </h2>

      <p className="text-sm text-gray-500  text-center md:text-left ">
        <FaCheck className="text-green-500 inline " /> Here are lists of stable
        forex currency pairs that are tradable
        <b> with over 70% market stability</b> at the moment
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3   gap-6 border border-gray-100 p-3 rounded-md w-[90%] md:w-[50%] ">
        {listPairs.map((pair, index) => (
          <CurrencyPairItem
            Selected={Selected}
            setSelected={setSelected}
            key={index}
            pair={pair}
          />
        ))}
      </div>
      <NavigateBtns
        shownext
        showprev
        actionPrev={() => {
          previousStep();
        }}
        nextCondition={!!Selected}
        actionNext={() => {
          setPostdata((prev: any) => ({
            ...prev,
            selected_pair: Selected,
          }));
          nextStep();
        }}
      />
    </div>
  );
};

const LoadingPairs = () => {
  return (
    <div className="w-screen p-3 flex flex-col justify-center items-center gap-3">
      <p className="text-gray-600   text-center">
        Loading stable pairs, please wait...
      </p>
      <CirclesWithBar
        height="100"
        width="100"
        color="#636AE8"
        outerCircleColor="#636AE8"
        innerCircleColor="#636AE8"
        barColor="#636AE8"
        ariaLabel="circles-with-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

const CurrencyPairItem = ({ pair, Selected, setSelected }: any) => {
  const isRecommended = pair.recommended === "Recommended";
  
  return (
    <div
      onClick={() => {
        setSelected(pair);
      }}
      className={`flex flex-col typewriter p-3 border border-primary rounded-xl hover:bg-primary/40 cursor-pointer transition-all ${
        Selected == pair ? "bg-primary/30 font-bold !border-2" : ""
      }`}
    >
      {/* Header with name and badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-blue-950 font-semibold">{pair.name}</span>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            isRecommended
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-gray-100 text-gray-600 border border-gray-300"
          }`}
        >
          {pair.recommended}
        </span>
      </div>
      
      {/* Market stability */}
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-600">Market Stability:</span>
        <span className="text-green-600 font-semibold">
          {pair.market_stability}%
        </span>
      </div>
      
      {/* Recommendation reason */}
      {pair.recommendation_reason && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-600 leading-relaxed">
            💡 {pair.recommendation_reason}
          </p>
        </div>
      )}
    </div>
  );
};
