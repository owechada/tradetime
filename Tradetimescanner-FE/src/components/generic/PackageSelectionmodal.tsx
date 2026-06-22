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
    desc: "Gain access to our VIP Signal Room and maximize your profits.",
    checked: { paid: true, free: false },
  },
];

export default ({ show }: any) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="ModalContainer  backdrop-blur-sm flex justify-center items-center w-full  shadow ">
        <div className=" flex flex-col    rounded-[8px] bg-gray-200 mt-[10vh] w-[90vw]  md:w-[50vw] p-4  max-h-[90vh] overflow-y-scroll ">
          <div className="flex justify-between items-center my-2 ">
            <p className="font-semibold self-start flex justify-center items-center gap-2 text-gray-700  ">
              <FaUnlockAlt className="inline text-orange-400 " />
              Unlock Powerful AI Trading Tools.
            </p>
            <MdCancel
              onClick={() => {
                show(false);
              }}
              size={20}
              className="text-gray-400 "
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <PackList disabled={true} paid={false} />

            {/* Free Trial Section */}
            <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200  flex flex-col  justify-center items-center rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <FaGift className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Try Premium Free for 3 Days
                  </h3>
                  <p className="text-sm text-gray-600">
                    Experience all premium features at no cost
                  </p>
                </div>
              </div>
              <div className="flex flex-col  gap-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-2">
                    <FaCheck className="inline text-green-500 mr-2" />
                    Full access to all premium tools
                  </p>
                </div>
                <Button
                  text="Get Free Trial"
                  onBtnClick={() => navigate("/freetrial")}
                  OverideStyle=" text-white hover:from-green-600 hover:to-blue-700"
                />
              </div>
            </div>
            <PackList disabled={true} paid={true} />
          </div>
        </div>
      </div>
    </>
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

  // async function handleCheckout() {

  //   const stripe = await loadStripe(stripe_PK_test);

  //   const paymentMethod = await stripe?.createPaymentMethod({
  //     card: elements?.getElement("card"),
  //     type: "card",
  //   });
  //   const body = {
  //     products: [{ name: "Tradetimescanner Premium", plan: plan }],
  //     name:authuser.username,
  //     paymentMethod: paymentMethod.paymentMethod.id,
  //     email:authuser.mail,
  //   };

  //   var checkoutdetails = {
  //     plan: plan,
  //     date: new Date().toDateString(),
  //   };

  //   localStorage.setItem("checkout", JSON.stringify(checkoutdetails));

  //   var response = await onCreateCheckout(body);
  //   var result = await stripe?.redirectToCheckout({
  //     sessionId: response.sessionId,
  //   });
  // }

  const { isNigeria, loading: countryLoading } = useUserCountry();

  return (
    <div className="border-2 bg-white border-gray-300 border-solid  text-gray-800 shadow rounded-lg p-3 ">
      {!paid && !breakdown && (
        <div className="mb-2 text-gray-600">
          <p className="font-bold  text-gray-600 ">Free</p>
          <p className="font-bold">
            <h1 className="inline text-lg">0 USD </h1>
            <small className="inline font-light text-xs">/ month</small>
          </p>
        </div>
      )}
      {paid && breakdown && (
        <p className="font-bold text-gray-600  mb-2">Premium</p>
      )}

      {paid && !breakdown && (
        <div className="mb-2  text-gray-600">
          <p className="font-bold text-gray-600 ">Premium</p>
          <p className="font-bold">
            <h1 className="inline text-lg">35 USD </h1>
            <small className="inline font-light text-xs">/ month</small>
          </p>
        </div>
      )}

      {packages.map((item, index) => (
        <div
          key={index}
          className={`line-through   text-gray-500  ${item.checked.free && !paid
            ? " !text-gray-800 font-semibold no-underline"
            : ""
            }   ${item.checked.paid && paid
              ? " !text-gray-800 font-semibold no-underline"
              : ""
            } text-sm  justify-center text-start`}
        >
          <p>
            <FaCheck className={`inline m-1 text-green-400`} />
            {item.name}
          </p>
          <p className="text-xs  mb-4 mt-1 font-light">{item.desc}</p>
        </div>
      ))}

      {paid && breakdown && (
        <div className="flex  flex-col md:flex-row justify-between md:px-10 ">
          <div
            onClick={() => {
              setplan("monthly");
              setplanLink(MontlyPaymentLink);
            }}
            className="font-bold border p-3 rounded cursor-pointer"
          >
            <small className=" block font-light text-xs">
              Monthly subscription
            </small>
            {plan == "monthly" ? (
              <MdRadioButtonChecked className="inline text-primary" />
            ) : (
              <MdRadioButtonUnchecked className="inline text-primary" />
            )}
            <h1 className="inline text-lg">$35 </h1>
            <small className="inline font-light text-xs">/ month</small>
          </div>

          <div
            onClick={() => {
              setplan("yearly");
              setplanLink(YearlyPaymentLink);
            }}
            className="font-bold border p-3 rounded cursor-pointer"
          >
            <small className=" block font-light text-xs">
              Yearly subscription
            </small>
            {plan == "yearly" ? (
              <MdRadioButtonChecked className="inline text-primary" />
            ) : (
              <MdRadioButtonUnchecked className="inline text-primary" />
            )}
            <h1 className="inline text-lg">$25 </h1>
            <small className="inline font-light text-xs">/ month</small>
            <h1 className=" inline ">($300) </h1>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
       {!(paid && breakdown)&& <Button
          outlined={!paid}
          disabled={paid && breakdown ? !(plan.length > 1) : !disabled}
          text="Proceed"
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
            style="  border-none hover:bg-[#e88a18]"
          />
        )}
      </div>

      {showsubscribe && <Checkoutmodal show={setshowsubscribe} plan={plan} />}
    </div>
  );
};

export { PackList };
