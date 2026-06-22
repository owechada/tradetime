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
    <div className="ModalContainer  flex justify-center items-center w-full  shadow ">
      <div className=" flex flex-col justify-center items-center md:w-[40%] bg-white rounded-lg">
        <p className=" font-medium text-textbg  my-2">
          <FaCheck className="text-green-400 inline " /> Welcome aboard
        </p>
        <p className=" font-sm text-textbg  my-2">
          <FaMailBulk className="text-green-400 inline " /> Email Verification
          required
        </p>

        <p className="font-light text-textbg  text-xs text-center">
          Your account needs to be verified, we have sent you an email to that
          effect. Note: Check email inbox and spam folders for your verification
          link
        </p>
        <div className=" gap-6 w-full flex justify-center ">
          <Button
            outlined
            width={200}
            disabled={false}
            text="Ok"
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
    <div className="md:p-4 w-screen h-screen md:h-[80vh] bg-customGray  flex flex-col md:grid md:grid-cols-2 items-center justify-center">
      {showloginmodal && <LoginAlertAction show={setshowloginmodal} />}
      {!isTabletOrMobile && (
        <div className="px-30 py-10 flex flex-col gap-10 justify-center items-center ">
          <img className="w-[173px] mb-4 " src={logo} />
          <img className="w-[330px]  " src={reg_doodle} />
        </div>
      )}
      <div className="bg-white  w-[100%] md:w-[458px] p-6   overflow-y-scroll h-screen pb-14 overflow-x-hidden  md:mx-20 md:py-4 md:px-20 shadow flex flex-col  ">
        {isTabletOrMobile && (
          <div className="w-full flex flex-col justify-center items-center mb-4 ">
            <img className="w-[173px] self-center my-12  " src={logo} />
            <img className="w-[130px]  " src={reg_doodle} />
          </div>
        )}

        <p className="font-bold text-textbg text-[27px] md:text-[24px]">
          Create Account
        </p>
        <small className="font-medium text-textbg text-sm md:text-xs">
          Already have an account?{" "}
          <Link className="text-primary" to="/">
            Login{" "}
          </Link>
        </small>

        <div className=" my-2">
          <InputField
            name="firstname"
            title="First name"
            placeholder="First name"
            control={control}
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
            rules={{
              required: "Last name is required",
              pattern: {
                value: textReg,
                message: "Invalid name",
              },
            }}
          />
          {/* <InputField
            name="phone"
            title="Phone number"
            placeholder="Enter phone number"
            control={control}
            rules={{
              required: "Phone number is required",
              pattern: {
                value: numReg,
                message: "Invalid phone number",
              },
            }}
          /> */}
          <InputField
            name="email"
            title="Email Address"
            placeholder="Enter Email Address"
            control={control}
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
            placeholder="Enter Your Password"
            control={control}
            rules={{
              required: "Password is required",
            }}
            type={"password"}
          />
          <InputField
            name="conpassword"
            title="Confirm Password"
            placeholder="Confirm Your Password"
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
          <ReCAPTCHA
            sitekey={captchakey}
            onChange={(val: any) => {
              setcaptcha(val);
            }}
          />

          <div className=" w-full flex justify-start items-start gap-2 my-4">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-[2px] w-4 h-4 cursor-pointer accent-primary shrink-0"
            />
            <label htmlFor="terms" className="text-textbg font-light text-sm md:text-sm text-left cursor-pointer">
              I accept the{" "}
              <Link className="text-primary font-medium hover:underline" to="/terms-conditions" target="_blank" rel="noopener noreferrer">
                Terms of use & Privacy policy
              </Link>{" "}
              and agree to receive email promotions.
            </label>
          </div>

          <Button
            disabled={
               captcha == null ||
              !areFieldsFilled ||
              !acceptedTerms
            }
            text="Create"
            onBtnClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </div>
  );
};

export { RegisterAccount };
