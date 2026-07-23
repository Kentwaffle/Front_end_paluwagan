import { WalletCards, CheckCircle2, CreditCard } from "lucide-react";

export const statusColors = {
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

export const transactionIcons = {
  Withdrawal: <WalletCards size={18} className="text-rose-500" />,
  Completed: <CheckCircle2 size={18} className="text-sky-500" />,
  Default: <CreditCard size={18} className="text-emerald-500" />,
};

export const typeBadgeStyles = {
  Loan: "bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300",
  Completed: "bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
  Withdrawal: "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300",
  Savings: "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300",
  Default:
    "bg-slate-50 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300",
};

export const getStatusColor = (type, description) =>
  statusColors[type][description] || statusColors[type].Default;

export const getTransactionIcon = (description) =>
  transactionIcons[description] || transactionIcons.Default;

export const getTypeBadge = (description) =>
  typeBadgeStyles[description] || typeBadgeStyles.Default;
