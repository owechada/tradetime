import { useState } from "react";

export default () => {
  const [percentage, setpercentage] = useState<number>(20);
  return{ element :(
    <div
      className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden"
    >
      <div
        style={{ width: `${percentage}%` }}
        className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-500 ease-out"
      />
      <div
        style={{ width: `${percentage}%` }}
        className="absolute top-0 left-0 h-full rounded-full bg-white/30 animate-pulse"
      />
    </div>
  ),setpercentage };
};
