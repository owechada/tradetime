import { usePicker } from "@mui/x-date-pickers/internals";
import { ListPicker } from "../generic/ListPicker";
import { NavigateBtns } from "../generic/NavigateBtns";
import { usePickerhook } from "../../hooks/usePickerhook";
import Tooltip from "../generic/Tooltip";

export default ({ nextStep, previousStep, postdata, setPostdata }: any) => {
  const tradetype = usePickerhook();
  const tradeduration = usePickerhook();
  return (
    <div className="w-screen p-3 flex flex-col justify-center items-center gap-3">
      Trade Type duration
      <div className="flex flex-col md:flex-row gap-3 w-full justify-center items-center">
        <ListPicker
          hook={tradetype}
          title="Trade Type"
          list={[
            { name: "Short Trade", code: "shorttrade" },
            { name: "Long Trade", code: "longtrade" },
          ]}
          notsearchable={true}
          tooltip={
            <Tooltip
              title="Trade Type"
              content="Choose what type of trade you want to generate signal for (Short or Long)"
            />
          }
        />

        {tradetype.pickedRole && (
          <ListPicker
            hook={tradeduration}
            title={
              tradetype.pickedRole?.code == "shorttrade"
                ? "Trade Duration"
                : "Time Frame"
            }
            list={
              tradetype.pickedRole?.code == "shorttrade"
                ? [
                    //  { name: "1 minuites", code: "1m" },
                    // { name: "2 minuites", code: "2m" },
                    { name: "3 minuites", code: "3m" },
                    { name: "5 minuites", code: "5m" },
                    { name: "10 minuites", code: "10m" },
                    { name: "15 minuites", code: "15m" },
                  ]
                : [
                    { name: "5 minutes", code: "5m" },
                    { name: "10 minutes", code: "10m" },
                    { name: "15 minutes", code: "15m" },
                    { name: "30 minutes", code: "30m" },
                    { name: "1 hour", code: "1h" },
                    { name: "4 hours", code: "4h" },
                  ]
            }
            notsearchable={true}
            tooltip={
              <Tooltip
                title="Trade Duration"
                content="Choose exact trade duration you want to generate signal for"
              />
            }
          />
        )}
      </div>
      <NavigateBtns
        shownext
        showprev
        actionPrev={() => {
          previousStep();
        }}
        nextCondition={!!(tradeduration.pickedRole && tradetype.pickedRole)}
        actionNext={() => {
          setPostdata((prev: any) => ({
            ...prev,
            trade_type: tradetype.pickedRole?.code,
            trade_duration: tradeduration.pickedRole?.code,
          }));
          nextStep();
        }}
      />
    </div>
  );
};
