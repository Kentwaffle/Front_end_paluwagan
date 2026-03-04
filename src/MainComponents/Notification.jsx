import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
function Notification() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen ">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold ">Notifications</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sky-500"
        >
          <ChevronLeft size={24} />
          Return
        </button>
      </div>
      {/* // Sample notification card */}
      <button
        type="button"
        className="bg-white text-start w-full p-4 rounded-2xl shadow-sm dark:bg-slate-800 dark:text-slate-20 active:scale-95 transition-all"
      >
        <label className="block font-black text-sm text-gray-700 dark:text-slate-300 mb-1">
          Sample Notification
        </label>
        <span className="block font-medium text-xs text-gray-700 dark:text-slate-300">
          This is a sample notification message.
        </span>
      </button>

      <div
        className="fixed bottom-0 left-0 right-0  border-t  
       border-slate-200 p-2 px-5 dark:border-slate-700  dark:bg-slate-800"
      >
        <div className="flex gap-3">
          <button className="flex-1 w-full py-3 px-4 text-xs font-bold text-red-400 dark:text-red-500">
            Clear all
          </button>
          <button className="flex-2 w-full py-2 px-4 text-white bg-sky-500 rounded-xl font-bold text-xs shadow-lg shadow-sky-100 dark:shadow-none transition-all active:scale-95">
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notification;
