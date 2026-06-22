import { CiNoWaitingSign } from "react-icons/ci";
import { IoMdQrScanner } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Button from "../forms/Button";
import { useResponsive } from "../../hooks/useResponsive";

export default () => {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();

  return (
    <div className={`
      bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 
      flex justify-center flex-col items-center w-full shadow-lg
      ${isMobile ? 'h-[300px] mx-2' : 'h-[300px] mx-4'}
    `}>
      <div className={`text-center ${isMobile ? 'space-y-3 px-4' : 'space-y-4'}`}>
        <div className={`
          bg-gradient-to-r from-gray-100 to-blue-100 rounded-full 
          flex items-center justify-center mx-auto
          ${isMobile ? 'p-3 w-16 h-16' : 'p-4 w-20 h-20'}
        `}>
          <CiNoWaitingSign
            size={isMobile ? 32 : 40}
            className="text-primary"
          />
        </div>

        <div>
          <h3 className={`
            font-semibold text-gray-900 mb-2
            ${isMobile ? 'text-base' : 'text-lg'}
          `}>
            No Scans Found
          </h3>
          <p className={`
            text-gray-600 mb-6 max-w-md
            ${isMobile ? 'text-sm px-2' : 'text-base'}
          `}>
            You haven't saved any market scans yet. Start by creating your first
            scan to analyze trading opportunities.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            //  width={isMobile ? "full" : undefined}
            text={
              <>
                <IoMdQrScanner className="inline mr-2" />
                Start Scanning
              </>
            }
            onBtnClick={() => navigate("/scanner")}
          />
        </div>
      </div>
    </div>
  );
};
