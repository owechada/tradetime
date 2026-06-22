import React, { FC } from "react";

interface SpinnerProps {
  loading: boolean;
}

const Spinner: FC<SpinnerProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[300] flex justify-center items-center bg-gray-900/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-[3px] border-gray-300/30" />
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary animate-spin" />
        </div>
        <p className="text-sm font-medium text-white/80">Loading...</p>
      </div>
    </div>
  );
};

export default Spinner;
