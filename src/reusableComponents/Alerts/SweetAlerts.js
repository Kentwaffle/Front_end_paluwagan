import Swal from "sweetalert2";

// Helper function para malaman kung dark mode ang user
const isDarkMode = () => document.documentElement.classList.contains("dark");

const getThemeColors = () => ({
  background: isDarkMode() ? "#0f172a" : "#ffffff", // Slate 900 vs White
  color: isDarkMode() ? "#f8fafc" : "#1e293b", // Slate 50 vs Slate 800
});

const toast = () =>
  Swal.mixin({
    confirmButtonColor: "#0ea5e9", // Sky 500
    cancelButtonColor: "#f87171",
    ...getThemeColors(), // Dito papasok yung dark mode colors
  });

export const showAlert = {
  success: (title, content) => {
    return toast().fire({
      icon: "success",
      title: title || "Success!",
      html: content,
    });
  },
  error: (title, text, buttonText = "OK") => {
    return toast().fire({
      icon: "error",
      title: title || "Oops...",
      text: text || "Something went wrong!",
      confirmButtonText: buttonText,
    });
  },
  warning: (title, text) => {
    return toast().fire({
      icon: "warning",
      title: title || "Warning",
      text: text,
    });
  },
  loading: (title = "Processing...", text = "Please wait") => {
    Swal.fire({
      title: title,
      html: text,
      allowOutsideClick: false,
      ...getThemeColors(), // Para pati loading dark mode
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },
  close: () => {
    Swal.close();
  },
};

export const swalModal = async ({
  title = "Are you sure?",
  text = "You won't be able to revert this!",
  icon = "warning",
  confirmButtonText = "Yes, proceed!",
  confirmButtonColor = "#0ea5e9",
  cancelButtonColor = "#ef4444",
  html,
}) => {
  const result = await Swal.fire({
    title,
    icon,
    html: html || text,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
    cancelButtonText: "Cancel",
    reverseButtons: true,
    ...getThemeColors(), // Apply dark theme
  });

  return result.isConfirmed;
};
