import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaCrown,
  FaClock,
  FaCheck,
  FaUnlockAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { logo } from "../../constants/imports";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import usePremiumHook from "../../hooks/usePremiumHook";
import Button from "../../components/forms/Button";
import Spinner from "../../components/generic/Spinner";
import { requestFreeTrial, checkFreeTrialStatus } from "../../services/user";
import { TrialMontlyPaymentLink } from "../../utils/URL";
import { useUserCountry } from "../../hooks/useUserCountry";

const FreeTrial: React.FC = () => {
  const navigate = useNavigate();
  const { authuser } = useStateGetter();
  const { hasaccess } = usePremiumHook();
  const [loading, setLoading] = useState(false);
  const { isNigeria, loading: countryLoading } = useUserCountry();
  const [trialStatus, setTrialStatus] = useState<{
    has_taken_free_trial: boolean;
    can_take_free_trial: boolean;
    current_trial_status: string;
    trial_expiry: string;
  } | null>(null);

  useEffect(() => {
    if (!authuser.mail) {
      navigate("/");
      return;
    }

    if (hasaccess) {
      navigate("/premium");
      return;
    }

    // Check trial status when component mounts
    checkTrialStatus();
  }, [authuser.mail, hasaccess, navigate]);

  const checkTrialStatus = async () => {
    try {
      setLoading(true);
      const response = await checkFreeTrialStatus(authuser.id);
      if (response.success) {
        setTrialStatus(response.data);
      }
    } catch (error) {
      console.error("Error checking trial status:", error);
      toast.error("Failed to check trial status");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPackages = () => {
    navigate("/getpremium");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Spinner loading={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-[120px] md:w-[180px]" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Free Trial
            </h1>
          </div>
          <button
            onClick={handleBackToPackages}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft />
            <span className="hidden md:inline">Back to Packages</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Trial Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <FaCrown className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    3-Day Free Trial
                  </h2>
                  <p className="text-gray-600">
                    Experience premium features at no cost
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaClock className="text-blue-500" />
                  <span className="text-gray-700">
                    Valid for 3 days from activation
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaUnlockAlt className="text-green-500" />
                  <span className="text-gray-700">
                    Full access to all premium features
                  </span>
                </div>
              </div>
            </div>

            {/* Trial Status */}
            {trialStatus && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Your Trial Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Eligible for trial:</span>
                    <span
                      className={`font-semibold ${
                        trialStatus.can_take_free_trial
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {trialStatus.can_take_free_trial ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Previous trial taken:</span>
                    <span
                      className={`font-semibold ${
                        trialStatus.has_taken_free_trial
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {trialStatus.has_taken_free_trial ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Features & CTA */}
          <div className="space-y-6">
            {/* Premium Features */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                What You'll Get
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Market Scanner
                    </h4>
                    <p className="text-sm text-gray-600">
                      Scan markets for stable currency pairs
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Market Analysis
                    </h4>
                    <p className="text-sm text-gray-600">
                      Detailed analysis of various markets
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Strategy Generator
                    </h4>
                    <p className="text-sm text-gray-600">
                      Generate trading strategies easily
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Signal Room Access
                    </h4>
                    <p className="text-sm text-gray-600">
                      VIP Signal Room for maximum profits
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Ready to Start?</h3>
              <p className="text-blue-100 mb-6">
                Activate your free trial now and experience the full power of
                our premium trading tools.
              </p>

              {trialStatus?.can_take_free_trial && !isNigeria && !countryLoading ? (
                <Button
                  text={loading ? "Activating..." : "Start Free Trial"}
                  onBtnClick={() => {
                    var checkoutdetails = {
                      plan: "istrial",
                      date: new Date().toDateString(),
                    };

                    localStorage.setItem(
                      "checkout",
                      JSON.stringify(checkoutdetails)
                    );
                    window.location.href = `${TrialMontlyPaymentLink}?prefilled_email=${authuser.mail}`;
                  }}
                  disabled={loading}
                  OverideStyle="w-full  text-white hover:scale-75"
                />
              ) : (
                <div className="text-center py-4">
                  <p className="text-orange-200 mb-3">
                    {isNigeria 
                      ? "Free trial via Stripe is not available in your region" 
                      : trialStatus?.has_taken_free_trial
                      ? "You've already used your free trial"
                      : "Free trial not available"}
                  </p>
                  <Button
                    text="Get Premium Access"
                    onBtnClick={() => navigate("/getpremium")}
                    OverideStyle="w-full  text-white hover: scale-75"
                  />
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="text-center text-sm text-gray-500">
              <p>
                By starting your free trial, you agree to our terms of service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTrial;
