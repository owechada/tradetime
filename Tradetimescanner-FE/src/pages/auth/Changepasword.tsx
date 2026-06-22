import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { reg_doodle, logo } from "../../constants/imports";
import { Button, InputField } from "../../components/forms";
import { emailReg, textReg } from "../../utils/regex";
import { useForm } from "react-hook-form";
import { TfiCheck, TfiClose } from "react-icons/tfi";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { toast } from "react-toastify";
import { SiMinutemailer } from "react-icons/si";
import { PulseLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { getuserById, onUpdateUser, onVerifyUser } from "../../services/user";
import PackageSelectionmodal from "../../components/generic/PackageSelectionmodal";
import { FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { RiLoader2Fill } from "react-icons/ri";
import { IoIosArrowRoundBack } from "react-icons/io";

const ResetPass = () => {
  const { handleSubmit, control, watch } = useForm();
  const { isTabletOrMobile } = useStateGetter();
  const navigate = useNavigate();
  const { setLoading, setAuthuser, setConfig } = useStateSetter();
  const wacthpasswordfild = watch(["password"]);
  const wacthconfpasswordfild = watch(["conpassword"]);
  const watchedFields = watch(["password", "conpassword"]);
  const [confpass, setconfpass] = useState("");
  const [pass, setpass] = useState("");
  const [user, setuser] = useState<any>({});
  const { id } = useParams();

  const getuser = async () => {
    setLoading(true);
    try {
      var res = await getuserById(id);
      setuser(res.user);

      if (!res.user) {
        toast.error("invalid URL");
        navigate("/");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getuser();
  }, []);

  useEffect(() => {
    setconfpass(wacthconfpasswordfild[0]);
  }, [wacthconfpasswordfild]);

  useEffect(() => {
    setpass(wacthpasswordfild[0]);
  }, [wacthpasswordfild]);

  const areFieldsFilled = watchedFields.every(
    (field) => field !== "" && field !== undefined
  );

  const onSubmit = async (data: any) => {
    var postdata = {
      data: { password: data.password },
    };
    console.log(postdata);
    setLoading(true);
    try {
      var response = await onUpdateUser(postdata, user.id);
      if (response.message) {
        toast("Password updated!");
      }

      if (response.success) {
        navigate("/");
      }
    } catch (e: any) {
      console.log(e);
      toast.error(e);
      setLoading(false);
    }
    setLoading(false);
  };

  if (!user.id) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <RiLoader2Fill size={40} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="md:p-2 w-screen min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 grid md:grid-cols-2 items-center justify-center">
      {!isTabletOrMobile && (
        <div className="p-10 flex flex-col gap-12 justify-center items-center">
          <img className="w-[240px]" src={logo} alt="TradeTime Scanner Logo" />
          <img className="w-[380px]" src={reg_doodle} alt="Illustration" />
        </div>
      )}

      <div className="flex items-center justify-center md:px-8 h-screen md:h-full overflow-scroll md:overflow-hidden">
        <div
          className={`bg-white ${isTabletOrMobile ? "min-h-screen w-full" : "md:max-w-[480px] w-full rounded-3xl"
            } px-8 md:px-12 py-10 md:py-12 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-center`}
        >
          {isTabletOrMobile && (
            <div className="w-full flex flex-col justify-center items-center mb-8">
              <img className="w-[180px] mb-6" src={logo} alt="TradeTime Scanner Logo" />
            </div>
          )}

          <button
            onClick={() => navigate(-1)}
            className="mb-6 p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors self-start"
          >
            <IoIosArrowRoundBack size={28} className="text-gray-600" />
          </button>

          <div className="mb-8">
            <h1 className="font-bold text-gray-900 text-[26px] md:text-[28px] leading-tight mb-2">
              Create New Password
            </h1>
            <p className="text-gray-500 text-sm">
              Enter and confirm your new password below, {user.username}
            </p>
          </div>

          <div className="space-y-4">
            <InputField
              name="password"
              title="New Password"
              placeholder="Enter your new password"
              control={control}
              fullWidth
              rules={{
                required: "Password is required",
              }}
              type={"password"}
            />

            <InputField
              name="conpassword"
              title="Confirm New Password"
              placeholder="Confirm your new password"
              control={control}
              fullWidth
              rules={{
                required: "Password is required",
              }}
              type={"password"}
            />

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

            {pass && confpass && !(confpass == pass) && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <IoMdClose className="text-red-500 flex-shrink-0" size={14} />
                <p className="text-xs text-red-700 font-medium">Passwords don't match</p>
              </div>
            )}

            <div className="pt-2">
              <Button
                disabled={!areFieldsFilled}
                text="Reset Password"
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

export { ResetPass };
