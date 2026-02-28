import { swalModal } from "../../reusableComponents/Alerts/SweetAlerts";
import { showAlert } from "../../reusableComponents/Alerts/SweetAlerts";

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
      msg: "Withdrawal Successfully!",
      btn: "Decline",
    },
  };

  const selected = config[actionType];

  const isConfirmed = await swalModal({
    title: selected.title,
    html: `You are about to ${actionType.toLowerCase()} for Member ID: <b>${userCreds?.savingsId}</b>. <br/> Do you want to proceed?`,
    confirmButtonText: selected.btn,
    icon: "question",
  });

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
        });
      } else {
        showAlert.error("Failed", response.message);
      }
    },
    onError: (error) =>
      showAlert.error("Failed", "Something happened: " + error),
  });
};
