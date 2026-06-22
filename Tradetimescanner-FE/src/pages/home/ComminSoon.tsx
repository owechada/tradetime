import { useNavigate } from "react-router-dom";
import { commingsoonimg } from "../../constants/imports";
import { Button } from "../../components/forms";
import { MdArrowBack } from "react-icons/md";

export default () => {
  const navigate = useNavigate();

  return (
    <div className=" p-4 md:p-10 h-full flex-col px-6  overflow-x-hidden overflow-y-hidden  md:pt-1  w-full flex justify-center items-center  ">

      <h1 className="font-bold text-xl text-primary text-center">Coming soon on the mobile app</h1>


      <img className="animate-pulse" src={commingsoonimg} />
      <p className="text-blue-500 font-light text-lg text-center mb-8">This particular feature is only available on the mobile app which is launching soon! </p>

      <Button
        text={
          <>
            <MdArrowBack className="inline mr-2" />
            Go Back
          </>
        }
        onBtnClick={() => navigate(-1)}
        width={160}
      />
    </div>
  );
};
