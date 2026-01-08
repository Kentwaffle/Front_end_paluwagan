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
};
