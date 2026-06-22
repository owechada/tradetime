import React, { ReactEventHandler } from "react";
import { Button } from "../forms";
import {
  MdOutlineNavigateBefore,
  MdOutlineNavigateNext,
  MdScanner,
} from "react-icons/md";
import { IoMdQrScanner } from "react-icons/io";

interface NavigateBTNsProps {
  actionNext: ReactEventHandler;
  actionPrev: ReactEventHandler;
  nextCondition: boolean;
  shownext?: boolean;
  islast?: boolean;
  actionText?: string;
  showprev?: boolean;
}
const NavigateBtns: React.FC<NavigateBTNsProps> = ({
  actionNext,
  islast,
  actionPrev,
  nextCondition,
  shownext,
  actionText,
  showprev,
}) => {
  return (
    <div className="w-full flex justify-center items-center bg-transparent my-4">
      <div className="w-full px-4 flex justify-center items-center gap-3 md:gap-6">
        {showprev && (
          <Button
            width={400}
            outlined
            text={
              <span className="flex items-center gap-1">
                <MdOutlineNavigateBefore /> Previous
              </span>
            }
            onBtnClick={actionPrev}
          />
        )}

        {shownext && (
          <Button
            width={400}
            disabled={!nextCondition}
            text={
              actionText ? (
                actionText
              ) : !islast ? (
                <span className="flex items-center gap-1">
                  <MdOutlineNavigateNext /> Next
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  {" "}
                  <IoMdQrScanner /> Scan{" "}
                </span>
              )
            }
            onBtnClick={actionNext}
          />
        )}
      </div>
    </div>
  );
};

export { NavigateBtns };
