// import { useState } from "react";
import { useFetchData } from "../../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { EyeClosed, ChevronRight } from "lucide-react";
import { usePasswordToggle } from "../../reusableComponents/Hooks/ToggleEye";
import { formatCurrency } from "../../reusableComponents/formatter";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { useNavigate } from "react-router-dom";
import SeeAllPayments from "../../reusableComponents/SeeAllPayments";
import MemberCard from "./MemberCard";
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
      <div className="p-5 bg-white shadow-sm rounded-xl dark:bg-slate-800">
        <div className="flex justify-between items-start">
          <div className="flex flex-col ">
            <span className="text-sm text-slate-500 font-semibold dark:text-slate-400">
              Over all savings
            </span>
            <span className="text-4xl font-extrabold dark:text-slate-200">
              {displaySavingsOverall}
            </span>
          </div>
          <button
            onClick={toggle}
            type="button"
            className="text-slate-400 transition-colors dark:text-slate-500"
          >
            {show ? <Eye size={25} /> : <EyeClosed size={25} />}
          </button>
        </div>
        <div className="border-t border-t-slate-200 mt-5 py-2 dark:border-t-slate-700">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 dark:text-slate-500">
              Total Members
            </span>
            <span className=" font-semibold dark:text-slate-200">100</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 dark:text-slate-500">
              Total Pending
            </span>
            <span className=" font-semibold text-amber-500 dark:text-amber-400">
              100
            </span>
          </div>
        </div>
      </div>
      <div className="my-4 mx-2 flex justify-between">
        <label className="text-slate-800  font-semibold dark:text-slate-200">
          Savings Members
        </label>
        <button
          type="button"
          onClick={() => navigate("/admin/savings_management/savingsmembers")}
          className="text-sky-500 dark:text-sky-400"
        >
          See all
        </button>
      </div>
      {memberList && memberList.length > 0 ? (
        memberList
          .slice(0, 20)
          .map((member) => (
            <MemberCard
              key={member.savingId || member.savingsId}
              member={member}
              onAction={hanldeShowMemberPayment}
              formatCurrency={formatCurrency}
              getProfileImage={getProfileImage}
            />
          ))
      ) : (
        <div className="flex flex-col items-center text-center mt-5 p-10 italic rounded-2xl text-slate-500 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-inner">
          <span>No applicants yet.</span>
        </div>
      )}
    </div>
  );
}

export default Saving_management;
