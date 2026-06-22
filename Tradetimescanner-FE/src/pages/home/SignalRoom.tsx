import { useEffect, useState } from "react";
import Progressbar from "../../components/forms/Progressbar";

import { LiaExchangeAltSolid } from "react-icons/lia";
import { GiRadarSweep } from "react-icons/gi";
import { PiClockFill } from "react-icons/pi";
import PackageSelectionmodal from "../../components/generic/PackageSelectionmodal";
import usePremiumHook from "../../hooks/usePremiumHook";
import { useNavigate } from "react-router-dom";

export default () => {
  const [postdata, setpostdata] = useState({});
  const { element, setpercentage } = Progressbar();
  const [mainActive, setmainActive] = useState<number>(1);
  const navigate = useNavigate();
  const { hasaccess } = usePremiumHook();
  useEffect(() => {
    setpercentage((mainActive / 3) * 100);
  }, [mainActive]);




  return (
    <div className="h-screen flex justify-center items-start w-full overflow-x-hidden overflow-y-scroll  ">
      {!hasaccess && (
        <PackageSelectionmodal
          show={(state: boolean) => {
            navigate("/dashboard");
          }}
        />
      )}

      <iframe
        className="h-[90vh] w-full"
        src="https://www.chatbro.com/en/4936s/"
        width={"100%"}
        height={"100%"}
      />
    </div>
  );
};
