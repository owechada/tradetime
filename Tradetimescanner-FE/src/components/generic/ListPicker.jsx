import { Menu, Transition } from "@headlessui/react";
import React from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import { FaAngleDown, FaList, FaUserAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import usePremiumHook from "../../hooks/usePremiumHook";

const ListPicker = (props) => {
  var { pickedRole, setPickedRole } = props.hook;
  const [inputValue, setInputValue] = useState(pickedRole);
  const [isFocused, setIsFocused] = useState(false);
  const [isvis, setisvis] = useState(true);
  const [searchlist, setsearchedlist] = useState(props.list);
  const { hasaccess } = usePremiumHook();
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    setisvis(true);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);

    setsearchedlist((prev) =>
      props.list?.filter((ik) =>
        ik.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  useEffect(() => {
    setsearchedlist(props.list);
  }, [props.list]);
  useEffect(() => {
    setPickedRole(props.defaultvalue);
    // console.log(props.defaultvalue);
  }, [props.defaultvalue]);

  useEffect(() => {
    setInputValue(pickedRole?.name);
    setisvis(false);
  }, [pickedRole]);
  return (
    <div
      onClick={() => {
        setisvis((prev) => !prev);
      }}
      className={`relative my-2  max-w-[350px]    `}
    >
      <Menu open={true} as="div" className={`relative my-2  max-w-[350px]    `}>
        <div>
          {!props.notitle && (
            <p className=" mb-2 flex gap-1  ">
              Select {props.title} {props.tooltip}
            </p>
          )}

          <div className=" px-4 py-2  flex justify-between text-sm bg-white shadow border rounded-[8px] w-full  ">
            <input
              onChange={handleChange}
              value={inputValue}
              disabled={(!!props?.notsearchable)}
              onKeyDown={handleKeyDown}
              className=" listsearch py-1 text-sm focus:border-primary px-2 capitalize"
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={props.title}
              type="text"
            />
            <Menu.Button className="">
              <div className="flex flex-items items-center  w-full gap-4">


                <div className=" flex justify-between w-full  items-center p-1">
                  <FaAngleDown color="#777777" />
                </div>
                <div className="flex items-center"></div>
              </div>
            </Menu.Button>
          </div>
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
          <Menu.Items className="origin-top-left z-10 absolute left-0 mt-2 font-[500] rounded-sm shadow-md p-1 bg-white  max-h-[200px]  w-full overflow-x-hidden overflow-y-scroll ring-1 ring-black ring-opacity-5 focus:outline-none">
            {props.list?.map((item) => (
              <Menu.Item>
                {({ active }) => (
                  <p
                    onClick={() => {


                      if (props.notaction) {




                        if (
                          !props.labelExclude
                            ?.map((it) => it.toLowerCase())
                            .includes(item.code.toLowerCase())
                        ) {
                          if (hasaccess) {
                            setPickedRole(item);
                          } else {
                            props.notaction();
                          }
                        } else {
                          setPickedRole(item);
                        }
                      }

                      else {
                        setPickedRole(item);

                      }


                    }


                    }
                    className=" text-xs font-light w-full text-black p-3 m-2 flex justify-between items-center cursor-pointer truncate hover:bg-customGray "
                  >
                    {item.name}{" "}
                    {!props.labelExclude
                      ?.map((it) => it.toLowerCase())
                      .includes(item.code.toLowerCase())
                      ? props.label
                      : ""}
                  </p>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
      {(isFocused || isvis) && (
        <div className="origin-top-left z-10 absolute left-0 mt-2 font-[500] rounded-sm shadow-md p-1 bg-white  max-h-[200px]  w-full overflow-x-hidden overflow-y-scroll ring-1 ring-black ring-opacity-5 focus:outline-none">
          {searchlist?.map((ol) => (
            <div>
              <p
                onClick={() => {
                  setisvis(false);

                  if (props.notaction) {
                    if (!props.labelExclude
                      ?.map((it) => it.toLowerCase())
                      .includes(ol.code.toLowerCase())
                    ) {
                      if (hasaccess) {
                        setPickedRole(ol);
                      } else {
                        props.notaction();
                      }
                    } else {
                      setPickedRole(ol);
                    }
                  }
                  else {
                    setPickedRole(ol);
                  }


                }}
                className=" text-xs font-light w-full flex  justify-between items-center text-black p-3 m-2 cursor-pointer truncate hover:bg-customGray "
              >
                {ol.name}{" "}
                {!props.labelExclude
                  ?.map((it) => it.toLowerCase())
                  .includes(ol.code.toLowerCase())
                  ? props.label
                  : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { ListPicker };
