import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { Button } from "../forms";
import { MdClose } from "react-icons/md";

export default ({ show, item }: any) => {
  return (
    <>
      <div className=" absolute ModalContainer backdrop-blur-sm w-screen z-[10000]  h-screen shadow ">
        <div className=" flex flex-col h-[80vh] md:h-[80vh] overflow-y-scroll  rounded-[8px] bg-white  w-[90vw] md:w-[40vw] p-4 ">
          <div className="w-full flex justify-between">
            <p className="font-semibold self-start text-gray-700  flex gap-2 ">
          {  item?.market == "Strategy generator"?"Generated Strategy":"Scan Details"}
            </p>{" "}
            <MdClose
              onClick={() => {
                show(false);
              }}
              size={20}
            />
          </div>

          <div className="  grid grid-cols-3 gap-2 my-2 ">
         
          
       {item?.pairs?.map((pair: any) => (
              <span className="bg-blue-100 p-1 rounded m-1 font-light">
                {pair}
              </span>
            ))}
            {item?.items?.map((pair: any) => (
              <span className="bg-blue-100 p-1 rounded m-1 font-light">
                {" "}
                {pair}
              </span>
            ))}{" "}

           </div>

          <hr />
          <ul className="flex list-disc px-4 flex-col gap-3">
            {item?.details?.map((det: any) => (
              <li className="  p-1 rounded mx-1 font-light">
                <p>{det}</p>
              </li>
            ))}
          </ul>

          {item?.market == "Strategy generator" && (
            <div
              className="text-gray-500 max-h-[200px] "
              dangerouslySetInnerHTML={{
                __html: item?.content
                  .toString()
                  .replace(/\?/g, "")
                  .replace(/\*\*/g, "<br/>"),
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};
