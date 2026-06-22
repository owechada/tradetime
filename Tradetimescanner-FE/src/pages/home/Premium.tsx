import usePagination from "@mui/material/usePagination/usePagination";
import { PackList } from "../../components/generic/PackageSelectionmodal";
import { logo } from "../../constants/imports";
import usePremiumHook from "../../hooks/usePremiumHook";
import { useEffect, useState } from "react";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/forms";
import { Cancelsubscription, getSubscription } from "../../services/user";
import { FaDotCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";

export default () => {
  const { hasaccess } = usePremiumHook();
  const { authuser } = useStateGetter();
  const { setLoading } = useStateSetter();
  const [subdet, setsubdet] = useState<any>({});

  const init = async () => {
    setLoading(true);
    try {
      var response = await getSubscription(authuser.subscription_id);
      setsubdet(response);
    } catch (e: any) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    init();
  }, []);
  const navigate = useNavigate();
  return (
    <div className=" p-3 bg-white md:px-10 flex  justify-center w-full items-center h-screen ">
      <div className="flex flex-col gap-4  md:w-[50vw]  w-full ">
        <p className="inline  text-sm font-semibold ">
          {" "}
          <img onClick={() => {}} src={logo} className=" w-[180px] inline" />
          {hasaccess ? " You've got premium" : "Get Premium"}
        </p>
        {!hasaccess && <PackList disabled={!hasaccess} paid={true} />}
        {hasaccess && (
          <div className=" p-3 bg-white border  font-light rounded-lg capitalize border-gray-400 ">
            <p className="inline font-bold  text-gray-600 ">
              {" "}
              {`Your subsciption ${ subdet.status?'renews':'expires'} ${new Date(
                authuser.exp_date
              ).toDateString()}`}
            </p>
            
          { subdet.status ? <div> <p className=" text-gray-500 ">
              {" "}
              <p className="font-semibold text-gray-700">Subscription details</p>
              <FaDotCircle
                className={` ${
                  subdet?.status?.toLowerCase().includes("active")
                    ? "text-green-500"
                    : "text-red-500"
                } mx-2  inline`}
              />
              {subdet?.status}
            </p>
            Customer ID:
            <p className="font-semibold text-gray-500">{subdet?.customer}</p>
            Amount:
            <p className="text-lg font-bold text-gray-500">{subdet?.amount}</p>
            Period :
            <p className="font-semibold text-gray-500">
              {new Date(subdet?.start_date).toDateString()} -{" "}
              {new Date(subdet?.current_period_end).toDateString()}{" "}
            </p>
            </div>:<div>
            
              </div>}


            <div className="flex flex-col md:flex-row gap-3 p-2">
              <Button
                outlined={true}
                text="Go back"
                onBtnClick={() => {
                  navigate("/");
                }}
              />
              <Button
                disabled={
                  !(
                    subdet?.status?.toLowerCase().includes("trialing") ||
                    subdet?.status?.toLowerCase().includes("active")
                  )
                }
                text="Cancel subscription"
                onBtnClick={async () => {
                  setLoading(true);
                  try {
                    var response = await Cancelsubscription(
                      authuser.subscription_id
                    );
                    toast.success("Subscription canceled!");
                  } catch (e: any) {
                    console.log(e);
                  } finally {
                    await init();
                    setLoading(false);
                  }
                }}
              />
              <Button
                disabled={subdet?.status?.toLowerCase().includes("active")}
                text="Re-Subscribe"
                onBtnClick={async () => {
                  navigate("/getpremium");
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
