import { ReactElement, ReactEventHandler, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useStateSetter = () => {
  const dispather = useDispatch();

  const scandetails = useSelector((state: any) => state.scandetails);

  const setAuthuser = (payload: any) => {
    dispather({ type: "set-authuser", payload: payload });
  };
 
  const setLoading = (payload: boolean) => {
    dispather({ type: "set-loading", payload: payload });
  };
  const setNextAction = (payload: ReactEventHandler) => {
    dispather({ type: "set-nextaction", payload: payload });
  };
  const setPrevAction = (payload: ReactEventHandler) => {
    dispather({ type: "set-prevaction", payload: payload });
  };
  const setConfig = (payload: {}) => {
    dispather({ type: "set-config", payload: payload });
  };

  const setScandetails = (payload: {}) => {
    dispather({
      type: "set-scandetails",
      payload: { ...scandetails, ...payload },
    });
  };
  const setStrategyresult = (payload: any) => {
    
    dispather({
      type: "set-strategy",
      payload: payload ,
    });
  };
  const setScanresult = (payload: {}) => {
    dispather({
      type: "set-scanresult",
      payload:payload,
    });
  };

  return {
    setAuthuser,
    setPrevAction,
    setConfig,
    setScandetails,
    setScanresult,
    setNextAction,
    setLoading,
    setStrategyresult
  };
};

export { useStateSetter };
