import React from "react";

import { Ai_fistMessage } from "../reusableComponents/Typography/Cs";

function ChatMessage({ message, isSender, profile, timeCurrent }) {
  return (
    <div
      className={`flex px-5 py-2 gap-3 m-0 items-start ${isSender ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`w-8 h-8 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-slate-200 ${isSender ? "hidden" : ""}`}
      >
        <img
          src={profile}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      <div
        className={`max-w-[75%] p-4 rounded-2xl text-sm font-medium shadow-sm whitespace-pre-wrap break-words
            ${isSender ? "bg-sky-500 text-white self-end" : "bg-slate-100 text-slate-800"}
        `}
      >
        {message}
        <div
          className={`text-[10px] mt-1 opacity-70
            ${isSender ? "text-white text-right" : "text-slate-500 text-left"}
        `}
        >
          {timeCurrent}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
