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
    <div className="p-4 md:p-10 w-screen h-screen bg-customGray  flex flex-col md:grid md:grid-cols-2 items-center justify-center">
      {showpack && <PackageSelectionmodal show={setshowpack} />}

      {!isTabletOrMobile && (
        <div className="px-30 py-10 flex flex-col gap-10 justify-center items-center ">
          <img className="w-[173px] mb-4 " src={logo} />
          <img className="w-[330px]  " src={reg_doodle} />
        </div>
      )}
      <div className="bg-white  w-[100%] md:w-[458px] p-6  md:min-h-[80vh]  md:mx-20 md:py-2 md:px-20 shadow flex flex-col  justify-center  ">
        {isTabletOrMobile && (
          <img className="w-[173px] self-center my-12  " src={logo} />
        )}

        <TfiCheck
          className="m-4"
          onClick={() => {
            navigate(-1);
          }}
          size={30}
        />

        <p className="font-bold text-textbg text-[24px] ">Verify account</p>
        <small className="font-light text-textbg text-xs ">
          Verifying user ...{user?.username}
        </small>
        <div className=" my-4 flex justify-center items-center flex-col">
          <PulseLoader
            className=" m-12 justify-center"
            color={"#350080"}
            loading={isloading}
            size={18}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <Button
            disabled={isloading || !user}
            text="Get Started"
            onBtnClick={() => {
              setshowpack(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export { Verify };
