import { Fragment, useEffect, useState } from "react";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { PiClockFill } from "react-icons/pi";
import {
  CiCalendarDate,
  CiCircleInfo,
  CiEdit,
  CiViewTimeline,
} from "react-icons/ci";
import { Menu, Transition } from "@headlessui/react";
import { IoMdEye, IoMdMore } from "react-icons/io";
import { MdDelete, MdOpenInNew } from "react-icons/md";
import { useStateSetter } from "../../hooks/statehooks/UseStateSettersHook";
import { toast } from "react-toastify";
import { onDeleteSaveScan } from "../../services/user";
import { Button } from "../forms";
import ViewDetailsModal from "./ViewDetailsModal";
import { ScanItemDTO } from "../../utils/typings";


export default ({ item, refresh, setselectedscan, setshowmodal }: any) => {
  const { setLoading } = useStateSetter();
  const [jsonItem, setjsonItem] = useState<ScanItemDTO>();

  const deleteScan = async () => {
    setLoading(true);
    try {
      var res = await onDeleteSaveScan(item.id);
      toast.success("Deleted!");
      refresh();
    } catch (e: any) {
      console.log(e);
      toast.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    item.market != "Strategy generator" &&
      setjsonItem(JSON.parse(item.content ? item.content : "{}"));
  }, [item]);
  return (
    <>
      <div className="h-full overflow-y-hidden">
        <div className="rounded-xl relative shadow-lg bg-white/95 backdrop-blur-sm border border-gray-200 px-6 py-4 flex justify-between gap-4 hover:shadow-xl transition-all duration-300 group">
          {item.market != "Strategy generator" ? (
            <div className="flex flex-col overflow-x-hidden flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg">
                  <LiaExchangeAltSolid className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{item.market}</h3>
              </div>

              {jsonItem?.pairs && jsonItem.pairs.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-600 mb-2">Trading Pairs:</p>
                  <div className="flex flex-wrap gap-1">
                    {jsonItem.pairs.map((pair: any, index: number) => (
                      <span key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 px-2 py-1 rounded-md text-xs font-medium text-blue-700 border border-blue-200">
                        {pair}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {jsonItem?.items && jsonItem.items.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-600 mb-2">Items:</p>
                  <div className="flex flex-wrap gap-1">
                    {jsonItem.items.map((item: any, index: number) => (
                      <span key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 px-2 py-1 rounded-md text-xs font-medium text-green-700 border border-green-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2 mt-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CiViewTimeline className="text-primary" />
                  <span className="font-medium">
                    {jsonItem?.pairs?.length || 0} pairs, {jsonItem?.items?.length || 0} items
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CiCalendarDate className="text-primary" />
                  <span>{item?.date}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <PiClockFill className="text-primary" />
                  <span>{item?.starttime} - {item?.endtime} {item?.timezone}</span>
                </div>
              </div>

              {jsonItem?.details && jsonItem.details[0] && (
                <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                  <div className="flex items-start space-x-2">
                    <CiCircleInfo className="text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {jsonItem.details[0]}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col overflow-x-hidden flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <LiaExchangeAltSolid className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{item.market}</h3>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CiCalendarDate className="text-primary" />
                  <span>{item?.date}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <PiClockFill className="text-primary" />
                  <span>Timeframe: {item?.starttime} - Trade time: {item?.endtime}</span>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 max-h-[200px] overflow-y-auto">
                <div
                  className="text-gray-700 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: item.content
                      .toString()
                      .replace(/\?/g, "")
                      .replace(/\*\*/g, "<br/>"),
                  }}
                />
              </div>
            </div>
          )}

          <Menu as="div" className="flex-shrink-0">
            <Menu.Button className="p-2 rounded-lg hover:bg-gray-100 transition-colors group-hover:bg-gray-50">
              <IoMdMore size={20} className="text-gray-500 group-hover:text-gray-700" />
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
              <Menu.Items
                className="origin-top-right z-10 absolute right-0 mt-2 rounded-lg shadow-xl p-2 bg-white/95 backdrop-blur-sm w-48 border border-gray-200 focus:outline-none"
              >
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        setselectedscan(item);
                        setshowmodal(true)
                      }}
                      className={`${active ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : ''
                        } flex items-center space-x-3 w-full text-left p-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200`}
                    >
                      <MdOpenInNew className="text-blue-600" />
                      <span>View Details</span>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        deleteScan();
                      }}
                      className={`${active ? 'bg-gradient-to-r from-red-50 to-pink-50' : ''
                        } flex items-center space-x-3 w-full text-left p-3 rounded-lg text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200`}
                    >
                      <MdDelete className="text-red-600" />
                      <span>Delete</span>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </>
  );
};
