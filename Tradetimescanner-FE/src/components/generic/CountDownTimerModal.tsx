 
import { toast } from "react-toastify";
import { Button } from "../forms";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
import useSound from "use-sound";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { onSaveScan } from "../../services/user";

export default ({ time, scanresult,scandetails, show }: any) => {
  const navigate = useNavigate();
  const [play] = useSound("/beepsound.mp3");
  const {setLoading} =useStateSetter()
  const {   authuser } = useStateGetter();
  const SaveScan = async () => {
    let postddata = {
      market: scandetails.market,
      date: new Date().toDateString(),
      timezone: scandetails.timezone,
      starttime: scandetails.starttime,
      endtime: scandetails.endtime,
      content: JSON.stringify(scanresult),
      userid: authuser.id,
    };
    setLoading(true);

    try {
      var res = await onSaveScan(postddata);
      toast.success("Saved for later");

     
    } catch (e: any) {
      console.log(e);
      toast.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="ModalContainer shadow ">
        <div className=" flex flex-col  max-h-[80vh] overflow-y-scroll  rounded-[8px] bg-white w-[90vw] md:w-[40vw] p-4 ">
          <p className="font-semibold self-start text-sm ">
            Tading Time Countdown
          </p>

          <div className="flex flex-col ">
            <div className="grid grid-cols-2">
              {scanresult?.items
                ?.sort(() => Math.random() - 0.5)
                .map((mn: any) => (
                  <li className=" font-light text-md">{mn}</li>
                ))}
            </div>

            <p className="text-2xl font-semibold  text-gray-600 w-full flex justify-center items-center ">
              <Countdown
                onComplete={() => {
                  play();
                }}
                date={Date.now() + time}
              />
            </p>
          </div>
          <div className=" flex justify-center items-center w-full gap-6">
            <Button
              outlined
              text="Close"
              onBtnClick={() => {
                navigate("/");
                show(false);
              }}
            />
            <Button
              outlined
              text="Save for later"
              onBtnClick={async () => {
               
              await   SaveScan()
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
