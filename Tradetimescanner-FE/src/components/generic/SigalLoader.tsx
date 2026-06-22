import { HiOutlineSignal } from "react-icons/hi2";

export const SignalLoader: React.FC<{ isloading: boolean }> = ({
  isloading,
}) => {
  if (!isloading) {
    return null;
  }
  return (
    <div className=" absolute top-0 left-0  w-screen h-screen z-[200] !bg-white/30 backdrop-blur-sm  gap-4 flex justify-center flex-col items-center">
      <HiOutlineSignal size={60} className="inline animate-spin text-primary" />
      <p className="text-gray-600">Analyzing</p>
    </div>
  );
};
