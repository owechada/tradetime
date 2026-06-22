import { useForm } from "react-hook-form";
import {
  Button,
  InputField,
  SelectField,
} from "../../../../../components/forms";
import { ListPicker } from "../../../../../components/generic/ListPicker";
import { useEffect, useState } from "react";
import { usePickerhook } from "../../../../../hooks/usePickerhook";
import Tooltip from "../../../../../components/generic/Tooltip";
import { NavigateBtns } from "../../../../../components/generic/NavigateBtns";
import { useStateSetter } from "../../../../../hooks/statehooks/UseStateSettersHook";
import { useStateGetter } from "../../../../../hooks/statehooks/UseStateGettersHook";
import { onGenerateCurrencypairs } from "../../../../../services/generate";
import { PulseLoader } from "react-spinners";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { CiTimer } from "react-icons/ci";
import { onSaveScan } from "../../../../../services/user";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import ViewDetailsModal from "../../../../../components/generic/ViewDetailsModal";
import CountDownTimerModal from "../../../../../components/generic/CountDownTimerModal";
import usePremiumHook from "../../../../../hooks/usePremiumHook";

export default ({ nextStep, mainActive, previousStep }: any) => {
  const TimeZoneselecthook = usePickerhook();
  const { setScandetails, setLoading } = useStateSetter();
  const { scandetails, NextStep, PrevStep } = useStateGetter();
  const { control, getValues } = useForm();
  const [showtimer, setshowtimer] = useState(false);
  const { dailycredit, setdailycredit, hasaccess } = usePremiumHook();

  const messages = [
    "Analysising market...",
    "Checking market windows...",
    "Fetching best currency pairs...",
  ];
  const [loadingmsg, setloadingmsg] = useState(messages[0]);
  const [result, setresults] = useState([]);
  const { scanresult, authuser } = useStateGetter();
  const [time, settime] = useState(0);
  const navigate = useNavigate();

  const SaveScan = async () => {
    let postddata = {
      market: scandetails.market,
      date: new Date().toDateString(),
      timezone: scandetails.timezone,
      starttime: scandetails.starttime,
      endtime: scandetails.endtime,
      content: JSON.stringify(scanresult),
      userid: authuser.id,
    };
    setLoading(true);

    try {
      var res = await onSaveScan(postddata);
      toast.success("Saved for later");

      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 2000);
    } catch (e: any) {
      console.log(e);
      toast.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let a = scandetails.starttime;
    let b = scandetails.endtime;

    // Parse the input times in "HH:mm" format
    const [hoursA, minutesA] = a.split(":").map(Number);
    const [hoursB, minutesB] = b.split(":").map(Number);

    // Create Date objects for both times (using the same date)
    const dateA = new Date(0, 0, 0, hoursA, minutesA);
    const dateB = new Date(0, 0, 0, hoursB, minutesB);

    // Calculate the time difference in milliseconds
    const diffMs = Math.abs(dateB.getTime() - dateA.getTime());

    settime(diffMs);
  });

  useEffect(() => {
     if ((!hasaccess) && (mainActive==2)  ) {
      setdailycredit({ ...dailycredit, balance: dailycredit.balance - 1 });
      localStorage.setItem(
        "dailycredit",
        JSON.stringify({ ...dailycredit, balance: dailycredit.balance - 1 })
      );
    }
  }, [mainActive]);
  return (
    <div>
      {showtimer && (
        <CountDownTimerModal
          scandetails={scandetails}
          scanresult={scanresult}
          time={time}
          show={setshowtimer}
        />
      )}
      <div className="border border-1 grid grid-cols-1 md:grid-cols-2  gap-4 w-min-[400px] md-w-[700px] p-4 md:mt-4 border-gray-300 rounded">
        <div className="  rounded bg-gray-200 text-sm font-light p-6 ">
          <p className="">
            <b>Market:</b> {scandetails.market}
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
          <p className="text-md font-bold text-green-300">
            Result <FaCheck className="inline " />
          </p>
          <hr />
          <p className="text-md font-bold text-gray-500">Symbols to trade</p>
          <ul>
            {scanresult?.items
              ?.sort(() => Math.random() - 0.5)
              .map((mn: any) => (
                <li className=" font-light text-md">
                  {scandetails.market.includes("OTC") ? "OTC: " : ""}
                  {mn}
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className="w-full justify-items-end">
        <div className=" w-[80vw] md:w-[50%]  m-2 self-end flex justify-end items-center gap-3 mb-8 md:gap-6">
          <Button
            outlined
            text={
              <>
                <MdOutlineBookmarkAdd className="inline" /> save for later
              </>
            }
            onBtnClick={async () => {
              SaveScan();
            }}
          />

          <Button
            text={
              <>
                <CiTimer className="inline" /> Start timer{" "}
              </>
            }
            onBtnClick={() => {
              setshowtimer(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};
