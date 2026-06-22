import StepWizard from "react-step-wizard";
import SelectMarket from "./SubFlows/Market/SelectMarket";
import SelectCountry from "./SubFlows/Market/SelectCountry";
import SelectState from "./SubFlows/Market/SelectState";
import { useEffect, useState } from "react";
import Progressbar from "../../../components/forms/Progressbar";
import { useStateSetter } from "../../../hooks/statehooks/UseStateSettersHook";
import SelectTimeZone from "./SubFlows/Timezones/SelectTimeZone";
import InputTimezone from "./SubFlows/Timezones/InputTimezone";
import StartStopTime from "./SubFlows/Timezones/StartStopTime";

export default ({ nextStep, previousStep }: any) => {
  const { setNextAction, setPrevAction } = useStateSetter();
  const [mainActive, setmainActive] = useState<number>(1);

  const headerindicators = [
    { name: "TimeZone", icon: "" },
    // { name: " Input TimeZone ", icon: "" },
    { name: "Start/Stop Time", icon: "" },
  ];

  useEffect(() => {
    setNextAction(nextStep);
    setPrevAction(previousStep);
  }, []);
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
      className={`${
        mainActive == key_ + 1
          ? "!text-primary font-semibold"
          : " text-gray-400"
      } p-3 text-sm md:text-md `}
    >
      {icon} <span className="ml-1">{name} </span>
    </div>
  );
  return (
    <div className="w-full mt-6">
      <div className="md:w-[700px] flex bg-gray-200 justify-between  px-4 md:px-10 rounded  ">
        {headerindicators.map((item: any, index) => (
          <IndicatorItem icon={item.icon} key_={index} name={item.name} />
        ))}
      </div>

      <StepWizard
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
        <SelectTimeZone />
        {/* <InputTimezone /> */}
        <StartStopTime />
      </StepWizard>
    </div>
  );
};
