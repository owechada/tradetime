"use client";

import React, { Fragment, useEffect, useState } from "react";
import Searchbar from "./Searchbar";
import {} from "../../";
import { getallusers } from "../../services/user";
import { ispremuser } from "../../utils/functions";
import { IoMdMore } from "react-icons/io";
import { Transition } from "@headlessui/react";
import { table } from "console";
import { Menu } from "@headlessui/react";
import { FaUserCircle } from "react-icons/fa";
import { useStateGetter } from "../../hooks/statehooks/UseStateGettersHook";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { useForm } from "react-hook-form";
import { InputField } from "../forms";
const headers = [
  "Username",
  "Email",
  "Date joined",
  "Premium status",
  "Expiry",
  "Action",
];

export function UserDataTable({ data }: any) {
  const [users, setUsers] = useState([]);
  const { control, watch, setValue } = useForm();
  const { setLoading } = useStateSetter();
  const [from, setFrom] = useState("2020-01-01");
  const [to, setTo] = useState(new Date().toISOString().split("T")[0]);
  const [page, setpage] = useState(1);
  const [totalpage, settotalpage] = useState(0);


  const rowstyle = "px-3 py-4 whitespace-nowrap  text-gray-600";
  const getUsers = async () => {
    try {
      setLoading(true);
      var response = await getallusers(from, to, page);
      setUsers(response.data);
      setpage(response.pagination.currentPage)
      settotalpage(response.pagination.totalPages)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

 
  const filledswatch = watch(["from", "to"]);

  useEffect(() => {
    if (from !== filledswatch[0] || to !== filledswatch[1]) {
      filledswatch[0]&&  setFrom(filledswatch[0]);
      filledswatch[1] && setTo(filledswatch[1]);
      console.log(filledswatch);
    }
  }, [filledswatch]);
  useEffect(() => {
    getUsers();
  }, [from, to, page]);

  return (
    <div
      className="
  mx-10 h-screen overflow-y-scroll "
    >
      <p className="font-[700] text-gray-600 text-[28px] ">All users</p>
      <div className=" ">
        <p>Filter</p>
        <div className="flex gap-4 py-4 items-center justify-center,">
          <InputField
            name="from"
            title="From "
            placeholder={"From date"}
            type="date"
            control={control}
          />
          <InputField
            name="to"
            title="To "
            placeholder={"To date"}
            type="date"
            control={control}
          />
          <Searchbar
            style=" md:w-[500px] justify-self-center !font-semibold !border !text-gray-700 bg-white  mt-6 !border-gray-300 "
            placeholder="Search users"
            onChange={(value) => console.log(value)}
          />
          <h1 className="font-bold text-sm mt-6">Result {users.length} (max of 20 per page)</h1>
        </div>

      </div>

      <table className="w-full table-auto  ">
        <thead>
          <tr className="bg-gray-200 p-4">
            {headers.map((item: string, index) => (
              <th key={index}>
                <p className="  uppercase  font-semibold text-gray-700 p-2 text-start font">
                  {item}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users?.map((item: any, index: number) => (
            <tr
              className={`${index % 2 == 0 ? "bg-gray-300" : " bg-white"} `}
              key={index}
            >
              <td className={`${rowstyle}`}>{item.username}</td>
              <td className={`${rowstyle}`}>{item.mail}</td>
              <td className={`${rowstyle}`}>{`${new Date(
                item.createdAt
              ).toDateString()} - ${new Date(
                item.createdAt
              ).toLocaleTimeString()}`}</td>
              <td className={`${rowstyle}`}>
                {ispremuser(item) ? "Subscribed" : "Not subscribed"}
              </td>
              <td className={`${rowstyle}`}>{`    ${
                ispremuser(item)
                  ? Math.round(
                      (new Date(item.exp_date).getTime() -
                        new Date().getTime()) /
                        86400000
                    ) + "Days"
                  : ""
              }`}</td>
              <td className={`${rowstyle}`}>
                {
                  <Menu as="div" className="  self-center">
                    <div>
                      <Menu.Button className=" p-1 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
                        <IoMdMore className="inline" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-md p-1 bg-black ring-1 ring-black ring-opacity-5 py-2 z-[200] focus:outline-none">
                        <Menu.Item>
                          <p className="text-white font-bold">Delete user</p>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex bg-gray-300 rounded-sm w-1/5 p-3 uppercase place-self-end my-2 gap-3 justify-between">
<p>{page} of {totalpage}</p>
{ page >1 &&<button  className ={"bg-black p-2 text-white rounded-lg font-semibold"} onClick={()=>setpage(page-1)}>
  Previous
</button>}


{ (totalpage >1 && page!=totalpage )&&<button className ={"bg-black p-2 text-white rounded-lg font-semibold"} onClick={()=>setpage(page+1)}>
  Next
</button>}

      </div>
    </div>
  );
}
