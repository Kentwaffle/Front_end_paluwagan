import React from "react";
import { ShieldAlert, ArrowRight, X } from "lucide-react";
import Inputform from "../../reusableComponents/Forms/Inputform";

function OffsetForm({
  isOpen,
  onClose,
  activeContent,
  offsetData,
  handleOffsetChange,
  offsetErrors,
  agreeOffset,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800/80 overflow-hidden p-5">
        <div className="flex flex-col mt-3 gap-3">
          <div className="flex flex-col text-sm bg-sky-50 border shadow-sm border-sky-200 p-3 rounded-xl dark:bg-sky-900 dark:border-sky-700">
            <div className="flex items-center justify-center gap-1">
              <span className="p-1 bg-amber-50 text-amber-500 rounded-full">
                <ShieldAlert />
              </span>
              <h1 className="font-bold text-lg italic text-center">
                {activeContent?.title}
              </h1>
            </div>
            <span className="italic mt-2 text-slate-600 dark:text-slate-200 text-center">
              {activeContent?.description}
            </span>
            <span className="italic mt-2 text-slate-600 dark:text-slate-200 text-center">
              {activeContent?.instruction}
            </span>
            <Inputform
              name="agreementText"
              value={offsetData.agreementText}
              onChange={handleOffsetChange}
              placeholder="Type I AGREE"
              className={`${offsetErrors.agreementText ? "border border-red-400" : "border border-sky-100"} bg-slate-50 text-center mt-2 font-bold uppercase dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200`}
            />
            {offsetErrors.agreementText && (
              <span className="text-red-500 text-center text-xs mt-1">
                {offsetErrors.agreementText}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-red-100 dark:border-red-800/50 text-red-600 dark:text-red-400 font-bold text-sm hover:bg-red-200 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={agreeOffset}
              type="button"
              className="bg-gradient-to-r flex-1 from-sky-400 to-sky-600 py-3 text-white rounded-xl shadow flex items-center justify-center gap-2"
            >
              <span>Offset</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OffsetForm;
