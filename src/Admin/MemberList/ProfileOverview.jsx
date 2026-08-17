import {
  EllipsisVertical,
  UserRoundPen,
  ShieldAlert,
  Ban,
  Mail,
  Phone,
  UserCircle,
  User,
  AlertCircle,
  Fingerprint,
  MapPin,
  Cake,
  Logs,
  CreditCard,
  CheckCircle2,
  WalletCards,
  Database,
  Dot,
  ArrowLeft,
} from "lucide-react";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { useInfiniteFetch } from "../../serviceToApi/InfiniteScroll";
import { useParams } from "react-router-dom";
import { getProfileImage } from "../../reusableComponents/Hooks/ImageGet";
import {
  formatCurrency,
  formatDate,
} from "../../reusableComponents/Utils/formatter";
import { useState } from "react";
import { useInfiniteAutoScroll } from "../../reusableComponents/Hooks/automaticScroll";
import {
  formatTimeAgo,
  formatFullDate,
} from "../../reusableComponents/Utils/TimeDateformat";
import { useDeleteData } from "../../serviceToApi/DeleteData";
import {
  showAlert,
  swalModal,
} from "../../reusableComponents/Alerts/SweetAlerts";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { calculateAge } from "../../reusableComponents/Utils/CalculateAge";
import LedgerList from "../../reusableComponents/Display/LedgerList";

function ProfileOverview() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("info");

  const {
    data: memberData,
    fetchNextPage: loadMoreMembers,
    hasNextPage: hasMoreMembers,
    isFetchingNextPage: loadingMembers,
  } = useInfiniteFetch(
    ["memberList-overview", user_id],
    API_ENDPOINTS.ADD_USER_OVERVIEW(user_id),
    {
      enabled: !!user_id && activeTab !== null,
      staleTime: 5000,
      gcTime: 0,
    },
  );

  const { mutate: DeleteMember } = useDeleteData(
    API_ENDPOINTS.ADMIN_DELETE_MEMBER(user_id),
    "memberList-overview",
  );

  const deleteSwal = async () => {
    const agreeDepo = await swalModal({
      title: "Delete Member?",
      html: `You are about to delete <b>${fullName}</b>. <br/> This action cannot be undone!`,
      confirmButtonText: "Yes, delete now",
      showCancelButton: true,
      icon: "warning",
    });
    if (agreeDepo) handleDelete();
  };

  const handleDelete = () => {
    DeleteMember(
      {},
      {
        onSuccess: (response) => {
          if (response === "Successfully Deleted Member" || response?.success) {
            showAlert.success("Deleted!", `Member successfully deleted`);
            navigate("/admin/memberlist");
            queryClient.invalidateQueries({
              queryKey: ["memberList-overview"],
            });
          } else {
            showAlert.error("Failed", response.message);
          }
        },
        onError: (err) => {
          const errorMessage =
            err.response?.data?.message || "Failed to delete member";
          showAlert.error("Failed", errorMessage);
        },
      },
    );
  };

  const LedgerData =
    memberData?.pages.flatMap((page) => page.allPayments?.content) || [];

  const sentinelRef = useInfiniteAutoScroll(
    loadMoreMembers,
    hasMoreMembers,
    loadingMembers,
    LedgerData.length,
  );
  
  const profileData = memberData?.pages?.[0]?.info || null;

  console.log("Total Items in LedgerData:", LedgerData.length);

  const initial = profileData?.middlleName
    ? profileData.middlleName[0].toUpperCase()
    : "";
  const fullName = profileData
    ? `${profileData.firstName} ${initial}${initial ? "." : ""} ${profileData.lastName}`
    : "Loading Member...";
  const matureStatus =
    profileData?.mature === false ? "Ineligible" : "Eligible";

  const tabs = [
    {
      id: "info",
      label: "Profile",
      icon: <UserCircle size={16} />,
      color: "bg-sky-500",
    },
    {
      id: "ledger",
      label: "Ledger",
      icon: <Logs size={16} />,
      color: "bg-indigo-500",
    },
  ];
  
  const age = calculateAge(profileData?.birthday);

  const profileInfo = [
    {
      label: "Gender",
      content: profileData?.gender,
      icon: <User size={20} />,
      color: "bg-sky-500",
    },
    {
      label: "Age",
      content: age,
      icon: <Fingerprint size={20} />,
      color: "bg-sky-500",
    },
    {
      label: "Birthday",
      content: formatDate(profileData?.birthday),
      icon: <Cake size={20} />,
      color: "bg-sky-500",
    },
    {
      label: "Address",
      content: profileData?.address,
      icon: <MapPin size={20} />,
      color: "bg-sky-500",
    },
  ];

  const handleEdit = () => {
    navigate("editAdmin", {
      state: {
        initialData: profileData,
        fullName: fullName,
      },
    });
  };

  const statusColors = {
    text: {
      Withdrawal: "text-rose-500",
      Completed: "text-sky-500",
      Default: "text-emerald-500",
    },
    bg: {
      Withdrawal: "bg-rose-50 dark:bg-rose-900/20",
      Completed: "bg-sky-50 dark:bg-sky-900/20",
      Default: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    badge: {
      Withdrawal:
        "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/50",
      Completed:
        "bg-sky-50 text-sky-600 border border-sky-100 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800/50",
      Default:
        "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50",
    },
  };

  const transactionIcons = {
    Withdrawal: <WalletCards size={18} className="text-rose-500" />,
    Completed: <CheckCircle2 size={18} className="text-sky-500" />,
    Default: <CreditCard size={18} className="text-emerald-500" />,
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* MOBILE VIEW */}
      <div className="block md:hidden text-left">
        <div className="flex w-full bg-white dark:bg-slate-900 shadow-sm p-5 rounded-3xl items-start gap-4 border border-transparent dark:border-slate-800">
          <div className="relative shrink-0">
            <img
              src={getProfileImage(profileData?.profileImage)}
              alt="Profile_pic"
              className="rounded-full w-20 h-20 border-2 border-sky-400 p-0.5 object-cover"
            />
            {profileData && (
              <div
                className={`absolute bottom-1 right-1 w-4 h-4 border-2 border-white rounded-full ${
                  profileData.online ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
            )}
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <h2 className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight uppercase break-words line-clamp-2 mb-2">
              {fullName}
            </h2>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Mail size={14} className="shrink-0 text-sky-500" />
                <span className="text-xs font-medium truncate">
                  {profileData?.email || "No data"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Phone size={14} className="shrink-0 text-sky-500" />
                <span className="text-xs font-medium">
                  {profileData?.phoneNumber || "No contact info"}
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 -mt-1 -mr-1">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle btn-sm"
              >
                <EllipsisVertical size={20} className="text-slate-400" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[10] menu p-2 shadow-lg bg-base-100 dark:bg-slate-800 rounded-2xl w-52 border border-slate-100 dark:border-slate-700 mt-2"
              >
                <li>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex items-center gap-2 py-3"
                  >
                    <UserRoundPen size={16} /> <span>Edit Profile</span>
                  </button>
                </li>
                <div className="divider my-0 opacity-50"></div>
                <li>
                  <button
                    type="button"
                    onClick={() => deleteSwal()}
                    className="flex items-center gap-2 py-3 text-error"
                  >
                    <Ban size={16} /> <span>Delete account</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 my-3 gap-3">
          <div className="p-5 flex flex-col bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-transparent dark:border-slate-800">
            <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black block">
              Savings
            </span>
            <h2 className="text-lg font-black mb-3 text-emerald-500 tracking-tighter mt-1">
              {formatCurrency(profileData?.savingsBalance ?? 0)}
            </h2>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[8px] font-black uppercase text-slate-400">
                Status:
              </span>
              <span
                className={`text-[9px] font-black ${profileData?.mature === false ? "text-red-500/80 bg-red-50 dark:bg-red-950/30" : "text-emerald-500/80 bg-emerald-50 dark:bg-emerald-950/30"}  px-1.5 py-0.5 rounded-md`}
              >
                {matureStatus || "No savings"}
              </span>
            </div>
          </div>
          <div className="p-5 flex flex-col bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-transparent dark:border-slate-800">
            <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black block">
              Loan
            </span>
            <h2 className="text-lg mb-3 font-black text-red-500 tracking-tighter mt-1">
              {formatCurrency(profileData?.loanBalance ?? 0)}
            </h2>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[8px] font-black uppercase text-slate-400">
                Due:
              </span>
              <span className="text-[9px] font-black text-red-500/80 bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded-md">
                {formatDate(profileData?.loanDueDate) || "No loan"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex bg-slate-105 dark:bg-slate-800/50 p-1.5 rounded-2xl gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
              flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300
              ${
                activeTab === tab.id
                  ? `${tab.color} text-white shadow-sm scale-[1.02]`
                  : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
              }
            `}
            >
              {tab.icon}
              <span className={activeTab === tab.id ? "block" : "hidden"}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === "info" && (
            <div className="flex flex-col gap-3 p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              {profileInfo.map((items, index) => (
                <div
                  key={index}
                  className="group relative p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 "
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-sky-50 dark:bg-sky-900/30 text-sky-500 rounded-2xl">
                        {items.icon}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black block mb-0.5">
                          {items.label}
                        </span>
                        <h4 className="text-sm font-black text-slate-700 dark:text-slate-202">
                          {items.content || "No data"}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "ledger" && (
            <>
              {LedgerData.length > 0 ? (
                <LedgerList
                  ledgerData={LedgerData}
                  statusColors={statusColors}
                  transactionIcons={transactionIcons}
                  formatTimeAgo={formatTimeAgo}
                  sentinelRef={sentinelRef}
                  loadingMembers={loadingMembers}
                  hasMoreMembers={hasMoreMembers}
                  formatFullDate={formatFullDate}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 opacity-50">
                  <div className="p-5 bg-slate-100 dark:bg-slate-800 rounded-full mb-3 shadow-inner">
                    <Logs size={28} className="text-slate-400" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    No Transactions
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:flex flex-col gap-6 text-left">
        
        {/* Desktop Header */}
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 select-none">
              <span>Users</span>
              <span>&gt;</span>
              <span className="text-slate-500">Profile</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => navigate("/admin/memberlist")}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-slate-600 dark:text-slate-350"
                title="Back to Member List"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                User Details
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleEdit}
              className="h-10 px-5 flex justify-center items-center gap-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-xl active:scale-95 transition-all text-xs font-bold shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <UserRoundPen size={14} />
              <span>Edit</span>
            </button>
            <button
              onClick={deleteSwal}
              className="h-10 px-5 flex justify-center items-center gap-1.5 text-white bg-red-600 hover:bg-red-700 rounded-xl active:scale-95 transition-all text-xs font-bold shadow-sm cursor-pointer"
            >
              <Ban size={14} />
              <span>Delete Account</span>
            </button>
          </div>
        </div>

        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Profile Card & Personal Info (col-span-1) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* User Profile Details Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm flex flex-col items-center text-center">
              <div className="relative shrink-0">
                <img
                  src={getProfileImage(profileData?.profileImage)}
                  alt="Profile_pic"
                  className="rounded-full w-24 h-24 border-2 border-slate-100 dark:border-slate-800 p-0.5 object-cover shadow-inner"
                />
                {profileData && (
                  <div
                    className={`absolute bottom-1 right-1 w-4.5 h-4.5 border-2 border-white dark:border-slate-900 rounded-full ${
                      profileData.online ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  ></div>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-850 dark:text-white mt-4 uppercase leading-tight">
                {fullName}
              </h3>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-wider px-3.5 py-1 rounded-full mt-2 inline-block">
                ACTIVE MEMBER
              </span>

              <div className="h-[1px] bg-slate-100 dark:bg-slate-850 w-full my-6"></div>

              {/* Styled Email & Phone details */}
              <div className="w-full flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-4 py-3 rounded-xl">
                  <Mail size={16} className="text-blue-500 shrink-0" />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold truncate">
                    {profileData?.email || "No email info"}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-855 px-4 py-3 rounded-xl">
                  <Phone size={16} className="text-blue-500 shrink-0" />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    {profileData?.phoneNumber || "No phone info"}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Information Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm text-left flex flex-col gap-5">
              <div className="flex items-center gap-2 border-b border-b-slate-100 dark:border-b-slate-850 pb-3">
                <User size={18} className="text-slate-500" />
                <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-widest">
                  Personal Information
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                {profileInfo.map((items, index) => (
                  <div key={index} className="flex items-center gap-4 border-b border-b-slate-50 dark:border-b-slate-850/50 pb-3 last:border-b-0 last:pb-0">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-xl shrink-0">
                      {items.icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                        {items.label}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-205 truncate mt-0.5">
                        {items.content || "No data"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Summaries & Ledger (col-span-2) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Savings & Loan side-by-side stats */}
            <div className="grid grid-cols-2 gap-6">
              
              {/* Savings Card */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden text-left min-h-[140px]">
                <div className="absolute right-0 top-0 w-24 h-24 text-blue-500/5 dark:text-blue-400/5 -mr-4 -mt-4 transform rotate-12 shrink-0 select-none">
                  <Database size={80} strokeWidth={1} />
                </div>

                <div>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                      Savings
                    </span>
                    <Database size={16} className="text-emerald-500/80" />
                  </div>
                  <h2 className="text-2xl font-black text-emerald-500 tracking-tight mt-2">
                    {formatCurrency(profileData?.savingsBalance ?? 0)}
                  </h2>
                </div>

                <div className="h-[1px] bg-slate-100 dark:bg-slate-850 w-full my-3"></div>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Status:
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                    profileData?.mature === false 
                      ? "text-red-650 bg-red-50 dark:bg-red-950/20" 
                      : "text-emerald-650 bg-emerald-50 dark:bg-emerald-950/20"
                  }`}>
                    {matureStatus}
                  </span>
                </div>
              </div>

              {/* Loan Card */}
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden text-left min-h-[140px]">
                <div className="absolute right-0 top-0 w-24 h-24 text-red-500/5 dark:text-red-400/5 -mr-4 -mt-4 transform rotate-12 shrink-0 select-none">
                  <CreditCard size={80} strokeWidth={1} />
                </div>

                <div>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                      Loan
                    </span>
                    <CreditCard size={16} className="text-red-550/80" />
                  </div>
                  <h2 className="text-2xl font-black text-red-500 tracking-tight mt-2">
                    {formatCurrency(profileData?.loanBalance ?? 0)}
                  </h2>
                </div>

                <div className="h-[1px] bg-slate-100 dark:bg-slate-855 w-full my-3"></div>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Due:
                  </span>
                  <span className="text-[10px] font-bold uppercase text-red-650 bg-red-50 dark:bg-red-950/20 px-2.5 py-0.5 rounded-md">
                    {formatDate(profileData?.loanDueDate) || "No loan"}
                  </span>
                </div>
              </div>

            </div>

            {/* Ledger Section Container */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col overflow-hidden">
              
              {/* Ledger title header */}
              <div className="flex items-center justify-center gap-2 border-b border-b-slate-100 dark:border-b-slate-850 px-6 py-4 bg-slate-50/50 dark:bg-slate-850/30">
                <Logs size={16} className="text-slate-500" />
                <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-widest">
                  Ledger
                </h3>
              </div>

              {/* Ledger list area */}
              <div className="p-6">
                {LedgerData.length > 0 ? (
                  <LedgerList
                    ledgerData={LedgerData}
                    statusColors={statusColors}
                    transactionIcons={transactionIcons}
                    formatTimeAgo={formatTimeAgo}
                    sentinelRef={sentinelRef}
                    loadingMembers={loadingMembers}
                    hasMoreMembers={hasMoreMembers}
                    formatFullDate={formatFullDate}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="p-4 bg-slate-50 dark:bg-slate-850 text-slate-400 rounded-full mb-3">
                      <Logs size={28} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      Ledger
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 max-w-sm">
                      Additional profile metrics, recent activity, and linked accounts will appear here. Select the Ledger tab to view transaction history.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProfileOverview;
