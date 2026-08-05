import { formatDistanceToNow } from "date-fns";

export const formatTimeAgo = (date) => {
  if (!date) return "";

  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
    }).replace("about ", "");
  } catch (error) {
    console.error("Invalid date passed to formatTimeAgo:", date);
    return "Invalid date";
  }
};

export const formatDateTime = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  return date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
};

export const formatFullDate = (isoString) => {
  if (!isoString) return "";

  try {
    const date = new Date(isoString);

    // I-check kung valid date ang napasa
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
      month: "long", // Lalabas: "January"
      day: "numeric", // Lalabas: "12"
      year: "numeric", // Lalabas: "2026"
    });
  } catch (error) {
    console.error("Error formatting full date:", error);
    return "Invalid date";
  }
};
