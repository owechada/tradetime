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


 
const Reset=()=>{

const {handleSubmit, control, watch}=useForm()
const {isTabletOrMobile}=useStateGetter()
   const [error, seterror] = useState("");
 
const watchedFields = watch(['mail']);
const navigate=useNavigate()
 const { setLoading} = useStateSetter();
const areFieldsFilled = watchedFields.every(field => (field !== '' && field !==undefined))
 
    const onSubmit= async (data:any)=>{

setLoading(true)

      try{
var res=await onResetpassword({...data})
seterror(res.message)
      }

      catch(e:any){
        setLoading(false);
          seterror(e);
        console.log(e);

      }
   
      finally{

        setLoading(false)

      }

    }

 
    return(<div className="p-4 md:p-10 w-screen h-screen bg-customGray  flex flex-col md:grid md:grid-cols-2 items-center justify-center">
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

        <TfiClose className="m-4"
        
        onClick={()=>{

          navigate(-1)
        }}
        size={30}/>


            <p className="font-bold text-textbg text-[24px] ">Reset Password</p>
            <small className="font-light text-textbg text-xs ">Kindly provide your TradetimeScanner's registered email address</small>
         <div className=" my-4">
 
<InputField
                  name="mail"
                  title="Email"
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
        
          {/* <div className="w-full">
<Link className="text-primary" to='/'>
          Create an account </Link>
          </div> */}
              {error && (
                        <p className={`${error.includes("sent")? "text-green-500 ":"text-red-500 "} text-medium text-xs  mt-4 w-full text-center`}>
                          <MdErrorOutline className="inline " size={20} />
                          {error}
                        </p>
                      )}
           
          <Button disabled={!areFieldsFilled} text="Reset" onBtnClick={handleSubmit(onSubmit)} />
        </div>
      
        </div>
          </div>)
}

export{Reset}