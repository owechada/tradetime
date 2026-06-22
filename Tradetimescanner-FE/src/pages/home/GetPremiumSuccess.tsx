import { loadStripe } from "@stripe/stripe-js";
import { PackList } from "../../components/generic/PackageSelectionmodal";
import { logo } from "../../constants/imports";
import {
  getSession,
  onCreateCheckout,
  onUpdateUser,
  requestFreeTrial,
} from "../../services/user";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { IoMdClose } from "react-icons/io";
import { Button } from "../../components/forms";
import { useNavigate } from "react-router-dom";
import { MdCheck } from "react-icons/md";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";

export default () => {
  const { authuser } = useStateGetter();
  const navigate = useNavigate();
  const { setLoading, setAuthuser, setConfig } = useStateSetter();
  const [isCrypto, setIsCrypto] = useState(false);
 const updateUserByCrypto = async () => {
    var checkout = JSON.parse(localStorage.getItem("checkout") ?? "{}");

   
    setLoading(true);

    var subscriptionId = "cryptoonetimepayment";

    var { plan } = checkout;

    if (plan) {
      const expdate = new Date();
      if (plan == "yearly") {
        expdate.setFullYear(expdate.getFullYear() + 1);
      } else if (plan == "monthly") {
        expdate.setMonth(expdate.getMonth() + 1);
      } 
      
     

      var postdata = {
        data: {
          subscription_id: subscriptionId,
          exp_date: expdate.toISOString(),
        },
      };
      var res = await onUpdateUser(postdata, authuser.id);

      //clear the checkout object
      localStorage.setItem("checkout", JSON.stringify({}));
      if (res.success) {
        toast.success(`Welcome to premium `);
        localStorage.setItem(`UserData`, JSON.stringify(res?.user));
        localStorage.setItem(`AuthToken`, res?.token);
        setAuthuser(res?.user);
        const config = {
          headers: {
            Authorization: `Bearer ${res?.token}`,
          },
        };
        setConfig(config);
      }

          setLoading(false);

    } else {
      navigate("/");
    }
  };
  const handleStartFreeTrial = async () => {
    try {
      setLoading(true);

      const response = await requestFreeTrial(authuser.id);

      if (response.success) {
        toast.success(
          "🎉 Free trial activated! You now have 3 days of premium access."
        );
        navigate("/");
      } else {
        throw new Error(response.message || "Failed to activate trial");
      }
    } catch (error) {
      console.error("Error starting free trial:", error);
      toast.error("Failed to start free trial. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    var checkout = JSON.parse(localStorage.getItem("checkout") ?? "{}");

    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );

    if (!sessionId) {
      setIsCrypto(true);
      updateUserByCrypto()
      return;
    }
    setLoading(true);

    var sessionObj = await getSession(sessionId);

    setLoading(false);

    console.log(sessionObj);

    var subscriptionId = sessionObj?.subscription;

    var { plan } = checkout;

    if (plan) {
      const expdate = new Date();
      if (plan == "yearly") {
        expdate.setFullYear(expdate.getFullYear() + 1);
      } else if (plan == "monthly") {
        expdate.setMonth(expdate.getMonth() + 1);
      } else if (plan == "istrial") {
        var pdata = {
          data: {
            subscription_id: subscriptionId,
          },
        };

        setLoading(true);

        var res = await onUpdateUser(pdata, authuser.id);

        setLoading(false);

        handleStartFreeTrial();

        //clear the checkout object
        localStorage.setItem("checkout", JSON.stringify({}));
        return;
      }

      var postdata = {
        data: {
          subscription_id: subscriptionId,
          exp_date: expdate.toISOString(),
        },
      };
      var res = await onUpdateUser(postdata, authuser.id);

      //clear the checkout object
      localStorage.setItem("checkout", JSON.stringify({}));
      if (res.success) {
        toast.success(`Welcome to premium `);
        localStorage.setItem(`UserData`, JSON.stringify(res?.user));
        localStorage.setItem(`AuthToken`, res?.token);
        setAuthuser(res?.user);
        const config = {
          headers: {
            Authorization: `Bearer ${res?.token}`,
          },
        };
        setConfig(config);
      }
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    updateUser();
  }, []);
  return (
    <div className=" p-3 bg-white px-10 flex justify-center items-center w-screen h-screen ">
      <div className="flex flex-col gap-4  md:w-[50vw]  w-full ">
        <div className="flex flex-col items-center gap-2">
          <img onClick={() => { }} src={logo} className=" w-[180px] mb-4 " />
          <div className="flex items-center gap-2">
            <MdCheck size={30} className="text-green-500" />
            <p className="inline font-semibold text-xl ">
              {isCrypto ? "Crypto Payment Successful" : "Payment Successful"}
            </p>
          </div>
        </div>

        {isCrypto && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-gray-700 text-sm">
              Your payment has been processed. Your subscription is now active
            </p>
          </div>
        )}

        <Button
          outlined={true}
          text="Go to dashboard"
          onBtnClick={() => {
            let delplan = { plan: null, date: null };
            localStorage.setItem("checkout", JSON.stringify(delplan));
            navigate("/dashboard");
          }}
        />
      </div>
    </div>
  );
};
