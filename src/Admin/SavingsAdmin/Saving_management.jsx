// import { useState } from "react";
// import { useFetchData } from "../serviceToApi/fetchData";
// import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
// import { usePutData } from "../serviceToApi/PutData";
// import { showAlert } from "../reusableComponents/Alerts/SweetAlerts";
// import { useLoanSSE } from "../reusableComponents/Hooks/SSE";
// import CardStatus from "./CardStatus";
// import { Search } from "lucide-react";
// import { swalModal } from "../reusableComponents/Alerts/SweetAlerts";
import {
  PhilippinePeso,
  ArrowRight,
  Eye,
  EyeClosed,
  ChevronRight,
  ShieldAlert,
  CircleAlert,
} from "lucide-react";
import { usePasswordToggle } from "../../reusableComponents/Hooks/ToggleEye";
import { formatCurrency } from "../../reusableComponents/formatter";
import SearchInput from "../../reusableComponents/SearchInput";
import Default_pic from "../../assets/images/default_pic.jpg";

function Saving_management() {
  const { show, toggle } = usePasswordToggle();

  const ApiTO = 100;
  const overAllTotalSavings = formatCurrency(ApiTO || 0);
  const displaySavingsOverall = show
    ? overAllTotalSavings
    : overAllTotalSavings.replace(/[^₱\s]/g, "•");

  return (
    <div className="min-h-screen p-5">
      <div className="p-5 bg-white shadow-sm rounded-xl">
        <div className="flex justify-between items-start">
          <div className="flex flex-col ">
            <span className="text-sm text-slate-500 font-semibold">
              Over all savings
            </span>
            <span className="text-4xl font-extrabold">
              {displaySavingsOverall}
            </span>
          </div>
          <button
            onClick={toggle}
            type="button"
            className="text-slate-400 transition-colors"
          >
            {show ? <Eye size={25} /> : <EyeClosed size={25} />}
          </button>
        </div>
        <div className="border-t border-t-slate-200 mt-5 py-2">
          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">Total Members</span>
            <span className="text-sm font-semibold ">100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">Total Pending</span>
            <span className="text-sm font-semibold text-amber-500">100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">Total Approved</span>
            <span className="text-sm font-semibold text-emerald-600">100</span>
          </div>
        </div>
      </div>
      <div className="my-4 mx-2 flex justify-between">
        <label className="text-slate-800  font-semibold">Savings Members</label>
        <label className="text-sky-500">See all</label>
        {/* <SearchInput className="!rounded-full" /> */}
      </div>
      <button className="bg-white w-full pl-5 rounded-2xl shadow-sm cursor-pointer">
        <div className="flex w-full justify-between items-stretch">
          <div className="flex items-center flex-1 gap-3 justify-between py-2 ">
            <div className="flex items-center gap-2">
              <div className="w-9">
                <img
                  alt="Profile picture"
                  src={Default_pic}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col items-start min-w-0">
                <div className="flex flex-wrap gap-1 truncate w-full">
                  <div className="text-slate-800">Rams</div>
                  <div className="text-slate-800">Apelyedo</div>
                </div>
                <div className="text-xs text-slate-400">ID:10000000000</div>
              </div>
            </div>

            <div className="flex flex-col px-1 text-center ">
              <div className="text-emerald-500  font-semibold">
                {formatCurrency(100)}
              </div>
              <div className=" bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100 whitespace-nowrap uppercase tracking-wide">
                2 pending
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-[2px] h-10 bg-slate-100"></div>
            <div className="px-2 h-full flex items-center justify-center text-sky-500">
              <ChevronRight size={30} />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default Saving_management;
