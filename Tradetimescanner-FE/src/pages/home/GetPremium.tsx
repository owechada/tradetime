import { loadStripe } from "@stripe/stripe-js";
import { PackList } from "../../components/generic/PackageSelectionmodal";
import { logo } from "../../constants/imports";
import { onCreateCheckout } from "../../services/user";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import usePremiumHook from "../../hooks/usePremiumHook";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCrown } from "react-icons/fa";

export default () => {
  const { authuser } = useStateGetter();
  const { hasaccess } = usePremiumHook();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authuser.mail) {
      navigate("/");
    }
    if (hasaccess) {
      navigate("/premium");
    }
    console.log(hasaccess, "access");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex justify-center items-center overflow-x-hidden py-8 md:py-12 px-4">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl h-[100vh] rounded-[2.5rem] border border-white shadow-2xl shadow-blue-500/10 p-6 md:p-10 overflow-y-scroll">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <FaCrown className="text-primary text-xs" />
            <span className="text-primary font-black uppercase tracking-widest text-[10px]">Premium Access</span>
          </div>
          <div className="flex justify-center mb-4">
            <img onClick={() => { }} src={logo} className="w-[180px]" alt="TradeTimeScanner" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">
            Get <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Premium</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-md mx-auto">
            Unlock the full power of AI-driven trading analysis and signals
          </p>
        </div>

        <PackList breakdown paid={true} />
      </div>
    </div>
  );
};
