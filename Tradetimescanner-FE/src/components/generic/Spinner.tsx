import React, { FC } from "react";

interface SpinnerProps {
  loading: boolean;
}

const Spinner: FC<SpinnerProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[300] flex justify-center items-center bg-gray-900/40 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur-xl p-8 rounded-3xl">
        <div className="relative w-11 h-11">
          <div className="absolute inset-0 rounded-full border-[3px] border-white/10" />
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-white animate-spin" />
        </div>
        <p className="text-sm font-medium text-white/70 tracking-wide">Loading...</p>
      </div>
    </div>
  );
};

export default Spinner;
