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
import { getuserById, onVerifyUser } from "../../services/user";
import PackageSelectionmodal from "../../components/generic/PackageSelectionmodal";
import { FaCheck } from "react-icons/fa";

const Verify = () => {
  const { handleSubmit, control, watch } = useForm();
  const { isTabletOrMobile } = useStateGetter();
  const { id } = useParams();
  const watchedFields = watch(["email"]);
  const [isloading, setisloading] = useState(false);
  const [user, setuser] = useState<any>({});
  const navigate = useNavigate();
  const { setLoading, setAuthuser, setConfig } = useStateSetter();
  const [showpack, setshowpack] = useState(false);

  const getuser = async () => {
    setLoading(true);
    try {
      var res = await getuserById(id);
      setuser(res.user);

      if (res.user) {
        var response = await onVerifyUser(id);
        if (response.success) {
          toast.success(` User ${res.user.username} verified`);

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

  return (
    <div className="md:p-2 w-screen min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 grid md:grid-cols-2 items-center justify-center">
      {showpack && <PackageSelectionmodal show={setshowpack} />}

      {!isTabletOrMobile && (
        <div className="p-10 flex flex-col gap-12 justify-center items-center">
          <img className="w-[240px]" src={logo} alt="TradeTime Scanner Logo" />
          <img className="w-[380px]" src={reg_doodle} alt="Illustration" />
        </div>
      )}

      <div className="flex items-center justify-center md:px-8 h-screen md:h-full overflow-scroll md:overflow-hidden">
        <div
          className={`bg-white ${isTabletOrMobile ? "min-h-screen w-full" : "md:max-w-[480px] w-full rounded-3xl"
            } px-8 md:px-12 py-10 md:py-12 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-center items-center`}
        >
          {isTabletOrMobile && (
            <div className="w-full flex flex-col justify-center items-center mb-8">
              <img className="w-[180px] mb-6" src={logo} alt="TradeTime Scanner Logo" />
            </div>
          )}

          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6">
            <FaCheck className="text-green-500" size={28} />
          </div>

          <h1 className="font-bold text-gray-900 text-[26px] md:text-[28px] leading-tight mb-2 text-center">
            Verify Account
          </h1>
          <p className="text-gray-500 text-sm text-center mb-8">
            Verifying user{user?.username ? ` ${user.username}` : ""}...
          </p>

          <div className="w-full space-y-5">
            <div className="flex justify-center py-4">
              <PulseLoader
                color={"#636AE8"}
                loading={isloading}
                size={14}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
            <Button
              disabled={isloading || !user}
              text="Get Started"
              onBtnClick={() => {
                setshowpack(true);
              }}
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { Verify };
