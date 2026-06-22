import { useEffect, useState } from "react";
import { useStateGetter } from "./statehooks/UseStateGettersHook";
import { toast } from "react-toastify";
import { isSameDay } from "../utils/functions";

interface dailycredit {
  balance: number;
  date: string;
}
export default () => {
  const { authuser, isAdmin } = useStateGetter();
  const [hasaccess, sethasaccess] = useState(false);
  const [dailycredit, setdailycredit] = useState<dailycredit>({
    balance: 4,
    date: new Date().toDateString(),
  });

  useEffect(() => {
    console.log("dailycredit", dailycredit);
  }, [dailycredit]);
  useEffect(() => {
    var dailycredit_ = localStorage.getItem("dailycredit");
    var d = new Date().toDateString();
    if (!dailycredit_) {
      localStorage.setItem("dailycredit", `{"balance":4,"date":"${d}"}`);
      setdailycredit({ balance: 4, date: new Date().toDateString() });
      return;
    }
    var dailycredobj = JSON.parse(
      dailycredit_ ?? `{"balance":4,"date":"${d}"}`
    );

    if (isSameDay(new Date(dailycredobj.date), new Date())) {
      setdailycredit(dailycredobj);
    } else {
      setdailycredit({ balance: 4, date: new Date().toDateString() });
    }
  }, []);

  useEffect(() => {
    var today = new Date();

    var expirydate = new Date(authuser.exp_date);
    if (authuser.exp_date == "NULL" || authuser.subscription_id == "NULL") {
      sethasaccess(false);

      if (
        authuser.is_trial == "true" &&
        expirydate.getTime() >= today.getTime()
      ) {
        sethasaccess(true);
      }
    } else {
      if (expirydate.getTime() <= today.getTime()) {
        sethasaccess(false);
      } else {
        sethasaccess(true);
      }
    }

    if (isAdmin()) {
      sethasaccess(true);
    }
  }, [authuser]);

  return { hasaccess, setdailycredit, dailycredit, sethasaccess };
};
