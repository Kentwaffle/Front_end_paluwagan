import Error_img from "../assets/images/Error_img.png";

function Error({ error }) {
  const handlerelogin = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  const isExpired = error?.response?.data?.error === "EXPIRED_TOKEN";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-5 backdrop-blur-md bg-black/60">
      <div className="bg-white max-w-sm w-full p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center">
        <img
          src={Error_img}
          alt="Error"
          className="w-48 h-auto mb-6 drop-shadow-sm"
        />

        <div className="flex flex-col gap-3 mb-8">
          <h2 className="font-black text-2xl text-slate-800">
            {isExpired ? "Session Expired" : "Oops! Error"}
          </h2>
          <p className="text-slate-500 leading-relaxed px-4">
            {isExpired
              ? "Your session has ended for your security. Please log in again."
              : error?.message ||
                "An unexpected error occurred. Please log in again."}
          </p>
        </div>

        <button
          onClick={handlerelogin}
          className="w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-200 transition-all duration-200"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default Error;
