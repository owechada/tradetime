import { useForm } from "react-hook-form";
import { SelectField } from "../../../../../components/forms";
import { ListPicker } from "../../../../../components/generic/ListPicker";
import { useState } from "react";
import { usePickerhook } from "../../../../../hooks/usePickerhook";
import Tooltip from "../../../../../components/generic/Tooltip";
import { NavigateBtns } from "../../../../../components/generic/NavigateBtns";
import { useStateSetter } from "../../../../../hooks/statehooks/UseStateSettersHook";
import { useStateGetter } from "../../../../../hooks/statehooks/UseStateGettersHook";
import countries from "../../../../../constants/data/countries.json";

export default ({ nextStep, previousStep }: any) => {
  const Stateselecthook = usePickerhook();
  const {setScandetails} =useStateSetter()
  const {scandetails, NextStep} =useStateGetter()
  const { control } = useForm();
  return (
    <div>
      <div className="border border-1 p-4 mt-4 border-gray-300 rounded">
        <ListPicker
          fullwidth
          hook={Stateselecthook}
          title="state"
          list={countries.filter((km:any)=> km.name==scandetails?.country)[0]?.states}
          tooltip={
            <Tooltip
              title="State"
              content="State of residence"
            />
          }
        />
      </div>

      <NavigateBtns
        shownext
        showprev
        actionPrev={() => {
          previousStep();
        }}
        nextCondition={Stateselecthook.pickedRole != undefined}
        actionNext={() => {
            setScandetails({state:Stateselecthook.pickedRole.name})

          NextStep();
        }}
      />
    </div>
  );
};
