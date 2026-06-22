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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MdCheck size={32} className="text-green-500" />
        </div>

        <img src={logo} className="w-[160px] mx-auto mb-6" alt="TradeTimeScanner" />

        <h1 className="font-bold text-gray-900 text-2xl mb-2">
          {isCrypto ? "Crypto Payment Successful" : "Payment Successful"}
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          {isCrypto
            ? "Your crypto payment has been processed. Your subscription is now active."
            : "Welcome to premium! Your account has been upgraded."}
        </p>

        <Button
          text="Go to Dashboard"
          onBtnClick={() => {
            let delplan = { plan: null, date: null };
            localStorage.setItem("checkout", JSON.stringify(delplan));
            navigate("/dashboard");
          }}
          fullWidth
        />
      </div>
    </div>
  );
};
