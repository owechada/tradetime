import { loadStripe } from "@stripe/stripe-js";
import { PackList } from "../../components/generic/PackageSelectionmodal";
import { logo } from "../../constants/imports";
import { onCreateCheckout } from "../../services/user";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { IoMdClose } from "react-icons/io";
import { Button } from "../../components/forms";
import { useNavigate } from "react-router-dom";

export default () => {
  const { authuser } = useStateGetter();
  const navigate = useNavigate();

  return (
    <div className=" p-3 bg-white px-10 flex justify-center items-center w-screen h-screen ">
      <div className="flex flex-col gap-4  md:w-[50vw]  w-full ">
        <p className="inline font-semibold ">
          {" "}
          <img onClick={() => {}} src={logo} className=" w-[180px] " />{" "}
          <IoMdClose size={30} className="inline text-red-500" />
          Payment Not Successful
        </p>

        <PackList paid={true} />

        <Button
          outlined={true}
          text="Go back"
          onBtnClick={() => {
            navigate("/");
          }}
        />
      </div>
    </div>
  );
};
