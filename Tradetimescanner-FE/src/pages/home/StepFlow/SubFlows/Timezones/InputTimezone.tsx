import { useForm } from "react-hook-form";
import { InputField, SelectField } from "../../../../../components/forms";
import { ListPicker } from "../../../../../components/generic/ListPicker";
import { useState } from "react";
import { usePickerhook } from "../../../../../hooks/usePickerhook";
import Tooltip from "../../../../../components/generic/Tooltip";
import { NavigateBtns } from "../../../../../components/generic/NavigateBtns";
import { useStateSetter } from "../../../../../hooks/statehooks/UseStateSettersHook";
import { useStateGetter } from "../../../../../hooks/statehooks/UseStateGettersHook";
import timezones from "../../../../../constants/data/timezones.json";

export default ({ nextStep, previousStep }: any) => {
  const TimeZoneselecthook = usePickerhook();
  const { setScandetails } = useStateSetter();
  const { scandetails, NextStep, PrevStep } = useStateGetter();
  const { control, getValues } = useForm();
  return (
    <div>
      <div className="border border-1 p-4 mt-4 border-gray-300 rounded">
        <InputField
          name="inputtimezone"
          title="Input time zone (Optional)"
          placeholder={"time zone"}
        tooltip={  <Tooltip
          title="Input time zone"
          content="Enter an alternative time zone "
        />}
          control={control}
        />
      </div>

      <NavigateBtns
        shownext
        showprev
        actionPrev={PrevStep}
        nextCondition={TimeZoneselecthook.pickedRole != undefined}
        actionNext={() => {

if( getValues("inputtimezone") ){
  setScandetails({ timezone: getValues("inputtimezone")  });
  
}
          
          nextStep();
        }}
      />
    </div>
  );
};
