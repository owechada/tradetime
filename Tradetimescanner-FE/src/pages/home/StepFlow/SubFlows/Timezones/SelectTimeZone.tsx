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
  const { getValues } = useForm();

  const { scandetails, NextStep, PrevStep } = useStateGetter();
  const { control,watch } = useForm();
 let inpval =watch("inputtimezone")
  return (
    <div>
      <div className="border border-1 p-4 mt-4 border-gray-300 rounded">
        <ListPicker
          fullwidth
          hook={TimeZoneselecthook}
          title="time zone"
          list={timezones.map((g) => ({
            name: `${g.name} ${g.code}`,
            code: g.code,
          }))}
          tooltip={
            <Tooltip
              title="Time zone"
              content="Time zone of your current location"
            />
          }
        />

        {TimeZoneselecthook.pickedRole?.code == "(input timezone)" && (
          <InputField
            name="inputtimezone"
            title="Input time zone (Optional)"
            placeholder={"time zone"}
            tooltip={
              <Tooltip
                title="Input time zone"
                content="If your timezone isn’t listed above, please enter it manually. You can use either the GMT offset (e.g., GMT-5) or the IANA timezone format (e.g., America/New_York)."
              />
            }
            control={control}
          />
        )}
      </div>

      <NavigateBtns
        shownext
        showprev
        actionPrev={() => {
          PrevStep();
        }}
        nextCondition={ TimeZoneselecthook .pickedRole?.code!="(input timezone)" ?TimeZoneselecthook.pickedRole != undefined   :inpval }
        actionNext={() => {
          setScandetails({
            timezone:
              TimeZoneselecthook.pickedRole?.code != "(input timezone)"
                ? TimeZoneselecthook.pickedRole.name
                : inpval,
          });
          nextStep();
        }}
      />
    </div>
  );
};
