import { CircleCheck, CircleEllipsis, CircleX } from "lucide-react";
export const statusColor = (status) => {
  switch (status) {
    case "APPROVED":
      return "badge-success";
    case "PENDING":
      return "badge-warning";
    case "REJECTED":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

export const statusColorPayments = (status) => {
  switch (status) {
    case "PAID":
      return "badge-success";
    case "FAILED":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};
export const statusIconPayments = (status) => {
  switch (status) {
    case "PAID":
      return <CircleCheck size={15} />;
    case "FAILED":
      return <CircleX size={15} />;
    default:
      return null;
  }
};

export const statusIcon = (status) => {
  switch (status) {
    case "APPROVED":
      return <CircleCheck size={15} />;
    case "PENDING":
      return <CircleEllipsis size={15} />;
    case "REJECTED":
      return <CircleX size={15} />;
    default:
      return null;
  }
};

export const tabsColor = (status) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-600";
    case "PENDING":
      return "bg-orange-100 text-orange-400";
    case "REJECTED":
      return "bg-red-200 text-red-500";
    default:
      return null;
  }
};

export const tabsBorder = (status) => {
  switch (status) {
    case "APPROVED":
      return "border-green-500 bg-green-100 text-green-600";
    case "PENDING":
      return "border-orange-500 bg-orange-100 text-orange-400";
    case "REJECTED":
      return "border-red-500 bg-red-200 text-red-500";
    default:
      return null;
  }
};
