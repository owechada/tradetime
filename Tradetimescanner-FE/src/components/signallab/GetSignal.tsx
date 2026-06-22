import { Fragment, useEffect, useState } from "react";
import { NavigateBtns } from "../generic/NavigateBtns";
import { onGetTradeSignal } from "../../services/generate";
import { CirclesWithBar, LineWave } from "react-loader-spinner";
import { IoIosTrendingUp } from "react-icons/io";
import { PiArrowBendDownRightBold } from "react-icons/pi";
import { GiTakeMyMoney } from "react-icons/gi";
import { Button } from "../forms";
import { onDeleteSignal, onSaveTradeSignal } from "../../services/strategy";
import { SignalItemDTO } from "../../utils/typings";
import { toast } from "react-toastify";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { Menu, Transition } from "@headlessui/react";
import { FaInfoCircle, FaTrash, FaUserCircle } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";

export default ({
  previousStep,
  mainActive,
  session,
  goToStep,
  postdata,
}: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [signal, setSignal] = useState<SignalItemDTO | undefined>();
  const { authuser } = useStateGetter();

  const getSignal = async () => {
    console.log(postdata);
    try {
      setIsLoading(true);
      var response = await onGetTradeSignal(postdata);
      setSignal(response);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTradeSignal = async (SignalData: SignalItemDTO) => {
    setIsLoading(true);
    try {
      let response = await onSaveTradeSignal({
        ...SignalData,
        pair: postdata.selected_pair.name,
        userid: authuser.id,
      });
      toast.success(`Saved as a ${SignalData.kindoff} trade`);

      setTimeout(() => {
        goToStep(1);
      }, 1000);
    } catch (e) {
      console.log(e, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mainActive == 4) {
      getSignal();
    }
  }, [mainActive]);
  if (isLoading) {
    return <LoadingPairs />;
  }
  return (
    <div className="w-screen p-3 flex flex-col justify-center items-center gap-3">
      <p className="font-semibold text-gray-500"> Generated Signal</p>

      {postdata.trade_type == "shorttrade" ? (
        <ShortSignalCard
          trade_duration={postdata.trade_duration}
          pair={postdata.selected_pair}
          {...signal}
        />
      ) : (
        <LongSignalCard
          trade_duration={postdata.trade_duration}
          pair={postdata.selected_pair}
          {...signal}
        />
      )}

      <DisclaimerMessage message={signal?.disclaimer} />
      <NavigateBtns
        shownext
        actionPrev={() => {
          previousStep();
        }}
        nextCondition={true}
        actionText="Get Signal (New Session)"
        actionNext={() => {
          window.location.reload();
        }}
      />
      {signal &&
        !(
          signal.explanation?.toString()?.includes("error") ||
          signal.explanation?.toString()?.includes("try again") ||
          signal.explanation?.toString()?.includes("no valid") ||
          signal.explanation?.toString()?.includes("not stable") ||
          signal.explanation?.toString()?.includes("Error")
        ) && (
          <div className="flex gap-3 flex-col md:flex-row">
            <Button
              outlined
              width={300}
              disabled={false}
              text={"Save trade (WON)"}
              onBtnClick={async () => {
                if (!!signal) {
                  session.setWon(session.won + 1);
                  await saveTradeSignal({ ...signal, kindoff: "WON" });
                }
              }}
            />
            <Button
              outlined
              width={300}
              disabled={false}
              text={"Save trade (LOST)"}
              onBtnClick={async () => {
                if (!!signal) {
                  session.setLoss(session.loss + 1);
                  await saveTradeSignal({ ...signal, kindoff: "LOSS" });
                }
              }}
            />
          </div>
        )}



    </div>
  );
};

const LoadingPairs = () => {
  return (
    <div className="w-screen p-3 flex flex-col justify-center items-center gap-3">
      <p className="text-gray-600 text-center">
        Loading signal, please wait...
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



function DisclaimerMessage({ message }: { message?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-yellow-50 p-4 border border-yellow-200 shadow-sm">
      <FaInfoCircle className="h-6 w-6 text-yellow-600 mt-1" />
      <p className="text-yellow-800 font-medium">
        {message || "This is not financial advice. Please consult a licensed financial market professional before investing."}
      </p>
    </div>
  );
}

const DeleteItem = async (id: string) => {
  try {
    let signal = await onDeleteSignal(id);
    toast.success("Deleted!");
    window.location.reload();
  } catch (e) {
    console.log(e);
  }
};

export const ShortSignalCard = ({
  pair,
  explanation,
  kindoff,
  id,
  win_confidence,
  trade_type,
  signal_type,
  signal_strength,
  trade_duration,
  time_frame,
  suggested_entry_zone,
}: any) => {
  useEffect(() => {
    console.log(pair, "pair...");
  }, []);
  if (
    explanation?.toString()?.includes("error") ||
    explanation?.toString()?.includes("try again") ||
    explanation?.toString()?.includes("no valid") ||
    explanation?.toString()?.includes("not stable") ||
    explanation?.toString()?.includes("Error")
  ) {
    return (
      <div
        className={`bg-white typewriter p-4 rounded-xl shadow w-5/6 flex flex-col md:w-2/6 border ${trade_type == "SELL" ? "border-red-500/30" : "border-green-500/30"
          }`}
      >
        <p className="text-gray-600 ">
          No stable trading opportunities at this moment. Please check back
          later when the market is more favorable
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white relative typewriter p-4 rounded-xl shadow w-[95%] flex flex-col md:w-[300px] border ${trade_type == "SELL" ? "border-red-500/30" : "border-green-500/30"
        }`}
    >
      {kindoff && (
        <Menu as="div" className="  self-center absolute top-5 right-0 ">
          <div>
            <Menu.Button className=" p-1 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <div className="bg-faint p-2 self-center rounded-xl flex-center items-center">
                <FiMoreVertical size={30} className="text-primary sha" />
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 py-4 z-[135454545454] focus:outline-none">
              <Menu.Item>
                <button
                  className="active:bg-gray-200 block  text-sm rounded-sm   text-gray-700 cursor-pointer focus:bg-gray-200 "
                  onClick={async () => {
                    await DeleteItem(id);
                  }}
                >
                  <FaTrash className=" text-[#005A82] inline" /> Delete
                </button>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
      <p
        className={`text-xl font-bold   text-gray-700 ${trade_type == "SELL" ? "text-red-500" : "text-green-500"
          }`}
      >
        {trade_type === "BUY" ? "Bullish Setup" : trade_type === "SELL" ? "Bearish Setup" : trade_type} <span className="text-blue-950"> {pair.name}</span>
        {kindoff && <span className="text-blue-950"> {kindoff}</span>}
      </p>
      <p className="text-green-600 text-lg ">
        <IoIosTrendingUp className="inline text-blue-500" />
        Setup Quality: {win_confidence}
      </p>
      {signal_type && (
        <p className="text-lg font-bold text-gray-800">
          Signal: <span className="text-primary">{signal_type}</span>
        </p>
      )}

      <p className="text-sm text-gray-700">
        Currency Pair: <span className="text-blue-500">{pair?.name}</span>
      </p>

      <p className="text-sm text-gray-700">
        Signal Strength:{" "}
        <span className="text-green-600">{signal_strength}</span>
      </p>

      <p className="text-sm text-gray-700">
        Trade Duration:{" "}
        <span className="text-orange-600">{trade_duration}</span>
      </p>

      <p className="text-sm text-gray-700">
        Timeframe Used: <span className="text-purple-600">{time_frame}</span>
      </p>

      <p className="text-sm text-gray-700">
        Suggested Entry: <span className="text-emerald-600">{suggested_entry_zone}</span>
      </p>

      <p className="text-sm mt-2 text-gray-700">
        Reason: <br />
        <span className="text-gray-600">{explanation}</span>
      </p>
      <p className="text-gray-600 ">{explanation}</p>
    </div>
  );
};
export const LongSignalCard = ({
  pair,
  explanation,
  target_zone_1,
  target_zone_2,
  target_zone_3,
  invalidation_level,
  id,
  win_confidence,
  signal_strength,
  kindoff,
  trade_type,
}: any) => {
  if (
    explanation?.toString()?.includes("error") ||
    explanation?.toString()?.includes("try again") ||
    explanation?.toString()?.includes("no valid") ||
    explanation?.toString()?.includes("not stable") ||
    explanation?.toString()?.includes("ValueError")
  ) {
    return (
      <div
        className={`bg-white typewriter p-4 rounded-xl shadow w-[95%] flex flex-col md:w-[300px] border ${trade_type == "SELL" ? "border-red-500/30" : "border-green-500/30"
          }`}
      >
        <p className="text-gray-600 ">
          No stable trading opportunities at this moment. Please check back
          later when the market is more favorable
        </p>
      </div>
    );
  }
  return (
    <div
      className={`bg-white relative typewriter p-4 rounded-xl shadow w-[95%] flex flex-col md:w-[350px] border ${trade_type == "SELL" ? "border-red-500/30" : "border-green-500/30"
        }`}
    >
      {kindoff && (
        <Menu as="div" className="  self-center absolute top-5 right-0 ">
          <div>
            <Menu.Button className=" p-1 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <div className="bg-faint p-2 self-center rounded-xl flex-center items-center">
                <FiMoreVertical size={30} className="text-primary sha" />
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 py-4 z-[135454545454] focus:outline-none">
              <Menu.Item>
                <button
                  className="active:bg-gray-200 block  text-sm rounded-sm   text-gray-700 cursor-pointer focus:bg-gray-200 "
                  onClick={async () => {
                    await DeleteItem(id);
                  }}
                >
                  <FaTrash className=" text-[#005A82] inline" /> Delete
                </button>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
      <p
        className={`text-xl font-bold   text-gray-700 ${trade_type == "SELL" ? "text-red-500" : "text-green-500"
          }`}
      >
        {trade_type === "BUY" ? "Bullish Setup" : trade_type === "SELL" ? "Bearish Setup" : trade_type} <span className="text-blue-500"> {pair.name}</span>{" "}

        <p className="text-sm text-gray-700">
          Signal Strength:
          <span className="text-green-600">{signal_strength}</span>
        </p>
        {kindoff && <span className="text-orange-400"> {kindoff}</span>}
      </p>
      <p className="text-green-600 text-lg ">
        <IoIosTrendingUp className="inline text-blue-500" />
        Setup Quality: {win_confidence}
      </p>
      <div className="flex  flex-col font-semibold ">
        <p>
          {" "}
          <GiTakeMyMoney className="inline text-blue-500" />
          Target Zones
          <ul className="!list-disc">
            <li>Target 1: {target_zone_1}</li>
            <li>Target 2: {target_zone_2}</li>
            <li>Target 3: {target_zone_3}</li>
          </ul>
        </p>
        <p>
          <PiArrowBendDownRightBold className="inline text-blue-500" />
          Invalidation Level {invalidation_level}
        </p>
      </div>
      <p className="text-gray-600 ">{explanation}</p>
    </div>
  );
};
