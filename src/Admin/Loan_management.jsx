import { useState } from "react";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import {
  tabsColor,
  statusIcon,
  tabsBorder,
} from "../reusableComponents/Feedbacks/StatusHelper";
import { usePutData } from "../serviceToApi/PutData";
import { showAlert } from "../reusableComponents/Alerts/SweetAlerts";
import { useLoanSSE } from "../reusableComponents/Hooks/SSE";
import CardStatus from "./CardStatus";
import { Search } from "lucide-react";
import { swalModal } from "../reusableComponents/Alerts/SweetAlerts";
import { useAuth } from "../auth/Auth";
import SearchInput from "../reusableComponents/Forms/SearchInput";
import { useQueryClient } from "@tanstack/react-query";

function Loan_management() {
  const [searchrefPending, setSearchrefPending] = useState("");
  const [currentStatus, setCurrentStatus] = useState("PENDING");
  const { token, isLoadingAuth } = useAuth();
  const queryClient = useQueryClient();

  // SSE connection
  useLoanSSE(true, null);

  const { data: admin_data } = useFetchData(
    ["admin-loans", currentStatus],
    API_ENDPOINTS.ADMIN_STATUS(currentStatus),
  );

  const cardData = admin_data?.applicants;

  const { mutate: admin_change_status, loading: change_status } = usePutData(
    "/api/admin/loan/change-status",
    API_ENDPOINTS.ADMIN_CHANGE_STATUS,
  );
  const { data: application_count } = useFetchData(
    "admin-loan-counts",
    API_ENDPOINTS.ADMIN_COUNT,
  );

  const approveStatus = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    const confirm = await swalModal({
      title: "Approve this application?",
      text: `You are about to approved this application ID: ${id}`,
      confirmButtonText: "Approve",
    });
    if (!confirm) return;

    showAlert.loading("Submitting please wait");

    admin_change_status(
      { status: "APPROVED", applicationID: id },
      {
        onSuccess: () => {
          showAlert.success("Successfully approve", "User has been approved");
          queryClient.invalidateQueries({
            queryKey: ["user-status-key"],
          });
        },
        onError: (error) => {
          showAlert.warning("Error", error);
        },
      },
    );
  };

  const rejectStatus = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const confirm = await swalModal({
      title: "Reject this application?",
      text: `You are about to reject this application ID: ${id}`,
      confirmButtonText: "Reject",
    });
    if (!confirm) return;

    showAlert.loading("Submitting please wait");
    admin_change_status(
      { status: "REJECTED", applicationID: id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["user-status-key"],
          });
          showAlert.success("Successfully Rejected", "User has been Rejected");
        },
        onError: (error) => {
          showAlert.warning("Error", error);
        },
      },
    );
  };

  const tabs = [
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
  ];

  return (
    <div key={"admin_laon_management"} className="min-h-screen p-3 md:p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* MOBILE VIEW */}
      <div className="block md:hidden">
        <div className="flex gap-3 items-center mb-5">
          <SearchInput
            value={searchrefPending}
            onChange={(e) => setSearchrefPending(e.target.value)}
            placeholder="Search reference ID"
            className="dark:bg-slate-700/50 dark:border-slate-700"
          />
          <button className="p-2 bg-sky-100 text-sky-500 rounded-xl transition-colors hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:hover:bg-sky-900/50">
            <Search />
          </button>
        </div>

        <div className="flex w-full bg-white shadow-inner gap-2 rounded-2xl mt-3 p-2 dark:bg-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`flex-1 tab transition-all ${
                currentStatus === tab.value
                  ? `tab-active ${tabsColor(tab.value)} shadow-sm`
                  : "bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              } rounded-xl px-2 py-1`}
              onClick={() => setCurrentStatus(tab.value)}
            >
              <div className="flex items-center gap-1">
                <div className="flex gap-1 items-center font-semibold">
                  {tab.label}
                </div>
                {application_count?.[tab.value] > 0 && (
                  <span className="px-1 py-0 text-xs font-bold">
                    {application_count[tab.value]}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:flex flex-col gap-6">
        
        {/* Header with Title and Tabs */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Applications
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-450 font-medium mt-1">
              Review and manage incoming loan requests.
            </p>
          </div>

          {/* Desktop Tabs */}
          <div className="flex bg-slate-200/60 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-250/50 dark:border-slate-800 gap-1 select-none">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setCurrentStatus(tab.value)}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentStatus === tab.value
                    ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200/80 dark:border-slate-700"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-350"
                }`}
              >
                <span>{tab.label}</span>
                {application_count?.[tab.value] > 0 && (
                  <span className="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                    {application_count[tab.value]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Search Bar (Styled like mockup header search but inline) */}
        <div className="flex max-w-md items-center gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-2.5 rounded-xl shadow-sm focus-within:border-sky-500 transition-colors">
          <Search size={16} className="text-slate-455" />
          <input
            type="text"
            value={searchrefPending}
            onChange={(e) => setSearchrefPending(e.target.value)}
            placeholder="Search reference ID, name..."
            className="bg-transparent border-none outline-none text-xs flex-1 text-slate-750 dark:text-slate-300 focus:ring-0 placeholder:text-slate-400"
          />
        </div>

      </div>

      <div className="mt-4">
        <CardStatus
          searchrefPending={searchrefPending}
          setSearchrefPending={setSearchrefPending}
          cardData={cardData}
          approveStatus={approveStatus}
          rejectStatus={rejectStatus}
          currentStatus={currentStatus}
        />
      </div>
    </div>
  );
}

export default Loan_management;
