import { useNavigate } from "react-router-dom";

function LoanFundsMain() {
  const navigate = useNavigate();

  const handleChangeType = (newType) => {
    navigate(`/admin/funds_management/addPayment/${newType}`);
  };

  return (
    <div className="min-h-screen p-5">
      <h1 className="text-lg text-center font-black text-slate-700 dark:text-gray-300 mb-5">
        Choose Transaction Type
      </h1>
      <div className="flex flex-col w-50  mx-auto">
        <button
          type="button"
          onClick={() => handleChangeType("loan")}
          className="bg-sky-500 text-white py-3 px-5 rounded-lg  active:scale-95 transition-transform dark:bg-sky-400 dark:text-gray-800"
        >
          Loan add payment
        </button>
        <div className="divider m-3 text-sky-500 dark:text-sky-400 font-black dark:before:bg-gray-700 dark:after:bg-gray-700">
          or
        </div>
        <button
          type="button"
          onClick={() => handleChangeType("savings")}
          className="bg-sky-500 text-white py-3 px-5 rounded-lg  active:scale-95 transition-transform dark:bg-sky-400 dark:text-gray-800"
        >
          Savings add Payment
        </button>
      </div>
    </div>
  );
}

export default LoanFundsMain;
