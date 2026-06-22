import { useForm } from "react-hook-form";
import { SelectField } from "../../../../../components/forms";
import { ListPicker } from "../../../../../components/generic/ListPicker";
import { useState } from "react";
import { usePickerhook } from "../../../../../hooks/usePickerhook";
import Tooltip from "../../../../../components/generic/Tooltip";
import { NavigateBtns } from "../../../../../components/generic/NavigateBtns";
import { useStateSetter } from "../../../../../hooks/statehooks/UseStateSettersHook";
import countries from "../../../../../constants/data/countries.json";

export default ({ nextStep, previousStep }: any) => {
  const countryselecthook = usePickerhook();
  const {setScandetails} =useStateSetter()

  const { control } = useForm();
  return (
    <div>
      <div className="border border-1 p-4 mt-4 border-gray-300 rounded">
        <ListPicker
          fullwidth
          hook={countryselecthook}
          title="country"
          list={countries.map((item)=>{

            return {name:item.name, code:item.code2}
          })}
          tooltip={
            <Tooltip
              title="Country"
              content="Country of residence"
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
        nextCondition={countryselecthook.pickedRole != undefined}
        actionNext={() => {
            setScandetails({country:countryselecthook.pickedRole.name})

          nextStep();
        }}
      />
    </div>
  );
};
