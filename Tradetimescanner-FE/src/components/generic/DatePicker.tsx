import { Menu, Transition } from "@headlessui/react";
import React from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import { FaAngleDown, FaList, FaUserAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { MdDateRange } from "react-icons/md";
import DatePicker from "react-datepicker";

const Datepicker = (props:any) => {
  var { pickedRole, setPickedRole } = props.hook;
  useEffect(() => {

  
    setPickedRole(props.defaultvalue);

    console.log(props.defaultvalue)
  }, []);

  return (
    <>
       <div className="my-4">
          <p className="text-xs mb-2 flex  items-center">{props.title}     {props.tooltip}</p>
          <div className=" px-4 py-1  flex text-sm bg-white w-full  rounded-[8px]  border-2 border-gray-200 items-center">
            <MdDateRange className="text-gray-400" size={30} />
 
            <DatePicker className="font-light" selected={pickedRole.code} onChange={(date:any) =>{
 
 setPickedRole({code:date, name:date?.toDateString() })
            }} />
          </div>
        </div>
    </>
  );
};

export { Datepicker };
