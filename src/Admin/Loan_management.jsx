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

function Loan_management() {
  const [searchrefPending, setSearchrefPending] = useState("");
  const [currentStatus, setCurrentStatus] = useState("PENDING");
  //SSE ni juls na di ko magets
  useLoanSSE();

  //DYNAMIC ENDPOINTS
  const statusEndpoint =
    currentStatus === "PENDING"
      ? API_ENDPOINTS.ADMIN_PENDING
      : currentStatus === "APPROVED"
        ? API_ENDPOINTS.ADMIN_APPROVED
        : API_ENDPOINTS.ADMIN_REJECTED;

  const { data: admin_data } = useFetchData(statusEndpoint, statusEndpoint);

  const { mutate: admin_change_status, loading: change_status } = usePutData(
    "api/admin/loan/change-status",
    API_ENDPOINTS.ADMIN_CHANGE_STATUS,
  );
  const { data: application_count } = useFetchData(
    "api/admin/loan/status-counts",
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
    { label: "Rejected", value: "REJECTED" },
  ];
  const count = admin_data?.payload?.length || 0;
  return (
    <div key={"admin_laon_management"} className="min-h-screen p-3">
      <label className="input rounded-3xl w-full ">
        <Search className="opacity-50" />
        <input
          type="search"
          required
          value={searchrefPending}
          placeholder="Search reference or name"
          className="grow"
          onChange={(e) => setSearchrefPending(e.target.value)}
        />
      </label>
      <div className="flex w-full  gap-2 mt-3">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`flex-1 tab transition-all  shadow-sm ${
              currentStatus === tab.value
                ? `tab-active ${tabsColor(tab.value)}  shadow-md`
                : "bg-white text-gray-500"
            } rounded-xl px-2 py-1 `}
            onClick={() => setCurrentStatus(tab.value)}
          >
            <div className="flex items-center gap-1">
              <div className="flex gap-1 items-center font-semibold">
                {statusIcon(tab.value)}
                {tab.label}
              </div>

              <span
                className={`border ${tabsBorder(tab.value)} px-1 py-0 rounded-full text-xs font-bold `}
              >
                {application_count?.[tab.value] || 0}
              </span>
            </div>
          </button>
        ))}
      </div>
      <CardStatus
        searchrefPending={searchrefPending}
        setSearchrefPending={setSearchrefPending}
        admin_data={admin_data}
        approveStatus={approveStatus}
        rejectStatus={rejectStatus}
        currentStatus={currentStatus}
      />
    </div>
  );
}

export default Loan_management;
