import { CircleCheck, CircleEllipsis, CircleX } from "lucide-react";

export const statusColor = (status) => {
  switch (status) {
    case "APPROVED":
      return "badge-success"; // DaisyUI handle na 'to
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
      return (
        <div className="text-emerald-500 bg-emerald-50 p-2 rounded-full dark:bg-emerald-950/50 dark:text-emerald-400">
          <CircleCheck size={25} />
        </div>
      );
    case "FAILED":
      return (
        <div className="text-red-500 bg-red-50 p-2 rounded-full dark:bg-red-950/50 dark:text-red-400">
          <CircleX size={25} />
        </div>
      );
    default:
      return "No status";
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
      return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
    case "PENDING":
      return "bg-orange-100 text-orange-400 dark:bg-orange-900/30 dark:text-orange-300";
    case "REJECTED":
      return "bg-red-200 text-red-500 dark:bg-red-900/40 dark:text-red-400";
    default:
      return "dark:text-gray-400";
  }
};

export const tabsBorder = (status) => {
  switch (status) {
    case "APPROVED":
      return "border-green-500 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 dark:border-green-600";
    case "PENDING":
      return "border-orange-500 bg-orange-100 text-orange-400 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-600";
    case "REJECTED":
      return "border-red-500 bg-red-200 text-red-500 dark:bg-red-900/40 dark:text-red-400 dark:border-red-600";
    default:
      return "dark:border-gray-700";
  }
};
