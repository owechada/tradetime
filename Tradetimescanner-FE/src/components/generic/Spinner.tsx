import React, { FC } from "react";
interface SpinnerProps {
  loading: boolean;
}
const Spinner: FC<SpinnerProps> = ({ loading }) => {
  return (
    <>
      {loading && (
        <div className="loadingSpinnerContainer z-50">
          <div className="loadingSpinner flex justify-center items-center">
            {" "}
          </div>
        </div>
      )}
    </>
  );
};

export default Spinner;
