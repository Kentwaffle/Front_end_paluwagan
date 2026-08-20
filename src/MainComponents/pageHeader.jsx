//Dynamic Labels na to ya
export const PAGE_META = {
  "/notification": {
    title: "Notifications",
    description:
      "Stay updated with your latest loan approvals, savings activities, and account alerts.",
  },
  "/savings": {
    title: "Savings Overview",
    description: "Keep track of your active deposits and overall growth.",
  },
  "/loan": {
    title: (userName) => (
      <>
        Welcome back,{" "}
        <span className="text-sky-500 dark:text-sky-400">{userName}!</span>
      </>
    ),
    description:
      "Track your payment progression and manage active settlements.",
  },
  "/ledger": {
    title: "Ledger",
    description: "Review your full transaction history.",
  },
};
