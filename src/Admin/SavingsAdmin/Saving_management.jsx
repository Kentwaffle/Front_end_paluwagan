// import { useState } from "react";
import { useFetchData } from "../../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
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
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { useNavigate } from "react-router-dom";

function Saving_management() {
  const navigate = useNavigate();
  const { show, toggle } = usePasswordToggle();

  const { data: savingsDataPayment, isLoading: savignsLoading } = useFetchData(
    "api/admin/savings/members",
    API_ENDPOINTS.SAVINGS_ADMIN_MEMBERS,
  );

  const hanldeShowMemberPayment = (id) => {
    navigate(`paymentList/${id}`);
  };

  const ApiTO = 100;
  const overAllTotalSavings = formatCurrency(ApiTO || 0);
  const displaySavingsOverall = show
    ? overAllTotalSavings
    : overAllTotalSavings.replace(/[^₱\s]/g, "•");

  const memberList = savingsDataPayment?.payload || [];
  const isStatusPayment = savingsDataPayment?.payload?.hasPendingPayment;

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
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 ">Total Members</span>
            <span className=" font-semibold ">100</span>
          </div>
          {/* <div className="flex justify-between text-xs">
            <span className="text-slate-400 ">Total Approved</span>
            <span className="font-semibold text-emerald-600">100</span>
          </div> */}
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 ">Total Pending</span>
            <span className=" font-semibold text-amber-500">100</span>
          </div>
        </div>
      </div>
      <div className="my-4 mx-2 flex justify-between">
        <label className="text-slate-800  font-semibold">Savings Members</label>
        <label className="text-sky-500">See all</label>
        {/* <SearchInput className="!rounded-full" /> */}
      </div>
      {memberList.length > 0 ? (
        memberList.slice(0, 20).map((member) => (
          <div
            key={member.savingId || member.firstName}
            className=" bg-white my-3 w-full p-5 rounded-2xl shadow-sm cursor-pointer"
          >
            <div className=" w-full">
              <div className="flex items-start flex-1 gap-3 justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 flex justify-center items-center border border-sky-500 rounded-full overflow-hidden">
                    <img
                      alt="Profile picture"
                      src={getProfileImage(member.profileImage)}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex flex-col flex-1 items-start min-w-0">
                    <div className="flex flex-wrap gap-1 truncate w-full font-bold">
                      <div className="text-slate-800 ">{member.firstName}</div>
                      <div className="text-slate-800">{member.lastName}</div>
                    </div>
                    <div className="text-xs text-slate-400">
                      {member.savingsId || "No ID"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-t-slate-200 mt-3 pt-3 pl-2">
                <div className="flex flex-col">
                  <span className="text-xs tracking-wider text-slate-400">
                    Account savings
                  </span>
                  <div className="text-emerald-500 font-semibold text-xl">
                    {formatCurrency(member.savingsAccountBalance) || 0}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => hanldeShowMemberPayment(member.savingsId)}
                  className="relative p-2 rounded-full bg-sky-50 text-sky-600 transition-all duration-300 
               group-hover:bg-sky-500 group-hover:text-white group-hover:shadow-md"
                >
                  {member.hasPendingPayment ? (
                    <div className="bg-white p-1 rounded-full absolute -top-1 -right-0.5">
                      <div className=" bg-amber-500 h-3 w-3 r rounded-full flex items-center"></div>
                    </div>
                  ) : (
                    ""
                  )}
                  <ChevronRight size={30} />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center text-center mt-5 p-10 h-auto italic rounded-2xl text-slate-500 bg-white-50 border border-slate-100 shadow-inner">
          <span>No applicants yet.</span>
        </div>
      )}
    </div>
  );
}

export default Saving_management;
