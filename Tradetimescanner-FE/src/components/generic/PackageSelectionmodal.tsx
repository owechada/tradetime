import {
  MdCancel,
  MdRadioButtonChecked,
  MdRadioButtonUnchecked,
} from "react-icons/md";
import { Button } from "../forms";
import { FC, useState } from "react";
import { FaCheck, FaUnlockAlt, FaGift } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  MontlyPaymentLink,

  YearlyPaymentLink,
} from "../../utils/URL";
import {
  initiatePaymentIntent,
  onCreateCheckout,
  onCreateSubscription,
  onCreateCryptoCheckout,
} from "../../services/user";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { PaymentElement } from "@stripe/react-stripe-js";
import Checkoutmodal from "./Checkoutmodal";
import { useUserCountry } from "../../hooks/useUserCountry";

const packages = [
  {
    name: "Market scanner",
    desc: "Scan the market for the most stable currency pairs to trade in your location.",
    checked: { paid: true, free: true },
  },
  {
    name: "Market Analysis",
    desc: "Get detailed analysis of various markets for trading.",
    checked: { paid: true, free: false },
  },
  {
    name: "Strategy Generator",
    desc: "Easily generate a trading strategy for any indicator with just a few clicks.",
    checked: { paid: true, free: false },
  },
  {
    name: "Signal Room",
    desc: "Gain access to our VIP Signal Room and maximize your profits.",
    checked: { paid: true, free: false },
  },
];

export default ({ show }: any) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[200] flex justify-center items-center bg-black/40 backdrop-blur-md p-4">
      <div className="flex flex-col rounded-3xl bg-white/95 backdrop-blur-xl w-[90vw] md:w-[56vw] max-w-[900px] max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/20 border border-gray-100/50 animate-modal-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/80 to-blue-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-md shadow-amber-500/25">
              <FaUnlockAlt className="text-white" size={16} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Unlock AI Trading Tools</h2>
              <p className="text-xs text-gray-400">Choose a plan to get started</p>
            </div>
          </div>
          <button
            onClick={() => show(false)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            <MdCancel size={22} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6">
          {/* Free Trial Banner */}
          <div className="mb-5 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/60 rounded-2xl p-4 md:p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
                <FaGift className="text-white" size={16} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">
                  Try Premium Free for 3 Days
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Full access to all premium tools at no cost
                </p>
                <Button
                  text="Start Free Trial"
                  onBtnClick={() => navigate("/freetrial")}
                  fullWidth={false}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PackList disabled={true} paid={false} />
            <PackList disabled={true} paid={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface PacklistProp {
  paid: boolean;
  breakdown?: boolean;
  disabled?: boolean;
}

const PackList: FC<PacklistProp> = ({ paid, disabled, breakdown }) => {
  const navigate = useNavigate();
  const [plan, setplan] = useState("");
  const [planLink, setplanLink] = useState("");

  const { authuser, isAdmin } = useStateGetter();

  const [showsubscribe, setshowsubscribe] = useState(false);
  const [isCryptoLoading, setIsCryptoLoading] = useState(false);

  const handleCryptoPayment = async () => {
    if (!plan) return;
    try {
      setIsCryptoLoading(true);
      const postData = {
        userId: authuser.id,
        plan: plan,
      };
      const data = await onCreateCryptoCheckout(postData);
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Failed to initiate crypto payment: " + (data.message || "Unknown error"));
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      alert("An error occurred while processing crypto payment: " + (error.message || error));
    } finally {
      setIsCryptoLoading(false);
    }
  };

  const { isNigeria, loading: countryLoading } = useUserCountry();

  return (
    <div className={`bg-white rounded-2xl border-2 text-gray-800 shadow-sm p-5 transition-all duration-200 ${paid ? 'border-primary/30 shadow-primary/5' : 'border-gray-200'}`}>
      {!paid && !breakdown && (
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Free</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900">$0</span>
            <span className="text-sm text-gray-400 font-medium">/ month</span>
          </div>
        </div>
      )}
      {paid && breakdown && (
        <div className="mb-4">
          <p className="text-xs font-bold text-primary uppercase tracking-wider">Premium</p>
        </div>
      )}

      {paid && !breakdown && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-bold text-primary uppercase tracking-wider">Premium</p>
            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Popular</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900">$35</span>
            <span className="text-sm text-gray-400 font-medium">/ month</span>
          </div>
        </div>
      )}

      <div className="space-y-3 mb-5">
        {packages.map((item, index) => {
          const isIncluded = (item.checked.free && !paid) || (item.checked.paid && paid);
          return (
            <div key={index} className="flex items-start gap-2.5">
              <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isIncluded ? 'bg-green-100' : 'bg-gray-100'}`}>
                <FaCheck className={isIncluded ? 'text-green-500' : 'text-gray-300'} size={10} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${isIncluded ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                  {item.name}
                </p>
                <p className={`text-xs mt-0.5 ${isIncluded ? 'text-gray-500' : 'text-gray-300'}`}>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {paid && breakdown && (
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div
            onClick={() => {
              setplan("monthly");
              setplanLink(MontlyPaymentLink);
            }}
            className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${plan === "monthly" ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
          >
            <p className="text-xs text-gray-500 font-medium mb-1">Monthly</p>
            <div className="flex items-center gap-1.5">
              {plan === "monthly" ? (
                <MdRadioButtonChecked className="text-primary" size={18} />
              ) : (
                <MdRadioButtonUnchecked className="text-gray-300" size={18} />
              )}
              <span className="text-lg font-black text-gray-900">$35</span>
              <span className="text-xs text-gray-400">/ month</span>
            </div>
          </div>

          <div
            onClick={() => {
              setplan("yearly");
              setplanLink(YearlyPaymentLink);
            }}
            className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${plan === "yearly" ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-gray-500 font-medium">Yearly</p>
              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Save 29%</span>
            </div>
            <div className="flex items-center gap-1.5">
              {plan === "yearly" ? (
                <MdRadioButtonChecked className="text-primary" size={18} />
              ) : (
                <MdRadioButtonUnchecked className="text-gray-300" size={18} />
              )}
              <span className="text-lg font-black text-gray-900">$25</span>
              <span className="text-xs text-gray-400">/ month</span>
              <span className="text-xs font-semibold text-gray-500">($300/yr)</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
       {!(paid && breakdown) && <Button
          outlined={!paid}
          disabled={paid && breakdown ? !(plan.length > 1) : !disabled}
          text={paid ? "Get Premium" : "Continue Free"}
          onBtnClick={() => {
            if (paid && !breakdown) {
              navigate("/getpremium");
            } else if (!paid && !breakdown) {
              navigate("/dashboard");
            }
          }}
        />}

        { paid && breakdown && !isNigeria && !countryLoading
         &&
        <Button
          outlined={!paid}
          disabled={paid && breakdown ? !(plan.length > 1) : !disabled}
          text="Pay with Stripe"
          onBtnClick={() => {
             if (paid && breakdown) {
              var checkoutdetails = {
                plan: plan,
                date: new Date().toDateString(),
              };
              localStorage.setItem("checkout", JSON.stringify(checkoutdetails));
              window.location.href = `${planLink}?prefilled_email=${authuser.mail}`;
            }
          }}
        />}

        {paid && breakdown && (
          <Button
            disabled={!plan || isCryptoLoading}
            text={isCryptoLoading ? "Processing..." : "Pay with Crypto"}
            onBtnClick={() => {

              var checkoutdetails = {
                plan: plan,
                date: new Date().toDateString(),
              };
              localStorage.setItem("checkout", JSON.stringify(checkoutdetails));

              handleCryptoPayment()
            }

            }
            outlined
          />
        )}
      </div>

      {showsubscribe && <Checkoutmodal show={setshowsubscribe} plan={plan} />}
    </div>
  );
};

export { PackList };
