import { useState } from "react";

export default () => {
  const [percentage, setpercentage] = useState<number>(20);
  return{ element :(
    <div
      onClick={() => {
        setpercentage((prev)=>prev+10);
      }}
      className={`border border-1 border-gray-300 rounded transition ease-in-out delay-150  duration-300  bg-lightPurple `}
    >
      <div  style={{width:`${percentage}%`}}  className={`h-1 rounded    bg-primary  `}></div>
    </div>
  ),setpercentage };
};
