import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CardElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { Button, InputField } from "../forms";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import {
  initiatePaymentIntent,
  onCreateSubscription,
  onUpdateUser,
} from "../../services/user";
import { stripe_PK_live, stripe_PK_test } from "../../utils/URL";
import { loadStripe } from "@stripe/stripe-js";
import { stripelogo } from "../../constants/imports";
import { MdClose } from "react-icons/md";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { Navigate, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export default ({ show, plan }: any) => {
  const stripePromise = loadStripe(stripe_PK_live);
  const { authuser } = useStateGetter();
  const { setLoading } = useStateSetter();
  const { control } = useForm();

  const [clientSecret, setClientSecret] = useState();

  const CheckoutForm = () => {
    const stripe = useStripe();
    const navigate = useNavigate();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const handleSubmit = async () => {
      var checkoutdetails = {
        plan: plan,
        date: new Date().toDateString(),
      };

      localStorage.setItem("checkout", JSON.stringify(checkoutdetails));

      if (!stripe || !elements) {
        alert("Stripe has not loaded yet. Please try again.");
        return;
      }

      const Intentresult = await stripe.confirmSetup({
        elements,
        clientSecret: clientSecret ?? "",
        confirmParams: { return_url: window.location.href },
        redirect: "if_required",
      });

      //const cardElement = elements.getElement(CardElement);

      // if (!cardElement) {
      //   alert("Card element is not available.");
      //   return;
      // }

      // const { error, paymentMethod } = await stripe.createPaymentMethod({
      //   type: "card",
      //   card: cardElement,
      //   billing_details: {
      //     name: authuser.username,
      //   },
      // });
      if (Intentresult.error) {
        toast.error(Intentresult.error.message);
      } else {
        const body = {
          products: [{ name: "Tradetimescanner Premium", plan: plan }],
          name: authuser.username,
          paymentMethod: (Intentresult as any)?.setupIntent?.payment_method,
          email: authuser.mail,
        };

        setLoading(true);
        try {
          var response = await onCreateSubscription(body);

          setClientSecret(response.clientSecret);
          if (response.message) {
            toast(response.message);
          }
          const confirm = await stripe.confirmCardPayment(
            response.clientSecret
          );
          if (confirm.error) {
            alert("Payment unsuccessful!");
            navigate("/premiumcanceled");
          } else {
            alert("Payment Successful! Subscription active.");
            var postdata = {
              data: { subscription_id: response.subscriptionID },
            };

            var res = await onUpdateUser(postdata, authuser.id);

            navigate("/premiumsuccess");
            show(false);
          }
        } catch (e) {
          console.log(e);
        } finally {
          setLoading(false);
        }
      }
    };

    return (
      <div className="flex flex-col rounded-lg bg-gray-50 p-1  md:p-3 md:m-3 ">
        {/* <img width={"200px"} src={stripelogo} alt="" /> */}

        {/* <div className="flex gap-4 ">
          <InputField
            name="mail"
            title="Email"
            defaultvalue={authuser.mail}
            placeholder="email"
            control={control}
            isDisabled
            rules={{
              required: "is required",
            }}
          />
          <InputField
            name="names"
            title="Names"
            defaultvalue={authuser.username}
            placeholder="name"
            control={control}
            isDisabled
            rules={{
              required: "is required",
            }}
          />
        </div> */}

        <PaymentElement className=" p-1 m-1 md:p-3 md:m-3 bg-white rounded-lg font-semibold !text-lg !text-gray-700 " />

        <Button disabled={!stripe} text="Subscribe" onBtnClick={handleSubmit} />
      </div>
    );
  };
  const getClientSecret = async () => {
    try {
      const body = {
        name: authuser.username,
        email: authuser.mail,
      };


      var res = await initiatePaymentIntent(body);
      setClientSecret(res.clientSecret);
    } catch (e: any) {}
  };

  useEffect(() => {
    getClientSecret();
  }, []);

  return (
    <>
      <div className="ModalContainer shadow ">
        <div className=" flex flex-col  overflow-y-scroll overflow-x-scroll rounded-[8px] bg-white  h-[80vh] w-[100vw] md:w-[40vw] p-2 md:p-4 ">
          <p className="font-semibold self-start text-sm flex justify-between capitalize w-full ">
            <span className="leading-6 text-gray-800">
              {" "}
              Complete your {plan} subscription at{" "}
              {plan.includes("monthly") ? "$35" : "$132"}{" "}
            </span>{" "}
            <span>
              {" "}
              <MdClose
                onClick={() => {
                  show(false);
                }}
                size={20}
                className="inline  text-gray-700"
              />
            </span>
          </p>

          {clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
              }}
            >
              <CheckoutForm />
            </Elements>
          ) : (
            <div className="flex w-full h-full justify-center items-center ">
              <ClipLoader
                loading={true}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
