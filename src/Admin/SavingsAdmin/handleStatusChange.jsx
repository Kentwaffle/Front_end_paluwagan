import { swalModal } from "../../reusableComponents/Alerts/SweetAlerts";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";
import { formatCurrency, formatDate } from "../../reusableComponents/Utils/formatter";
import Swal from "sweetalert2";

const isDarkMode = () => typeof document !== "undefined" && document.documentElement.classList.contains("dark");

export const handleTransactionAction = async (
  actionType,
  transactionData,
  context,
) => {
  const { ApproveData, queryClient, savingsId, userCreds } = context;
  const config = {
    APPROVE: {
      status: "PAID",
      title: "Accept payment?",
      msg: "Approved Successfully!",
      btn: "Yes, Accept",
    },
    REJECTED: {
      status: "REJECTED",
      title: "Decline payment?",
      msg: "Rejected Successfully!",
      btn: "Decline",
    },
    WITHDRAW_APPROVE: {
      status: "WITHDRAW",
      title: "Approve withdrawal?",
      msg: "Withdrawal Approved!",
      btn: "Yes, Approve",
    },
    WITHDRAW_REJECT: {
      status: "REJECTED",
      title: "Decline Withdrawal?",
      msg: "Successfully! Decline Withdrawal",
      btn: "Decline",
    },
  };

  const selected = config[actionType];
  let isConfirmed = false;

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

  if (isDesktop) {
    const isReject = actionType.includes("REJECT");
    const confirmBtnColorClass = isReject
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";
    
    const confirmBtnText = isReject
      ? (actionType === "REJECTED" ? "Yes, Decline Payment" : "Yes, Decline Withdrawal")
      : (actionType === "APPROVE" ? "Yes, Accept Payment" : "Yes, Approve Withdrawal");

    const headerIcon = isReject
      ? `<div class="w-12 h-12 bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
         </div>`
      : `<div class="w-12 h-12 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-450 rounded-full flex items-center justify-center shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
         </div>`;

    await Swal.fire({
      html: `
        <div class="flex flex-col gap-4 text-slate-800 dark:text-slate-200">
          <!-- Header -->
          <div class="flex items-start gap-4 text-left">
            ${headerIcon}
            <div class="flex flex-col gap-1">
              <h2 class="text-xl font-black text-slate-900 dark:text-white leading-tight">${selected.title}</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You are about to officially ${isReject ? 'decline' : 'approve'} and log this transaction. Please review the details below to ensure accuracy before proceeding.
              </p>
            </div>
          </div>

          <div class="h-[1px] bg-slate-200/80 dark:bg-slate-800 w-full my-1"></div>

          <!-- Content Card -->
          <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl text-left flex flex-col gap-3">
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">Target Member ID</div>
              <div class="flex items-center gap-1.5 mt-1.5">
                <svg class="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="text-sm font-bold text-slate-800 dark:text-slate-200">${userCreds?.savingsId || "N/A"}</span>
              </div>
            </div>

            <div class="h-[1px] bg-slate-200/50 dark:bg-slate-800/50 w-full my-1"></div>

            <div class="flex justify-between items-center text-xs">
              <span class="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-555">Transaction Amount</span>
              <span class="text-lg font-black text-slate-900 dark:text-white">
                ${formatCurrency(transactionData?.amountRemit || transactionData?.totalBalance || 0)} 
                <span class="text-[10px] font-bold text-slate-450 dark:text-slate-500">PHP</span>
              </span>
            </div>

            <div class="flex justify-between items-center text-xs mt-1">
              <span class="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-555">Date Initiated</span>
              <span class="font-bold text-slate-850 dark:text-slate-300">
                ${formatDate(transactionData?.remitDate || transactionData?.withdrawDate || new Date())}
              </span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-3 mt-4">
            <button id="custom-cancel-btn" type="button" class="px-5 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer">Cancel</button>
            <button id="custom-confirm-btn" type="button" class="px-5 py-2.5 ${confirmBtnColorClass} font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95">
              ${isReject 
                ? `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>`
                : `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>`
              }
              <span>${confirmBtnText}</span>
            </button>
          </div>
        </div>
      `,
      showConfirmButton: false,
      showCancelButton: false,
      customClass: {
        popup: 'rounded-3xl p-6 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-2xl max-w-[480px]'
      },
      background: isDarkMode() ? "#0f172a" : "#ffffff",
      didOpen: () => {
        document.getElementById('custom-cancel-btn')?.addEventListener('click', () => {
          Swal.close();
        });
        document.getElementById('custom-confirm-btn')?.addEventListener('click', () => {
          isConfirmed = true;
          Swal.close();
        });
      }
    });
  } else {
    isConfirmed = await swalModal({
      title: selected.title,
      html: `You are about to ${actionType.toLowerCase()} for Member ID: <b>${userCreds?.savingsId}</b>. <br/> Do you want to proceed?`,
      confirmButtonText: selected.btn,
      icon: "question",
    });
  }

  if (!isConfirmed) return;

  const payload = {
    savingsId: userCreds?.savingsId,
    reference: transactionData?.reference || "N/A",
    status: selected.status,
  };

  showAlert.loading("Processing...");

  ApproveData(payload, {
    onSuccess: (response) => {
      if (response?.success) {
        showAlert.success(selected.msg).then(() => {
          queryClient.invalidateQueries({ queryKey: ["/api/savings/summary"] });
          queryClient.invalidateQueries({
            queryKey: [`api/admin/savings/members/${savingsId}`],
          });

          queryClient.invalidateQueries({
            queryKey: ["notification_list"],
          });
          queryClient.invalidateQueries({
            queryKey: ["notifcount"],
          });
        });
      } else {
        showAlert.error("Failed", response.message);
      }
    },
    onError: (error) =>
      showAlert.error("Failed", "Something happened: " + error),
  });
};
