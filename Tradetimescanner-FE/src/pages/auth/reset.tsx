import { Link, Navigate, useNavigate } from "react-router-dom"
import { reg_doodle, logo } from "../../constants/imports"
import { Button, InputField } from "../../components/forms"
import { emailReg, textReg } from "../../utils/regex"
import { useForm } from "react-hook-form"
import { TfiClose } from "react-icons/tfi";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook"
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook"
import { onResetpassword } from "../../services/auth/auth"
import { useState } from "react"
import { MdErrorOutline } from "react-icons/md"
import { IoIosArrowRoundBack } from "react-icons/io"


const Reset = () => {

  const { handleSubmit, control, watch } = useForm()
  const { isTabletOrMobile } = useStateGetter()
  const [error, seterror] = useState("");

  const watchedFields = watch(['mail']);
  const navigate = useNavigate()
  const { setLoading } = useStateSetter();
  const areFieldsFilled = watchedFields.every(field => (field !== '' && field !== undefined))

  const onSubmit = async (data: any) => {

    setLoading(true)

    try {
      var res = await onResetpassword({ ...data })
      seterror(res.message)
    }

    catch (e: any) {
      setLoading(false);
      seterror(e);
      console.log(e);
    }

    finally {
      setLoading(false)
    }
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
              Reset Password
            </h1>
            <p className="text-gray-500 text-sm">
              Enter your registered email address and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div className={`mb-6 p-4 ${error.includes("sent") ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border rounded-xl flex items-start gap-3`}>
              <MdErrorOutline className={`${error.includes("sent") ? "text-green-500" : "text-red-500"} flex-shrink-0 mt-0.5`} size={20} />
              <p className={`${error.includes("sent") ? "text-green-700" : "text-red-700"} text-sm font-medium`}>{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <InputField
              name="mail"
              title="Email Address"
              placeholder="Enter your email address"
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

            <div className="pt-2">
              <Button disabled={!areFieldsFilled} text="Send Reset Link" onBtnClick={handleSubmit(onSubmit)} fullWidth />
            </div>

            <p className="text-center text-sm text-gray-500">
              Remember your password?{" "}
              <Link className="text-primary font-semibold hover:text-blue-700 transition-colors" to="/login">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Reset }
