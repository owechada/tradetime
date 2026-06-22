import { useForm } from "react-hook-form";
import { SelectField } from "../../../../../components/forms";
import { ListPicker } from "../../../../../components/generic/ListPicker";
import { useEffect, useState } from "react";
import { usePickerhook } from "../../../../../hooks/usePickerhook";
import Tooltip from "../../../../../components/generic/Tooltip";
import { NavigateBtns } from "../../../../../components/generic/NavigateBtns";
import { useStateSetter } from "../../../../../hooks/statehooks/UseStateSettersHook";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import PackageSelectionmodal from "../../../../../components/generic/PackageSelectionmodal";
import { useNavigate } from "react-router-dom";
import usePremiumHook from "../../../../../hooks/usePremiumHook";
import { toast } from "react-toastify";
import { CiCircleAlert } from "react-icons/ci";

export default ({ nextStep, previousStep }: any) => {
  const marketselecthook = usePickerhook();
  const { setScandetails } = useStateSetter();
  const { dailycredit, hasaccess, setdailycredit } = usePremiumHook();
  const [showpack, setshowpack] = useState(false);
  const { control } = useForm();
  const [dailycredlimit, setdailycredlimit] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      {showpack && (
        <PackageSelectionmodal
          show={(state: boolean) => {
            setshowpack(state);
          }}
        />
      )}
      {dailycredlimit && (
        <PackageSelectionmodal
          show={(state: boolean) => {
            navigate("/");
          }}
        />
      )}

      {!hasaccess && (
        <p className="font-[400] mt-3 text-red-500 ">
          {" "}
          <CiCircleAlert className="inline " /> You have {dailycredit.balance}{" "}
          of 4 free market scans left
        </p>
      )}
      <div className="border border-1 p-4 mt-4 border-gray-300 rounded">
        <ListPicker
          fullwidth
          hook={marketselecthook}
          title="market"
          labelExclude={["forex", "OTC (Over-the-Counter)"]}
          notaction={() => {
            setshowpack(true);
            return;
          }}
          label={
            <div className=" flex  p-2 rounded-full bg-green-100 text-gray-500 font-semibold">
              {" "}
              <MdOutlineWorkspacePremium className=" " />
              Pro
            </div>
          }
          list={[
            { name: "Forex", code: "forex" },
            { name: "OTC (Over-the-Counter)", code: "OTC (Over-the-Counter)" },

            { name: "Commodity Markets", code: "Commodity Markets" },
            { name: "Stock Markets", code: " Stock Markets" },
            {
              name: "Index Markets (ETF and Index Funds)",
              code: "Index Markets (ETF and Index Funds)",
            },
            {
              name: "Futures and Options Markets",
              code: "Futures and Options Markets",
            },
            { name: "Bond Markets", code: "Bond Markets" },
            {
              name: "Cryptocurrency Exchanges",
              code: "Cryptocurrency Exchanges",
            },
          ]}
          tooltip={
            <Tooltip
              title="Market "
              content="Medium through which assets are traded, enabling buyers and sellers to interact and facilitate exchanges"
            />
          }
        />
      </div>

      <NavigateBtns
        shownext
        actionPrev={() => {
          previousStep();
        }}
        nextCondition={marketselecthook.pickedRole != undefined}
        actionNext={() => {
          if (dailycredit.balance == 0 && !hasaccess) {
            toast("You've exhausted your daily free scans for today!", {
              toastId: "limit-toast",
            });
            setdailycredlimit(true);

            return;
          }

          setScandetails({ market: marketselecthook.pickedRole.name });
          nextStep();
        }}
      />
    </div>
  );
};
