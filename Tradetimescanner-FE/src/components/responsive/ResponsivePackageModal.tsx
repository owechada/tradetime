import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaGift } from "react-icons/fa";
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";

import ResponsiveModal from "./ResponsiveModal";
import { Button } from "../forms";
import { useResponsive } from "../../hooks/useResponsive";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { MontlyPaymentLink, YearlyPaymentLink } from "../../utils/URL";
import { onCreateCryptoCheckout } from "../../services/user";
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

interface ResponsivePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResponsivePackageModal: React.FC<ResponsivePackageModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Unlock Powerful AI Trading Tools"
      size={isMobile ? "full" : "xl"}
      className="max-w-4xl"
    >
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        <PackageCard paid={false} />

        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 flex flex-col justify-center items-center rounded-lg p-4">
          <div className={`flex ${isMobile ? 'flex-col text-center' : 'items-center'} gap-3 mb-3`}>
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <FaGift className="text-white text-lg" />
            </div>
            <div>
              <h3 className={`font-semibold text-gray-800 ${isMobile ? 'text-base' : 'text-lg'}`}>
                Try Premium Free for 3 Days
              </h3>
              <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Experience all premium features at no cost
              </p>
            </div>
          </div>
          <div className="w-full">
            <p className={`text-gray-700 mb-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <FaCheck className="inline text-green-500 mr-2" />
              Full access to all premium tools
            </p>
            <Button
              text="Get Free Trial"
              onBtnClick={() => navigate("/freetrial")}
              OverideStyle="w-full text-white hover:from-green-600 hover:to-blue-700"
            />
          </div>
        </div>

        <PackageCard paid={true} />
      </div>
    </ResponsiveModal>
  );
};

interface PackageCardProps {
  paid: boolean;
  breakdown?: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({ paid, breakdown = false }) => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const { authuser } = useStateGetter();
  const [plan, setPlan] = useState("");
  const [isCryptoLoading, setIsCryptoLoading] = useState(false);
  const { isNigeria, loading: countryLoading } = useUserCountry();

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

  const handleProceed = () => {
    if (paid && !breakdown) {
      navigate("/getpremium");
    } else if (!paid && !breakdown) {
      navigate("/dashboard");
    } else if (paid && breakdown) {
      const checkoutDetails = {
        plan: plan,
        date: new Date().toDateString(),
      };
      localStorage.setItem("checkout", JSON.stringify(checkoutDetails));
      const paymentLink = plan === "monthly" ? MontlyPaymentLink : YearlyPaymentLink;
      window.location.href = `${paymentLink}?prefilled_email=${authuser.mail}`;
    }
  };

  return (
    <div className="border-2 bg-white border-gray-300 text-gray-800 shadow rounded-lg p-4">
      <div className="mb-4">
        <p className="font-bold text-gray-600 mb-1">
          {paid ? "Premium" : "Free"}
        </p>
        {!breakdown && (
          <p className="font-bold">
            <span className={`${isMobile ? 'text-base' : 'text-lg'}`}>
              {paid ? "35 USD" : "0 USD"}
            </span>
            <small className="font-light text-xs ml-1">/ month</small>
          </p>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {packages.map((item, index) => {
          const isIncluded = paid ? item.checked.paid : item.checked.free;
          return (
            <div
              key={index}
              className={`${isIncluded
                ? "text-gray-800 font-semibold"
                : "text-gray-400 line-through"
                } ${isMobile ? 'text-xs' : 'text-sm'}`}
            >
              <p className="flex items-start gap-2">
                <FaCheck
                  className={`mt-0.5 flex-shrink-0 ${isIncluded ? 'text-green-400' : 'text-gray-300'
                    }`}
                />
                <span>{item.name}</span>
              </p>
              <p className={`font-light mt-1 ml-6 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {paid && breakdown && (
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-col md:flex-row'} gap-3 mb-4`}>
          <div
            onClick={() => setPlan("monthly")}
            className="font-bold border p-3 rounded cursor-pointer hover:border-blue-500 transition-colors"
          >
            <small className="block font-light text-xs mb-1">
              Monthly subscription
            </small>
            <div className="flex items-center gap-2">
              {plan === "monthly" ? (
                <MdRadioButtonChecked className="text-blue-500" />
              ) : (
                <MdRadioButtonUnchecked className="text-gray-400" />
              )}
              <span className={isMobile ? 'text-base' : 'text-lg'}>$35</span>
              <small className="font-light text-xs">/ month</small>
            </div>
          </div>

          <div
            onClick={() => setPlan("yearly")}
            className="font-bold border p-3 rounded cursor-pointer hover:border-blue-500 transition-colors"
          >
            <small className="block font-light text-xs mb-1">
              Yearly subscription
            </small>
            <div className="flex items-center gap-2">
              {plan === "yearly" ? (
                <MdRadioButtonChecked className="text-blue-500" />
              ) : (
                <MdRadioButtonUnchecked className="text-gray-400" />
              )}
              <span className={isMobile ? 'text-base' : 'text-lg'}>$25</span>
              <small className="font-light text-xs">/ month</small>
              <span className="ml-1">($300)</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {!(paid && breakdown && (isNigeria || countryLoading)) && <Button
          outlined={!paid}
          disabled={paid && breakdown ? plan.length === 0 : false}
          text={paid && breakdown ? "Proceed (Card)" : "Proceed"}
          onBtnClick={handleProceed}
          OverideStyle="w-full"
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
                        style="  border-none hover:bg-[#e88a18]"
          />
        )}
      </div>
    </div>
  );
};

export default ResponsivePackageModal;
export { PackageCard };