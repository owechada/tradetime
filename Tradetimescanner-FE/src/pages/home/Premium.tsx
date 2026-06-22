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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 md:py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <img src={logo} className="w-[140px]" alt="TradeTime Scanner" />
          <div className="h-8 w-px bg-gray-300" />
          <h1 className="text-xl font-bold text-gray-900">
            {hasaccess ? "Premium Active" : "Get Premium"}
          </h1>
        </div>

        {!hasaccess && <PackList disabled={!hasaccess} paid={true} />}

        {hasaccess && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-blue-500/10 overflow-hidden">
            {/* Status Banner */}
            <div className="p-5 bg-gradient-to-r from-primary/10 to-blue-600/10 border-b border-gray-100">
              <p className="font-bold text-gray-800 text-base">
                {`Your subscription ${subdet.status ? 'renews' : 'expires'} ${new Date(
                  authuser.exp_date
                ).toDateString()}`}
              </p>
            </div>

            {/* Subscription Details */}
            {subdet.status ? (
              <div className="p-6 space-y-4">
                <h3 className="font-bold text-gray-900 text-base mb-4">Subscription Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <FaDotCircle
                        className={`${
                          subdet?.status?.toLowerCase().includes("active")
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                        size={10}
                      />
                      <span className="font-semibold text-gray-800 capitalize">{subdet?.status}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">Amount</p>
                    <p className="text-lg font-bold text-gray-900">{subdet?.amount}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">Customer ID</p>
                    <p className="font-medium text-gray-700 text-sm truncate">{subdet?.customer}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">Billing Period</p>
                    <p className="font-medium text-gray-700 text-sm">
                      {new Date(subdet?.start_date).toDateString()} - {new Date(subdet?.current_period_end).toDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6" />
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 p-6 pt-2 border-t border-gray-100">
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
