import { useState, useEffect } from "react";
import StepWizard from "react-step-wizard";
import { useStateSetter } from "../../../../hooks/statehooks/UseStateSettersHook";
import SelectCountry from "../SubFlows/Market/SelectCountry";
import SelectMarket from "../SubFlows/Market/SelectMarket";
import SelectState from "../SubFlows/Market/SelectState";
import { indicators } from "../../../../constants/data/data";
import { NavigateBtns } from "../../../../components/generic/NavigateBtns";
import { CiStar } from "react-icons/ci";
import { RxStarFilled } from "react-icons/rx";
import { tab } from "@testing-library/user-event/dist/tab";
import { Button, InputField } from "../../../../components/forms";
import Tooltip from "../../../../components/generic/Tooltip";
import { useForm } from "react-hook-form";
import { IoMdQrScanner } from "react-icons/io";
import { MdAutoMode } from "react-icons/md";
import { usePickerhook } from "../../../../hooks/usePickerhook";
import { ListPicker } from "../../../../components/generic/ListPicker";
import { toast } from "react-toastify";

export default ({
  nextStep,
  mainActive,
  previousStep,
  setpostdata,
  postdata,
}: any) => {
  const { setNextAction, setPrevAction } = useStateSetter();
  const optionstype = usePickerhook();
  const timminghook = usePickerhook();
  const tradetimehook = usePickerhook();
  const timeframehook = usePickerhook();

  const [timeframe, settimeframe] = useState("");

  const below1min_tradetime: any = [
    { name: "30 Seconds", code: "30s" },
    { name: "10 Seconds", code: "10s" },
    { name: "5 Seconds", code: "5s" },
  ];
  const above1min_tradetime: any = [
    { name: "1 Min", code: "1min" },
    { name: " 2 Min", code: "2min" },
    { name: "5 Min", code: "5min" },
  ];
  const { control, handleSubmit, getValues, watch } = useForm();
  const timeframefield = watch(["timeframe"]);
  const tradetimefield = watch(["tradetime"]);
  const [isrecommend, setisrecommend] = useState(false);
  const timeframefieldFilled = timeframefield.every(
    (field) => field !== "" && field !== undefined
  );
  const tradetimefieldFilled = tradetimefield.every(
    (field) => field !== "" && field !== undefined
  );
  useEffect(() => {
    setNextAction(nextStep);
    setPrevAction(previousStep);
  }, []);
  const [tradetimelist, settradetimelist] = useState([]);
  useEffect(() => {
    var randomnum;
    var timeframes: any;
    switch (tradetimehook.pickedRole?.code) {
      case "5s":
        timeframes = ["10 seconds", "30 seconds"];
        break;
      case "10s":
        timeframes = ["10 seconds", "10 seconds", "30 seconds"];
        break;
      case "30s":
        timeframes = ["10 seconds", "30 seconds", "1 minutes"];
        break;
      case "1min":
        timeframes = ["30 seconds", "1 minuites"];
        break;
      case "2min":
        timeframes = ["30 seconds", "1 minuites", "2 minutes"];
        break;
      case "5min":
        timeframes = [
          "30 seconds",
          "1 minuites",
          "2 minutes",
          " 2 minutes",
          "2 minutes",
        ];
        break;
      default:
        timeframes = [];
    }
    var randomtimeframe =
      timeframes[Math.floor(Math.random() * timeframes.length)];

    settimeframe(randomtimeframe);
  }, [tradetimehook.pickedRole]);

  function getRandomNumbers(maxx?: number) {
    return Array.from({ length: maxx ?? 30 }, (_, i) => i + 1) // Create an array [1, 2, ..., 30]
      .sort(() => Math.random() - 0.5) // Shuffle the array randomly
      .slice(0, 3); // Take the first 3 unique numbers
  }

  useEffect(() => {
    var arr = getRandomNumbers();
    if (postdata.indicators?.some((item: any) => item?.code == 555)) {
      setisrecommend(true);
      if (!!optionstype.pickedRole?.code) {
        console.log(
          timminghook.pickedRole?.name,
          optionstype.pickedRole?.name,
          "---------"
        );
        nextStep();
        setpostdata((prev: any) => {
          return {
            ...prev,
            timming: timminghook.pickedRole?.name,
            optionsmarkettype: optionstype.pickedRole?.name,
          };
        });
      }
    }
  }, [mainActive, timminghook.pickedRole]);

  useEffect(() => {
    switch (timminghook.pickedRole?.code) {
      case "above1min":
        settradetimelist(above1min_tradetime);
        break;
      case "below1min":
        settradetimelist(below1min_tradetime);
        break;
      default:
        settradetimelist([]);
    }
  }, [timminghook.pickedRole]);

  useEffect(() => {
    var arr = getRandomNumbers(indicators[postdata.catkey]?.items.length);
    if (postdata.indicators?.some((item: any) => item?.code == 777)) {
      setisrecommend(true);
      setpostdata((prev: any) => {
        return {
          ...prev,
          indicators: [
            indicators[postdata.catkey].items[arr[0]],
            indicators[postdata.catkey].items[arr[1]],
            indicators[postdata.catkey].items[arr[2]],
          ],
          tradetime: null,
          timeframe: "recommend for me",
        };
      });

      setisrecommend(true);
    }
  }, [mainActive]);
  return (
    <div className="w-full max-w-[600px] mt-4 px-0 md:px-0 flex flex-col place-self-center">
      {(indicators[0].items.some((item: any) =>
        postdata?.indicators?.includes(item)
      ) ||
        postdata.indicators?.some((item: any) => item?.code == 555)) && (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-x-3  ${isrecommend ? "blur-[2px]" : ""
              }" `}
          >
            <ListPicker
              hook={optionstype}
              title="Options Trade Type"
              list={[
                { name: "Real market", code: "realmarket" },
                { name: "OTC Market", code: "otcmarket" },
              ]}
              tooltip={
                <Tooltip
                  title="Type of Options trade "
                  content="Choose what type of options trade you want to generate strategy for"
                />
              }
            />

            {optionstype.pickedRole &&
              optionstype.pickedRole?.code != "realmarket" && (
                <ListPicker
                  hook={timminghook}
                  title="Timing"
                  list={[
                    { name: "1-Minute Trades and Above", code: "above1min" },
                    { name: "1-Minute Trades and Below", code: "below1min" },
                  ]}
                  tooltip={
                    <Tooltip
                      title="Type of Options trade "
                      content="Choose what type of options trade you want to generate strategy for"
                    />
                  }
                />
              )}

            {timminghook.pickedRole &&
              optionstype.pickedRole?.code != "realmarket" &&
              !isrecommend && (
                <ListPicker
                  hook={tradetimehook}
                  title="trade-time"
                  list={tradetimelist}
                  tooltip={
                    <Tooltip
                      title="Trade time"
                      content="Time interval for trading (include unit e.g 3 minuites)"
                    />
                  }
                />
              )}

            {tradetimehook.pickedRole &&
              optionstype.pickedRole?.code != "realmarket" && (
                <ListPicker
                  hook={timeframehook}
                  title="time-frame (auto)"
                  list={[]}
                  defaultvalue={{ name: timeframe, code: timeframe }}
                  tooltip={
                    <Tooltip
                      title="Time frame"
                      content="Time frame for indicator (include unit e.g 3 minuites)"
                    />
                  }
                />
              )}
          </div>
        )}

      {((!indicators[0].items.some((item: any) =>
        postdata?.indicators?.includes(item)
      ) &&
        !postdata.indicators?.some((item: any) => item?.code == 555)) ||
        optionstype.pickedRole?.code == "realmarket") && (
          <div
            className={`w-full flex flex-col md:flex-row justify-center items-center gap-4 rounded overflow-y-auto ${isrecommend ? "blur-[2px]" : ""
              } `}
          >
            {(indicators[0].items.some((item: any) =>
              postdata?.indicators?.includes(item)
            ) ||
              postdata.indicators?.some((item: any) => item?.code == 555)) && (
                <InputField
                  name="tradetime"
                  title="Input trade time "
                  placeholder={"trade time"}
                  tooltip={
                    <Tooltip
                      title="Trade time"
                      content="Time interval for trading (include unit e.g 3 minuites)"
                    />
                  }
                  control={control}
                />
              )}

            <InputField
              name="timeframe"
              title="Input time frame"
              placeholder={"time frame"}
              tooltip={
                <Tooltip
                  title="Time frame"
                  content="Time frame for indicator (include unit e.g 3 minuites)"
                />
              }
              control={control}
            />
          </div>
        )}
      {(!indicators[0].items.some((item: any) =>
        postdata?.indicators?.includes(item)
      ) ||
        optionstype.pickedRole?.code == "realmarket") && (
          <Button
            style={`!p-2 mt-4 ${isrecommend ? "!bg-green-400" : ""}`}
            outlined={!isrecommend}
            text={
              <>
                {" "}
                <MdAutoMode size={20} className="inline  " /> Recommend for me
              </>
            }
            width={200}
            onBtnClick={() => {
              setisrecommend((prev: any) => !prev);
            }}
          />
        )}

      <NavigateBtns
        shownext
        showprev
        actionPrev={() => {
          previousStep();
        }}
        nextCondition={
          postdata.indicators?.some((item: any) => item?.code == 555)
            ? (!!timeframefieldFilled && !!tradetimefieldFilled) ||
            !!timminghook.pickedRole ||
            (!!optionstype.pickedRole &&
              isrecommend &&
              (optionstype.pickedRole?.code == "otcmarket"
                ? !!timminghook.pickedRole
                : (!!timeframefieldFilled && !!tradetimefieldFilled) ||
                isrecommend))
            : optionstype.pickedRole?.code == "otcmarket"
              ? !!(
                optionstype.pickedRole &&
                timminghook.pickedRole &&
                timeframehook.pickedRole &&
                tradetimehook.pickedRole
              )
              : timeframefieldFilled || tradetimefieldFilled || isrecommend
        }
        actionNext={() => {
          setpostdata((prev: any) => {
            return {
              ...prev,

              tradetime: isrecommend
                ? indicators[0].items.some((item: any) =>
                  postdata?.indicators?.includes(item)
                )
                  ? "recommend for me"
                  : null
                : tradetimefieldFilled
                  ? getValues("tradetime")
                  : optionstype.pickedRole?.code == "otcmarket"
                    ? tradetimehook.pickedRole?.name
                    : null,
              timeframe: isrecommend
                ? "recommend for me"
                : timeframefieldFilled
                  ? getValues("timeframe")
                  : optionstype.pickedRole?.code == "otcmarket"
                    ? timeframehook.pickedRole?.name
                    : null,
            };
          });

          if (!!optionstype.pickedRole?.code) {
            setpostdata((prev: any) => {
              return {
                ...prev,
                timming: timminghook.pickedRole?.name,
                optionsmarkettype: optionstype.pickedRole?.name,
              };
            });
          }

          if (optionstype.pickedRole?.code == "otcmarket") {
            setpostdata((prev: any) => {
              return {
                ...prev,
                tradetime: tradetimehook.pickedRole?.name,
                timeframe: timeframehook.pickedRole?.name,
              };
            });
          }

          nextStep();
        }}
      />
    </div>
  );
};
