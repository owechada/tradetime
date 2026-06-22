import { useForm } from "react-hook-form";
import { InputField, SelectField } from "../../../../../components/forms";
import { ListPicker } from "../../../../../components/generic/ListPicker";
import { useEffect, useState } from "react";
import { usePickerhook } from "../../../../../hooks/usePickerhook";
import Tooltip from "../../../../../components/generic/Tooltip";
import { NavigateBtns } from "../../../../../components/generic/NavigateBtns";
import { useStateSetter } from "../../../../../hooks/statehooks/UseStateSettersHook";
import { useStateGetter } from "../../../../../hooks/statehooks/UseStateGettersHook";
import { onGenerateCurrencypairs } from "../../../../../services/generate";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Brokers_list } from "../../../../../constants/data/data";

export default ({ nextStep, previousStep }: any) => {
  const brokerhook = usePickerhook();
  const [isloading, setisloading] = useState(false);

  const { scandetails, NextStep, PrevStep } = useStateGetter();
  const { setScanresult } = useStateSetter();
  const messages = [
    "Analysing market...",
    "Checking market windows...",
    "Fetching best currency pairs...",
  ];
  const [addition, setaddition] = useState("");
  const [loadingmsg, setloadingmsg] = useState(messages[0]);

  useEffect(() => {
    if(brokerhook.pickedRole?.name){
      setaddition(`, Broker: ${brokerhook.pickedRole?.name}`);
    }
    
    
  }, [brokerhook.pickedRole]);
  useEffect(() => {
    setInterval(() => {
      const randomNum = Math.floor(Math.random() * 3);
      setloadingmsg(messages[randomNum]);
    }, 2000);
  }, []);

  const submit = async () => {
    var postddata = {
      data: {
        market: `${scandetails.market}`,
        date: new Date().toDateString,
        timezone: `${scandetails.country}  ${scandetails.state} ${scandetails.timezone}`,
        starttime: scandetails.starttime,
        endtime: scandetails.endtime,
      },
    };
    try {
      setisloading(true);
      var response = await onGenerateCurrencypairs(postddata);
      setTimeout(() => {
        setScanresult(response);
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
    <div>
      <div className="border border-1 grid grid-cols-1 md:grid-cols-2 gap-4bg-gray-200   w-min-[400px] md:w-[700px] p-4 mt-4 border-gray-300 rounded">
        <div className="  rounded  text-sm font-light p-6 ">
          <p className="">
            <b>Market:</b> {`${scandetails.market} ${addition ?? ""}`}
          </p>
          <p className="">
            <b>Country:</b> {scandetails.country}
          </p>
          <p className="">
            <b> State: </b>
            {scandetails.state}
          </p>
          <p className="">
            <b> Time Zone: </b>
            {scandetails.timezone}
          </p>
          <p className="">
            <b>Trade Start Time:</b> {scandetails.starttime}
          </p>
          <p className="">
            <b> Trade Stop Time:</b> {scandetails.endtime}
          </p>
          <p className="">
            <b> Date:</b> {new Date().toDateString()}
          </p>
        </div>

        <div className="bg-white rounded p-6  ">
          {scandetails.market.toLowerCase().includes("otc") && (
            <div>
              <p className="text-sm font-[500]">Market type: OTC </p>
              <ListPicker
                fullwidth
                hook={brokerhook}
                title=" Broker"
                list={Brokers_list}
                tooltip={
                  <Tooltip
                    title="Market "
                    content="Medium through which assets are traded, enabling buyers and sellers to interact and facilitate exchanges"
                  />
                }
              />
            </div>
          )}

          {isloading && (
            <div className=" m-12  justify-items-center justify-center">
              <PulseLoader
                className=" m-12 justify-center"
                color={"#350080"}
                loading={isloading}
                size={18}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <p className=" flex animate-pulse justify-center items-center transition-all ease-in-out   delay-1000  duration-1000  w-[400px] text-gray-400 font-semibold ">
                {loadingmsg}
              </p>
            </div>
          )}
        </div>
      </div>

      <NavigateBtns
        shownext
        showprev
        islast
        actionPrev={PrevStep}
        nextCondition={  scandetails.market.toLowerCase().includes("otc") ?(brokerhook.pickedRole?.code !=undefined && !isloading) :!isloading}
        actionNext={async () => {
          await submit();
        }}
      />
    </div>
  );
};
