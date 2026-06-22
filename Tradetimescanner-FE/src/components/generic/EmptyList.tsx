import { CiNoWaitingSign } from "react-icons/ci";
import { IoMdQrScanner } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Button from "../forms/Button";
import { useResponsive } from "../../hooks/useResponsive";

export default () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  return (
    <div className={`
      bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50
      flex justify-center flex-col items-center w-full
      shadow-xl shadow-blue-500/5
      ${isMobile ? 'py-10 px-6' : 'py-14 px-8'}
    `}>
      <div className={`text-center ${isMobile ? 'space-y-4' : 'space-y-5'}`}>
        <div className={`
          bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl
          flex items-center justify-center mx-auto
          ${isMobile ? 'p-4 w-16 h-16' : 'p-5 w-20 h-20'}
        `}>
          <CiNoWaitingSign
            size={isMobile ? 28 : 36}
            className="text-primary"
          />
        </div>

        <div>
          <h3 className={`
            font-bold text-gray-900 mb-2
            ${isMobile ? 'text-base' : 'text-lg'}
          `}>
            No Scans Found
          </h3>
          <p className={`
            text-gray-500 max-w-sm mx-auto leading-relaxed
            ${isMobile ? 'text-sm' : 'text-sm'}
          `}>
            You haven't saved any market scans yet. Start by creating your first
            scan to analyze trading opportunities.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <Button
            text={
              <>
                <IoMdQrScanner className="inline mr-2" />
                Start Scanning
              </>
            }
            onBtnClick={() => navigate("/scanner")}
            fullWidth={false}
          />
        </div>
      </div>
    </div>
  );
};
