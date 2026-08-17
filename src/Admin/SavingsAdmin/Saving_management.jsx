import React, { useState } from "react";
import { useFetchData } from "../../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { EyeClosed, Eye, Search, SlidersHorizontal } from "lucide-react";
import { usePasswordToggle } from "../../reusableComponents/Forms/ToggleEye";
import { formatCurrency } from "../../reusableComponents/Utils/formatter";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import { useNavigate } from "react-router-dom";
import MemberCard from "./MemberCard";

function Saving_management() {
  const navigate = useNavigate();
  const { show, toggle } = usePasswordToggle();
  const [searchQuery, setSearchQuery] = useState("");
  const [balanceFilter, setBalanceFilter] = useState("all");

  const { data: savingsDataPayment, isLoading: savingsLoading } = useFetchData(
    "api/admin/savings/members",
    API_ENDPOINTS.SAVINGS.SAVINGS_ADMIN_MEMBERS,
  );

  const { data: savingsCardData, isLoading: savingsCardLoading } = useFetchData(
    "api/admin/savings/total",
    API_ENDPOINTS.SAVINGS.SAVINGS_CARD_OVERVIEW,
  );

  const hanldeShowMemberPayment = (id) => {
    navigate(`${id}`);
  };

  const ApiTO = savingsCardData?.overAllSavings || 0;
  const overAllTotalSavings = formatCurrency(ApiTO || 0);
  const displaySavingsOverall = show
    ? overAllTotalSavings
    : overAllTotalSavings.replace(/[^₱\s]/g, "•");

  const memberList = savingsDataPayment?.payload || [];

  // Filter logic
  const filteredMemberList = memberList.filter((member) => {
    const name = `${member.firstName || ""} ${member.lastName || ""}`.toLowerCase();
    const sId = (member.savingsId || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = name.includes(query) || sId.includes(query);

    let matchesFilter = true;
    if (balanceFilter === "zero") {
      matchesFilter = Number(member.savingsAccountBalance) === 0;
    } else if (balanceFilter === "has") {
      matchesFilter = Number(member.savingsAccountBalance) > 0;
    } else if (balanceFilter === "pending_payment") {
      matchesFilter = !!member.hasPendingPayment;
    } else if (balanceFilter === "pending_withdrawal") {
      matchesFilter = !!member.hasPendingWithdrawal;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* MOBILE VIEW */}
      <div className="block md:hidden">
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
              <span className=" font-semibold dark:text-slate-200">
                {savingsCardData?.totalMembers || 0}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 dark:text-slate-500">
                Total Pending Payment
              </span>
              <span className=" font-semibold text-amber-500 dark:text-amber-400">
                {savingsCardData?.totalPending || 0}
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

      {/* DESKTOP VIEW */}
      <div className="hidden md:flex flex-col gap-6">
        
        {/* Breadcrumb & Title */}
        <div className="flex flex-col">
          <div className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1.5 mb-1.5">
            <span>Admin Panel</span>
            <span className="text-[10px] opacity-60">&gt;</span>
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Member Management</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Member Management
          </h1>
        </div>

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Area: Search, Filters & Members Grid */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Search and Filters Bar */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-2 rounded-xl focus-within:border-sky-500 transition-colors">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by SID or Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs flex-1 text-slate-700 dark:text-slate-300 focus:ring-0 placeholder:text-slate-400"
                />
              </div>

              <select
                value={balanceFilter}
                onChange={(e) => setBalanceFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-350 focus:ring-0 outline-none cursor-pointer"
              >
                <option value="all">All Balances</option>
                <option value="has">Has Balance</option>
                <option value="zero">Zero Balance</option>
                <option value="pending_payment">Pending Payments</option>
                <option value="pending_withdrawal">Pending Withdrawals</option>
              </select>
            </div>

            {/* Grid of Cards */}
            {filteredMemberList && filteredMemberList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMemberList.map((member) => (
                  <MemberCard
                    key={member.savingId || member.savingsId}
                    member={member}
                    onAction={hanldeShowMemberPayment}
                    formatCurrency={formatCurrency}
                    getProfileImage={getProfileImage}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center mt-5 p-10 italic rounded-2xl text-slate-500 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-inner">
                <span>No matching members found.</span>
              </div>
            )}
          </div>

          {/* Sidebar Area: Overall Balance & Stats */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Overall Savings summary Card */}
            <div className="p-6 bg-white dark:bg-slate-800 shadow-sm rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">
                    Overall Savings
                  </span>
                  <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    {displaySavingsOverall}
                  </span>
                </div>
                <button
                  onClick={toggle}
                  type="button"
                  className="text-slate-400 hover:text-slate-600 transition-colors dark:text-slate-500 dark:hover:text-slate-400 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
                >
                  {show ? <Eye size={18} /> : <EyeClosed size={18} />}
                </button>
              </div>
            </div>

            {/* Sparkline & Stats Card */}
            <div className="bg-gradient-to-br from-[#121829] to-[#0a0c16] text-white p-6 rounded-2xl shadow-lg border border-slate-800/80 flex flex-col gap-6 relative overflow-hidden">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Activity Trend</span>
                  <span className="text-[10px] text-sky-400 bg-sky-950/40 border border-sky-900/50 px-2 py-0.5 rounded-full font-bold">
                    ↗ +2.4% this month
                  </span>
                </div>
                <div className="h-16 flex items-end mt-2">
                  <svg className="w-full h-full opacity-80" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path
                      d="M0,22 Q15,12 35,20 T70,8 T100,5"
                      fill="none"
                      stroke="url(#sparkline-grad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="sparkline-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <div className="h-[1px] bg-slate-800/80 w-full" />

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">Total Members</span>
                  <span className="font-bold text-lg text-white">
                    {savingsCardData?.totalMembers || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">Pending Payments</span>
                  <span className="font-bold text-lg text-white">
                    {savingsCardData?.totalPending || 0}
                  </span>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      </div>
      
    </div>
  );
}

export default Saving_management;
