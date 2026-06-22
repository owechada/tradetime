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

  return (
    <>
      {!user.id ? (
        <RiLoader2Fill size={40} className="inline animate-spin" />
      ) : (
        <div className="p-4 md:p-10 w-screen h-screen bg-customGray  flex flex-col md:grid md:grid-cols-2 items-center justify-center">
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

            <TfiClose
              className="m-4"
              onClick={() => {
                navigate(-1);
              }}
              size={30}
            />

            <p className="font-bold text-textbg text-[24px] ">
              Create New Password
            </p>
            <small className="font-light text-textbg text-xs ">
              Enter and confirm your new password below {user.username}
            </small>
            <div className=" my-4">
              <InputField
                name="password"
                title="New Password"
                placeholder="Enter Your New Password"
                control={control}
                rules={{
                  required: "Password is required",
                }}
                type={"password"}
              />

              <InputField
                name="conpassword"
                title="Confirm New Password"
                placeholder="Confirm Your New Password"
                control={control}
                rules={{
                  required: "Password is required",
                }}
                type={"password"}
              />

              {pass && (
                <div className=" p-3 m-2">
                  <p className="text-xs m-1">
                    {!(pass ? pass?.length < 6 : true) ? (
                      <FaCheck className="inline text-green-400" />
                    ) : (
                      <IoMdClose className=" text-red-500 inline" />
                    )}{" "}
                    6 characters minimum
                  </p>

                  <p className="text-xs m-1">
                    {!/\d/.test(pass) ? (
                      <IoMdClose className=" text-red-500 inline" />
                    ) : (
                      <FaCheck className="inline text-green-400" />
                    )}{" "}
                    Contains a number
                  </p>

                  <p className="text-xs m-1">
                    {!/[!@#$%^&*(),.?":{}|<>]/.test(pass) ? (
                      <IoMdClose className=" text-red-500 inline" />
                    ) : (
                      <FaCheck className="inline text-green-400" />
                    )}{" "}
                    Atleast one special character
                  </p>
                </div>
              )}
              {!(confpass == pass) && (
                <p className="text-xs text-center text-red-500">
                  {" "}
                  <IoMdClose className=" text-red-500 inline" /> Passwords don't
                  match
                </p>
              )}

              <Button
                disabled={!areFieldsFilled}
                text="Reset"
                onBtnClick={handleSubmit(onSubmit)}
              />
            </div>
          </div>
        </div>
      )}{" "}
    </>
  );
};

export { ResetPass };
