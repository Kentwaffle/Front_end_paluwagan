import Swal from "sweetalert2";

const toast = Swal.mixin({
  confirmButtonColor: "#0ea5e9",
  cancelButtonColor: "#f87171",
});

export const showAlert = {
  success: (title, content) => {
    return toast.fire({
      icon: "success",
      title: title || "Success!",
      html: content,
    });
  },
  error: (title, text) => {
    return toast.fire({
      icon: "error",
      title: title || "Oops...",
      text: text || "Something went wrong!",
    });
  },
  warning: (title, text) => {
    return toast.fire({
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
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
    cancelButtonText: "Cancel",
    reverseButtons: true, // Para nasa kanan ang Confirm button
  });

  return result.isConfirmed; // Ibabalik nito ay true o false
};
