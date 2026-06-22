import { useNavigate } from "react-router-dom";
import { commingsoonimg } from "../../constants/imports";
import { Button } from "../../components/forms";
import { MdArrowBack } from "react-icons/md";

export default () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] p-6 md:p-10 flex flex-col justify-center items-center">
      <div className="max-w-md text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <span className="text-primary font-black uppercase tracking-widest text-[10px]">Coming Soon</span>
        </div>

        <h1 className="font-bold text-2xl text-gray-900">Available on Mobile App</h1>

        <img className="max-w-[240px] mx-auto" src={commingsoonimg} alt="Coming soon" />

        <p className="text-gray-500 text-sm leading-relaxed">
          This feature is only available on the mobile app which is launching soon!
        </p>

        <Button
          text={
            <>
              <MdArrowBack className="inline mr-2" />
              Go Back
            </>
          }
          onBtnClick={() => navigate(-1)}
          fullWidth={false}
        />
      </div>
    </div>
  );
};
