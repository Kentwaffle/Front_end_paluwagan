import { useState } from "react";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import {
  tabsColor,
  statusIcon,
  tabsBorder,
} from "../reusableComponents/StatusHelper";
import { usePutData } from "../serviceToApi/PutData";
import { showAlert } from "../reusableComponents/Alerts/SweetAlerts";
import { useLoanSSE } from "../reusableComponents/Hooks/SSE";
import CardStatus from "./CardStatus";
import { Search } from "lucide-react";
import { swalModal } from "../reusableComponents/Alerts/SweetAlerts";
import { useAuth } from "../auth/Auth";
import SearchInput from "../reusableComponents/SearchInput";

function Loan_management() {
  const [searchrefPending, setSearchrefPending] = useState("");
  const [currentStatus, setCurrentStatus] = useState("PENDING");
  const { token, isLoadingAuth } = useAuth();
  //SSE ni juls na di ko magets
  useLoanSSE(true, null);

  const status = "APPROVED";

  const { data: admin_data } = useFetchData(
    ["admin-loans", currentStatus],
    API_ENDPOINTS.ADMIN_STATUS(currentStatus),
  );

  const cardData = admin_data?.applicants;

  const { mutate: admin_change_status, loading: change_status } = usePutData(
    "api/admin/loan/change-status",
    API_ENDPOINTS.ADMIN_CHANGE_STATUS,
  );
  const { data: application_count } = useFetchData(
    "admin-loan-counts",
    API_ENDPOINTS.ADMIN_COUNT,
  );

  const approveStatus = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Mutation Triggered! ID:", id);
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
    // { label: "Rejected", value: "REJECTED" },
  ];
  const count = admin_data?.payload?.length || 0;
  return (
    <div key={"admin_laon_management"} className="min-h-screen p-3">
      <div className="flex gap-3 items-center mb-5">
        <SearchInput
          placeholder="Search reference ID"
          className="dark:bg-slate-700/50 dark:border-slate-700"
        />
        <button className="p-2  bg-sky-100 text-sky-500 rounded-xl transition-colors hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:hover:bg-sky-900/50">
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
                ? `tab-active ${tabsColor(tab.value)}  shadow-sm`
                : "bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            } rounded-xl px-2 py-1 `}
            onClick={() => setCurrentStatus(tab.value)}
          >
            <div className="flex items-center gap-1">
              <div className="flex gap-1 items-center font-semibold">
                {/* {statusIcon(tab.value)} */}
                {tab.label}
              </div>

              <span className={` px-1 py-0  text-xs font-bold `}>
                {application_count?.[tab.value] == 0
                  ? ""
                  : application_count?.[tab.value]}
              </span>
            </div>
          </button>
        ))}
      </div>
      <CardStatus
        searchrefPending={searchrefPending}
        setSearchrefPending={setSearchrefPending}
        cardData={cardData}
        approveStatus={approveStatus}
        rejectStatus={rejectStatus}
        currentStatus={currentStatus}
      />
    </div>
  );
}

export default Loan_management;
