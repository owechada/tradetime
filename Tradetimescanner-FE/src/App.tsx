import React, { useState } from "react";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./output.css";
import { ToastContainer, toast } from "react-toastify";
import "./App.css";
import AuthRoutes from "./routes/AuthRoutes";
import Spinner from "./components/generic/Spinner";
import { useStateGetter } from "./hooks/statehooks/UseStateGettersHook";
function App() {
  const { isloading } = useStateGetter();

  return (
    <div className="overflow-y-hidden overflow-x-hidden w-screen h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Spinner loading={isloading} />
      <AuthRoutes />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
