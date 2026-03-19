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
