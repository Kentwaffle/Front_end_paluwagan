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
import { formatTimeAgo } from "../../reusableComponents/Utils/TimeDateformat";
import { useDeleteData } from "../../serviceToApi/DeleteData";
import {
  showAlert,
  swalModal,
} from "../../reusableComponents/Alerts/SweetAlerts";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { calculateAge } from "../../reusableComponents/Utils/CalculateAge";

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
  5;
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
    <div className="p-5 min-h-[101vh] relative">
      <div className="flex w-full bg-white shadow-sm p-5 rounded-3xl items-start gap-4">
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
              className="dropdown-content z-[10] menu p-2 shadow-lg bg-base-100 rounded-2xl w-52 border border-slate-100 mt-2"
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
        <div className="p-5 flex flex-col bg-white shadow-sm rounded-xl">
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
        <div className="p-5 flex flex-col bg-white shadow-sm rounded-xl">
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

      <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
            flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300
            ${
              activeTab === tab.id
                ? `${tab.color} text-white shadow-sm shadow-${tab.id === "info" ? "sky" : tab.id === "deposit" ? "emerald" : "red"}-500/30 scale-[1.02]`
                : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
            }
          `}
          >
            {tab.icon}
            <span
              className={activeTab === tab.id ? "block" : "hidden md:block"}
            >
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
                className="group relative p-4  bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 "
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
                      <h4 className="text-sm font-black text-slate-700 dark:text-slate-200">
                        {items.content || "No data"}
                      </h4>
                    </div>
                  </div>

                  {/* <div
                    className="tooltip tooltip-left"
                    data-tip="Please update info"
                  >
                    <AlertCircle
                      size={18}
                      className="text-amber-400 opacity-60 hover:opacity-100 transition-opacity"
                    />
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "ledger" && (
          <>
            {LedgerData.length > 0 ? (
              <div className="flex flex-col gap-3">
                {LedgerData.map((content, index) => (
                  <div
                    key={`${content.id}-${index}`}
                    className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
                  >
                    <div className="flex l items-center gap-4">
                      <div
                        className={`${statusColors.bg[content.description] || statusColors.bg.Default} p-3 rounded-full`}
                      >
                        {transactionIcons[content.description] ||
                          transactionIcons.Default}
                      </div>
                      <div className="flex justify-between w-full items-center">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                            {content.description === "Withdrawal"
                              ? "Withdrawal completed"
                              : content.description === "Completed"
                                ? "Loan Completed"
                                : "Payment"}
                          </h4>
                          <div className="flex  text-slate-400 font-semibold text-[11px]">
                            {content.reference}
                            <Dot
                              size={16}
                              className="text-slate-300"
                              strokeWidth={3}
                            />
                            <span className="font-sans font-bold uppercase text-slate-500">
                              {content.description === "Withdrawal"
                                ? "Cash" // ? "Abanta to need ng mod sa with kung san mapupunta pera Cash/Gcash/nigga"
                                : content.modeOfPayment || "Cash"}
                            </span>
                          </div>
                        </div>
                        <span>
                          <div
                            className={`${statusColors.badge[content.description] || statusColors.badge.Default} text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider`}
                          >
                            {content.description === "Loan" ||
                            content.description === "Completed"
                              ? "Loan"
                              : "Savings"}
                          </div>
                        </span>
                      </div>
                    </div>
                    <span className="px-5">
                      <div
                        className={`font-black text-2xl ml-3 leading-none ${statusColors.text[content.description] || statusColors.text.Default}`}
                      >
                        {content.description === "Withdrawal" ? "-" : "+"}₱
                        {content.amount.toLocaleString()}
                      </div>
                    </span>
                    <div className="flex justify-between border-t border-t-slate-200 pt-2 px-1">
                      <span className="text-xs text-slate-400 font-mono tracking-tighter">
                        {formatTimeAgo(content.depositDate)}
                      </span>
                      <span className="text-xs text-slate-400 font-mono tracking-tighter">
                        {content.savingsId}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={sentinelRef} className="text-center">
                  {loadingMembers ? (
                    <span className="loading loading-dots text-slate-400"></span>
                  ) : hasMoreMembers ? (
                    <span className="text-[10px] font-black text-slate-400 animate-bounce">
                      Scroll to load more details.
                    </span>
                  ) : (
                    <span className="text-xs italic text-slate-400">
                      -End of ledger. -
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 opacity-50">
                <div className="p-5 bg-slate-100 dark:bg-slate-800 rounded-full mb-3 shadow-inner">
                  <Logs size={28} className="text-slate-400" />
                </div>
                <p className=" text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  No Transactions
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileOverview;
