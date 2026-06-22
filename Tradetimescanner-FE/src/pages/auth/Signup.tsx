import { Link, useNavigate } from "react-router-dom";
import { reg_doodle, logo } from "../../constants/imports";
import { Button, InputField } from "../../components/forms";
import { emailReg, numReg, textReg } from "../../utils/regex";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { IoMdClose } from "react-icons/io";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { FaCheck, FaInfo, FaMailBulk } from "react-icons/fa";
import { toast } from "react-toastify";
import { onCreateUser } from "../../services/user";
import ReCAPTCHA from "react-google-recaptcha";
import { captchakey } from "../../utils/URL";

const RegisterAccount = () => {
  const { handleSubmit, control, watch } = useForm();
  const { isTabletOrMobile } = useStateGetter();
  const navigate = useNavigate();
  const [confpass, setconfpass] = useState("");
  const [pass, setpass] = useState("");
  const watchedemail = watch(["email"]);
  const [showloginmodal, setshowloginmodal] = useState(false);

  const watchedFields = watch([
    "firstname",
    "lastname",

    "email",
    "password",
    "conpassword",
  ]);

  const LoginAlertAction = ({ show }: any) => (
    <div className="fixed inset-0 z-[200] flex justify-center items-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col justify-center items-center w-[90vw] md:w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-2">
          <FaCheck className="text-green-500" size={28} />
        </div>
        <h2 className="font-bold text-gray-900 text-xl text-center">
          Welcome aboard!
        </h2>
        <div className="flex items-center gap-2 text-primary">
          <FaMailBulk size={16} />
          <p className="font-semibold text-sm">Email Verification Required</p>
        </div>
        <p className="text-gray-600 text-sm text-center leading-relaxed">
          Your account needs to be verified. We've sent you a verification email.
          Please check both your inbox and spam folders.
        </p>
        <div className="w-full pt-2">
          <Button
            outlined
            disabled={false}
            text="Continue to Login"
            fullWidth
            onBtnClick={() => {
              navigate("/login");
              show(false);
            }}
          />
        </div>
      </div>
    </div>
  );

  const { setLoading } = useStateSetter();
  const wacthpasswordfild = watch(["password"]);
  const wacthconfpasswordfild = watch(["conpassword"]);
  const [captcha, setcaptcha] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const isvalidpassword = wacthpasswordfild.every(
    (pass) =>
      !(pass?.length < 6) &&
      /\d/.test(pass) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(pass)
  );
  const areFieldsFilled = watchedFields.every(
    (field) =>
      field !== "" && field !== undefined && isvalidpassword && confpass == pass
  );

  useEffect(() => {
    setconfpass(wacthconfpasswordfild[0]);
  }, [wacthconfpasswordfild]);

  useEffect(() => {
    setpass(wacthpasswordfild[0]);
  }, [wacthpasswordfild]);

  const onchange = () => {
    console.log(areFieldsFilled);
  };
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const postdata = {
        username: `${data.firstname} ${data.lastname}`,

        mail: data.email,

        password: data.password,
      };

      const responsse = await onCreateUser(postdata);
      setshowloginmodal(true);



      console.log(responsse);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      toast.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="md:p-2 w-screen min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 grid md:grid-cols-2 items-center justify-center">
      {showloginmodal && <LoginAlertAction show={setshowloginmodal} />}

      {/* Left side - Branding */}
      {!isTabletOrMobile && (
        <div className="p-10 flex flex-col gap-12 justify-center items-center">
          <img className="w-[240px]" src={logo} alt="TradeTime Scanner Logo" />
          <img className="w-[380px]" src={reg_doodle} alt="Illustration" />
        </div>
      )}

      {/* Right side - Signup Form */}
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
              Create Account
            </h1>
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link className="text-primary font-semibold hover:text-blue-700 transition-colors underline-offset-2 hover:underline" to="/">
                Login
              </Link>
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                name="firstname"
                title="First name"
                placeholder="First name"
                control={control}
                fullWidth
                rules={{
                  required: "First name is required",
                  pattern: {
                    value: textReg,
                    message: "Invalid name",
                  },
                }}
              />
              <InputField
                name="lastname"
                title="Last name"
                placeholder="Last name"
                control={control}
                fullWidth
                rules={{
                  required: "Last name is required",
                  pattern: {
                    value: textReg,
                    message: "Invalid name",
                  },
                }}
              />
            </div>

            <InputField
              name="email"
              title="Email Address"
              placeholder="Enter email address"
              control={control}
              fullWidth
              rules={{
                required: "Email Address is required",
                pattern: {
                  value: emailReg,
                  message: "Invalid Email Address",
                },
              }}
            />
            <InputField
              name="password"
              title="Password"
              placeholder="Enter your password"
              control={control}
              fullWidth
              rules={{
                required: "Password is required",
              }}
              type={"password"}
            />
            <InputField
              name="conpassword"
              title="Confirm Password"
              placeholder="Confirm your password"
              control={control}
              fullWidth
              rules={{
                required: "Password is required",
              }}
              type={"password"}
            />

            {/* Password Requirements */}
            {pass && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <p className="text-xs font-medium text-gray-500 mb-2">Password requirements:</p>
                <div className="flex items-center gap-2 text-xs">
                  {!(pass ? pass?.length < 6 : true) ? (
                    <FaCheck className="text-green-500 flex-shrink-0" size={12} />
                  ) : (
                    <IoMdClose className="text-red-500 flex-shrink-0" size={12} />
                  )}
                  <span className={`${!(pass ? pass?.length < 6 : true) ? "text-green-700" : "text-gray-600"}`}>
                    6 characters minimum
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {/\d/.test(pass) ? (
                    <FaCheck className="text-green-500 flex-shrink-0" size={12} />
                  ) : (
                    <IoMdClose className="text-red-500 flex-shrink-0" size={12} />
                  )}
                  <span className={`${/\d/.test(pass) ? "text-green-700" : "text-gray-600"}`}>
                    Contains a number
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {/[!@#$%^&*(),.?":{}|<>]/.test(pass) ? (
                    <FaCheck className="text-green-500 flex-shrink-0" size={12} />
                  ) : (
                    <IoMdClose className="text-red-500 flex-shrink-0" size={12} />
                  )}
                  <span className={`${/[!@#$%^&*(),.?":{}|<>]/.test(pass) ? "text-green-700" : "text-gray-600"}`}>
                    At least one special character
                  </span>
                </div>
              </div>
            )}

            {/* Password Mismatch */}
            {pass && confpass && !(confpass == pass) && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <IoMdClose className="text-red-500 flex-shrink-0" size={14} />
                <p className="text-xs text-red-700 font-medium">Passwords don't match</p>
              </div>
            )}

            {/* Terms Checkbox */}
            <div className="w-full flex justify-start items-start gap-3 py-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-[2px] w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2 cursor-pointer shrink-0"
              />
              <label htmlFor="terms" className="text-gray-700 text-sm text-left cursor-pointer leading-relaxed">
                I accept the{" "}
                <Link className="text-primary font-semibold hover:text-blue-700 transition-colors" to="/terms-conditions" target="_blank" rel="noopener noreferrer">
                  Terms of use & Privacy policy
                </Link>{" "}
                and agree to receive email promotions.
              </label>
            </div>

            {/* ReCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey={captchakey}
                onChange={(val: any) => {
                  setcaptcha(val);
                }}
              />
            </div>

            {/* Create Button */}
            <div className="pt-2">
              <Button
                disabled={
                  captcha == null ||
                  !areFieldsFilled ||
                  !acceptedTerms
                }
                text="Create Account"
                onBtnClick={handleSubmit(onSubmit)}
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RegisterAccount };
