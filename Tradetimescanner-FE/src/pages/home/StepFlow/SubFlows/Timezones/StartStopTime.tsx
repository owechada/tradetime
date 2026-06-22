import { useForm } from "react-hook-form";
import { InputField, SelectField } from "../../../../../components/forms";
import { ListPicker } from "../../../../../components/generic/ListPicker";
import { useEffect, useState } from "react";
import { usePickerhook } from "../../../../../hooks/usePickerhook";
import Tooltip from "../../../../../components/generic/Tooltip";
import { NavigateBtns } from "../../../../../components/generic/NavigateBtns";
import { useStateSetter } from "../../../../../hooks/statehooks/UseStateSettersHook";
import { useStateGetter } from "../../../../../hooks/statehooks/UseStateGettersHook";
import timezones from "../../../../../constants/data/timezones.json";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default ({ nextStep, previousStep }: any) => {
  const TimeZoneselecthook = usePickerhook();
  const { setScandetails } = useStateSetter();
const [errormsg, seterrormsg] =useState("")
  const { scandetails, NextStep, PrevStep } = useStateGetter();
  const { control, getValues, watch } = useForm();
  const [value, setValue] = useState<any>();
  const [value1, setValue1] = useState<any>();
  const [time, setTime] = useState<any>();
  const [time1, setTime1] = useState<any>();
  const [thirdcondition, setthirdcondition] = useState(false);
    
  useEffect(() => {
    console.log(value?.$d);

    setTime(new Date(value).toLocaleTimeString());
    setTime1(new Date(value1).toLocaleTimeString());

if(!((new Date(value1).getTime() - new Date(value).getTime())>=3600000 )){
seterrormsg("Stop time must be at least 1hr after start time.")
setthirdcondition(false)
}
else{
  seterrormsg("")
  setthirdcondition(true)

}

  }, [value, value1]);
  var fields = watch(["starttime", "stoptime"]);

  return (
    <div>
      <div className="border border-1 p-4 mt-4 border-gray-300 rounded">
        <div className="flex  flex-col md:flex-row gap-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker", "TimePicker"]}>
              <TimePicker
                label="Start time"
                value={value}
                onChange={(newValue) => setValue(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker", "TimePicker"]}>
              <TimePicker
                label="Stop time"
                value={value}
                onChange={(newValue) => setValue1(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
       
        </div>

        <p className="w-full flex justify-center items-center text-[10px] my-2  text-red-400">{errormsg}</p>
      </div>

      <NavigateBtns
        shownext
        showprev
        actionPrev={previousStep}
        nextCondition={time != undefined && time1 != undefined && thirdcondition}
        actionNext={() => {
          setScandetails({
            starttime: time,
            endtime: time1,
          });
          NextStep();
        }}
      />
    </div>
  );
};
