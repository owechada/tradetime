import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { Button } from "../forms";
import { MdClose, MdInsights } from "react-icons/md";

export default ({ show, item }: any) => {
  return (
    <>
      <div className="fixed inset-0 z-[200] flex justify-center items-center bg-black/40 backdrop-blur-sm">
        <div className="flex flex-col max-h-[85vh] rounded-2xl bg-white w-[92vw] md:w-[500px] shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg">
                <MdInsights className="text-white" size={16} />
              </div>
              <h2 className="font-bold text-gray-900 text-lg">
                {item?.market == "Strategy generator" ? "Generated Strategy" : "Scan Details"}
              </h2>
            </div>
            <button
              onClick={() => show(false)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <MdClose size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Tags */}
            {((item?.pairs && item.pairs.length > 0) || (item?.items && item.items.length > 0)) && (
              <div className="flex flex-wrap gap-2">
                {item?.pairs?.map((pair: any, i: number) => (
                  <span key={`pair-${i}`} className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 border border-blue-200">
                    {pair}
                  </span>
                ))}
                {item?.items?.map((it: any, i: number) => (
                  <span key={`item-${i}`} className="bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 border border-emerald-200">
                    {it}
                  </span>
                ))}
              </div>
            )}

            {/* Details */}
            {item?.details && item.details.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Analysis Details</p>
                <div className="space-y-2">
                  {item?.details?.map((det: any, i: number) => (
                    <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700 leading-relaxed">{det}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategy Content */}
            {item?.market == "Strategy generator" && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div
                  className="text-sm text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: item?.content
                      .toString()
                      .replace(/\?/g, "")
                      .replace(/\*\*/g, "<br/>"),
                  }}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <Button
              outlined
              text="Close"
              onBtnClick={() => show(false)}
              fullWidth
            />
          </div>
        </div>
      </div>
    </>
  );
};
