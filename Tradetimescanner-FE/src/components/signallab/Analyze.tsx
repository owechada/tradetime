import { FaCalendarTimes } from "react-icons/fa";
import { Button } from "../forms";
import { NavigateBtns } from "../generic/NavigateBtns";

export default ({
  nextStep,
  session,
  previousStep,
  postdata,
  setPostdata,
}: any) => {
  let winrate = (session.won / (session.won + session.loss)) * 100;

  const today = new Date();
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  function MarketClosedMessage() {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 border border-red-200 shadow-sm">
        <FaCalendarTimes className="h-6 w-6 text-red-500" />
        <p className="text-red-700 font-medium">
          The weekend market is currently{" "}
          <span className="font-bold">closed</span>, please check back on{" "}
          <span className="underline">Monday</span>.
        </p>
      </div>
    );
  }
  return (
    <div className="w-screen p-3 flex flex-col justify-center  items-center  gap-3">
      <p className="text-gray-600">Session details</p>
      <div className="p-3 border rounded-lg flex  gap-3 text-sm text-gray-600">
        <p> Total : {session.won + session.loss}</p>
        <p> Loss :{session.loss}</p>
        <p> Won: {session.won}</p>
        <p> Win rate : {winrate ? Math.round(winrate) : "0"}%</p>
      </div>
      <p className="text-gray-500  pt-8 text-sm text-center">
        Analyze current market conditions based on your location.
      </p>

      {isWeekend && <MarketClosedMessage />}
      <NavigateBtns
        shownext
        actionText={"Send & Analyze"}
        actionPrev={() => {
          previousStep();
        }}
        nextCondition={!isWeekend}
        actionNext={() => {
          nextStep();
        }}
      />
    </div>
  );
};
