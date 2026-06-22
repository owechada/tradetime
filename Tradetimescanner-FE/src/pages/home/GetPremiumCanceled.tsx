import { loadStripe } from "@stripe/stripe-js";
import { PackList } from "../../components/generic/PackageSelectionmodal";
import { logo } from "../../constants/imports";
import { onCreateCheckout } from "../../services/user";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { IoMdClose } from "react-icons/io";
import { Button } from "../../components/forms";
import { useNavigate } from "react-router-dom";

export default () => {
  const { authuser } = useStateGetter();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <IoMdClose size={32} className="text-red-500" />
          </div>

          <img src={logo} className="w-[160px] mx-auto mb-6" alt="TradeTimeScanner" />

          <h1 className="font-bold text-gray-900 text-2xl mb-2">
            Payment Not Successful
          </h1>
          <p className="text-gray-500 text-sm">
            Your payment was cancelled or could not be processed. You can try again below.
          </p>
        </div>

        <PackList paid={true} />

        <div className="mt-4">
          <Button
            outlined={true}
            text="Go Back"
            onBtnClick={() => {
              navigate("/");
            }}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
};
