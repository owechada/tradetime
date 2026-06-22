import { Link, useNavigate } from "react-router-dom";
import { Button, InputField } from "../../components/forms";
import { emailReg } from "../../utils/regex";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";

import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { logo, reg_doodle } from "../../constants/imports";
import { onLogin, onGoogleLogin } from "../../services/auth/auth";
import ReCAPTCHA from "react-google-recaptcha";
import { captchakey } from "../../utils/URL";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { handleSubmit, control, watch } = useForm();
  const { setLoading, setConfig } = useStateSetter();
  const [error, seterror] = useState("");
  const [captcha, setcaptcha] = useState<string | null>(null);
  const navigate = useNavigate();

  const { isTabletOrMobile } = useStateGetter();
  const { setAuthuser } = useStateSetter();

  const watchedFields = watch(["email", "password"]);

  const areFieldsFilled = watchedFields.every(
    (field) => field !== "" && field !== undefined
  );

  const onSubmit = async (data: any) => {
    setLoading(true);
    let formData = {
      mail: data.email,
      password: data.password,
    };
    try {
      let res = await onLogin(formData);
      if (res.user.checked != 0) {
        throw "User not verified, check your email to verify your account";
      }
      localStorage.setItem(`UserData`, JSON.stringify(res?.user));
      localStorage.setItem(`AuthToken`, res?.token);
      setAuthuser(res?.user);
      const config = {
        headers: {
          Authorization: `Bearer ${res?.token}`,
        },
      };
      setConfig(config);
      navigate(`/dashboard`);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      seterror(error);

      console.log(error);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    setLoading(true);
    seterror("");

    try {
      if (!credentialResponse.credential) {
        throw "No credential received from Google";
      }

      const res = await onGoogleLogin(credentialResponse.credential);

      // Store user data and token
      localStorage.setItem(`UserData`, JSON.stringify(res?.user));
      localStorage.setItem(`AuthToken`, res?.token);
      setAuthuser(res?.user);

      const config = {
        headers: {
          Authorization: `Bearer ${res?.token}`,
        },
      };
      setConfig(config);

      navigate(`/dashboard`);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      seterror(error || "Google login failed");
      console.log(error);
    }
  };

  return (
    <div className="md:p-2 w-screen min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 grid md:grid-cols-2 items-center justify-center">
      {/* Left side - Branding */}
      {!isTabletOrMobile && (
        <div className="p-10 flex flex-col gap-12 justify-center items-center">
          <img className="w-[240px]" src={logo} alt="TradeTime Scanner Logo" />
          <img className="w-[380px]" src={reg_doodle} alt="Illustration" />
        </div>
      )}

      {/* Right side - Login Form */}
      <div className="flex items-center justify-center md:px-8 h-screen md:h-full overflow-scroll md:overflow-hidden">
        <div
          className={`bg-white ${isTabletOrMobile ? "min-h-screen w-full" : "md:max-w-[480px] w-full rounded-3xl"
            } px-8 md:px-12 py-10 md:py-12 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-center`}
        >
          {/* Mobile Logo */}
          {isTabletOrMobile && (
            <div className="w-full flex flex-col justify-center items-center mb-8">
              <img className="w-[180px] mb-6" src={logo} alt="TradeTime Scanner Logo" />
              <img className="w-[140px]" src={reg_doodle} alt="Illustration" />
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-bold text-gray-900 text-[26px] md:text-[28px] leading-tight mb-2">
              Welcome back!
            </h1>
            <p className="text-gray-500 text-sm mb-4">
              Please log in to continue to your account.
            </p>
            <p className="text-sm text-gray-500">
              New here?{" "}
              <Link className="text-primary font-semibold hover:text-blue-700 transition-colors underline-offset-2 hover:underline" to="/signup">
                Create an account
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <MdErrorOutline className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-5">
            {/* Email Field */}
            <InputField
              name="email"
              title="Email Address"
              placeholder="Enter your email address"
              control={control}
              rules={{
                required: "Email Address is required",
                pattern: {
                  value: emailReg,
                  message: "Invalid Email Address",
                },
              }}
              fullWidth
            />

            {/* Password Field */}
            <InputField
              name="password"
              title="Password"
              placeholder="Enter your password"
              control={control}
              rules={{
                required: "Password is required",
              }}
              type="password"
              fullWidth
            />
            {/* Divider */}
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm font-medium">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            {/* Google Sign-In */}
            <div className="flex justify-center pb-2">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  seterror('Google Sign-In failed. Please try again.');
                }}
                theme="outline"
                size="large"
                text="continue_with"
                width="100%"
              />
            </div>
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                className="text-primary text-sm font-semibold hover:text-blue-700 transition-colors"
                to="/reset"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <div className="pt-4">
              <Button
                disabled={
                  captcha == null || 
                  !areFieldsFilled}
                text="Login"
                onBtnClick={handleSubmit(onSubmit)}
                fullWidth
              />
            </div>
            {/* ReCAPTCHA */}
            <div className="pt-2 flex justify-center">
              <ReCAPTCHA
                sitekey={captchakey}
                onChange={(val: any) => {
                  setcaptcha(val);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Login };
