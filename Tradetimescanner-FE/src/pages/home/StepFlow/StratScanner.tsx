import StepWizard from "react-step-wizard";

import { useEffect, useState } from "react";
import { useStateSetter } from "../../../hooks/statehooks/UseStateSettersHook";

import StratPreviewdetails from "./StratGen/StratPreviewdetails";
import StratResult from "./StratGen/StratResult";

export default ({ nextStep, previousStep, postdata }: any) => {
  const { setNextAction, setPrevAction } = useStateSetter();
  const [mainActive, setmainActive] = useState<number>(1);

  const headerindicators = [
    { name: "Preview", icon: "" },
    { name: " Result ", icon: "" },
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
      className={`flex-1 text-center py-3 px-2 transition-all duration-300 text-sm ${mainActive == key_ + 1
        ? "text-primary font-bold border-b-2 border-primary bg-primary/5"
        : "text-gray-400 hover:text-gray-600"
        }`}
    >
      {icon} <span className="ml-1">{name}</span>
    </div>
  );
  return (
    <div className="w-full mt-4 pb-12 md:pb-16 flex flex-col items-center px-0 md:px-0">
      <div className="w-full max-w-[700px] flex bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden">
        {headerindicators.map((item: any, index) => (
          <IndicatorItem icon={item.icon} key_={index} name={item.name} />
        ))}
      </div>

      <StepWizard
        className="w-full max-w-[700px] mt-4 overflow-x-hidden"
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
        <StratPreviewdetails postdata={postdata} />
        <StratResult postdata={postdata} />
      </StepWizard>
    </div>
  );
};
