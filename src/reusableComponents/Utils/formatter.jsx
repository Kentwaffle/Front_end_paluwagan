export const formatDate = (dateString) => {
  // 1. Check if actually empty or null
  if (!dateString) return null;

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "No Date";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Date formatting error:", error);
    return null;
  }
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount || 0);
};

export const formatMonthDay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const formatDateForAPI = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  return d.toLocaleDateString("en-CA");
};
