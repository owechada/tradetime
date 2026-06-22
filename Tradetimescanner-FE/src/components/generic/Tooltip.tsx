import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { IoMdMore } from "react-icons/io";
import { IoIosInformationCircleOutline } from "react-icons/io";

interface TooltipDTO {
  title: string;
  content: string;
}

const Tooltip: React.FC<TooltipDTO> = ({ title, content }) => {
  return (
    <Menu as="div" className={`relative  inline `}>
      <Menu.Button className="   w-full        ">
        <IoIosInformationCircleOutline
          size={20}
          className="text-gray-500 inline "
        />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-left z-50 absolute rounded-lg p-2 right-0 left-0 mt-2 shadow-md bg-white   w-[200px]   ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            <div className=" p-3  ">
              <p className="font-semibold   my-3">{title}</p>
              <p className="font-light text-xs ">{content}</p>
            </div>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
export default Tooltip;
