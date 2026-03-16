import React from "react";
import { Plus } from "lucide-react";
import SearchInput from "../../reusableComponents/SearchInput";
import SelectDropdown from "../../reusableComponents/selectdropdown";
import MemberListCard from "./MemberListCard";
import { useNavigate } from "react-router-dom";
function Memberlist() {
  const navigate = useNavigate();
  return (
    <div className="p-5 min-h-screen">
      <header className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          <SearchInput />
        </div>
        <button
          onClick={() => navigate("addAdmin")}
          className="shadow-md h-10 px-4 flex justify-center items-center gap-1 text-white bg-sky-500 rounded-xl active:scale-95 transition-all text-sm font-bold"
        >
          <Plus size={18} /> Admin
        </button>
      </header>
      <div className="flex items-center justify-between mx-2">
        <div className="flex items-center gap-2">
          <span className="  text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
            Filter by:
          </span>
          <SelectDropdown
            name={"filter"}
            label={"Filter"}
            options={["All", "User", "Admin"]}
            className={"h-7  rounded-lg border-slate-200 text-sm"}
          />
        </div>

        <span className="text-[10px] font-bold text-slate-400">124 TOTAL</span>
      </div>
      <MemberListCard />
    </div>
  );
}

export default Memberlist;
