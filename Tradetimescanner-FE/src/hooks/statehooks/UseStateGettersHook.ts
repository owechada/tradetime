import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";

const useStateGetter = () => {
  var isloading = useSelector((state: any) => state.isloading);
  var authuser = useSelector((state: any) => state.authuser);
  const config = useSelector((state: any) => state.config);
  const scandetails = useSelector((state: any) => state.scandetails);
  const NextStep = useSelector((state: any) => state.NextStep);
  const PrevStep = useSelector((state: any) => state.PrevStep);
  const scanresult = useSelector((state: any) => state.scanresult);
  const strategyres = useSelector((state: any) => state.strategyres);
  const ismobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [isTabletOrMobile, setisTabletOrMobile] = useState(ismobile);
 const isAdmin = (): boolean => {
    return authuser.is_admin === 1;
}

  useEffect(() => {
    setisTabletOrMobile(ismobile);
  }, [ismobile]);

  return {
    NextStep,
    isAdmin,
    isTabletOrMobile,
    strategyres,
    scanresult,
    PrevStep,
    isloading,
    config,
    authuser,
    scandetails,
  };
};
export { useStateGetter };
