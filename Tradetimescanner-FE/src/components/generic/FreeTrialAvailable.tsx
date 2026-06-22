import { FaGift, FaCheck } from "react-icons/fa";
import { Button } from "../forms";
import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();
  return (
    <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
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
        {/* <Button
          text="Start Free Trial"
          onBtnClick={() => navigate("/freetrial")}
          OverideStyle=" text-white hover:from-green-600 hover:to-blue-700"
        /> */}
      </div>
    </div>
  );
};
