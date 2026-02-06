import { CircleCheck, CircleEllipsis, CircleX } from "lucide-react";
export const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "badge-success";
    case "pending":
      return "badge-warning";
    case "failed":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

export const statusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return <CircleCheck size={15} />;
    case "pending":
      return <CircleEllipsis size={15} />;
    case "failed":
      return <CircleX size={15} />;
    default:
      return null;
  }
};
