import { useNavigate } from "react-router-dom";
import { Landmark, PiggyBank } from "lucide-react";

function LoanFundsMain() {
  const navigate = useNavigate();

  const handleChangeType = (newType) => {
    navigate(`/admin/funds_management/${newType}`);
  };

  return (
    <div className="min-h-screen p-5 md:p-10 flex flex-col justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* MOBILE VIEW */}
      <div className="block md:hidden">
        <h1 className="text-lg text-center font-black text-slate-700 dark:text-gray-300 mb-5">
          Choose Transaction Type
        </h1>
        <div className="flex flex-col w-50 mx-auto">
          <button
            type="button"
            onClick={() => handleChangeType("loanAddPayment")}
            className="bg-sky-500 text-white py-3 px-5 rounded-lg active:scale-95 transition-transform dark:bg-sky-400 dark:text-gray-800"
          >
            Loan add payment
          </button>
          <div className="divider m-3 text-sky-500 dark:text-sky-400 font-black dark:before:bg-gray-700 dark:after:bg-gray-700">
            or
          </div>
          <button
            type="button"
            onClick={() => handleChangeType("savingsAddPayment")}
            className="bg-sky-500 text-white py-3 px-5 rounded-lg active:scale-95 transition-transform dark:bg-sky-400 dark:text-gray-800"
          >
            Savings add Payment
          </button>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:flex flex-col items-center justify-center min-h-[70vh] text-center">
        
        {/* Title Badge */}
        <span className="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-blue-100 dark:border-blue-900/30">
          Transaction Gateway
        </span>

        {/* Heading */}
        <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
          Select Transaction Type
        </h1>
        
        {/* Subtitle */}
        <p className="text-sm text-slate-550 dark:text-slate-400 font-medium mt-2 max-w-md">
          Choose the destination for this payment to proceed with the transaction.
        </p>

        {/* Selection Cards */}
        <div className="flex gap-6 mt-10 max-w-4xl w-full justify-center">
          
          {/* Loan Add Payment Card */}
          <div
            onClick={() => handleChangeType("loanAddPayment")}
            className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col items-start text-left w-[340px] relative overflow-hidden cursor-pointer hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500/50 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 select-none group"
          >
            {/* Corner Deco */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-slate-50 dark:bg-slate-850 rounded-full group-hover:bg-blue-50/50 dark:group-hover:bg-blue-950/20 transition-colors duration-300"></div>
            
            {/* Icon */}
            <div className="w-12 h-12 bg-white dark:bg-slate-850 border border-slate-150 dark:border-slate-750 text-slate-800 dark:text-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm mb-6 transition-colors group-hover:border-blue-200 dark:group-hover:border-blue-900/50">
              <Landmark size={20} className="text-slate-700 dark:text-slate-350" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-850 dark:text-white mb-2">
              Loan add payment
            </h3>

            {/* Subtitle */}
            <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed font-semibold">
              Record a payment towards an existing, active loan account balance.
            </p>
          </div>

          {/* Savings Add Payment Card */}
          <div
            onClick={() => handleChangeType("savingsAddPayment")}
            className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col items-start text-left w-[340px] relative overflow-hidden cursor-pointer hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500/50 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 select-none group"
          >
            {/* Corner Deco */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-slate-50 dark:bg-slate-850 rounded-full group-hover:bg-blue-50/50 dark:group-hover:bg-blue-950/20 transition-colors duration-300"></div>

            {/* Icon */}
            <div className="w-12 h-12 bg-white dark:bg-slate-850 border border-slate-150 dark:border-slate-750 text-slate-800 dark:text-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm mb-6 transition-colors group-hover:border-blue-200 dark:group-hover:border-blue-900/50">
              <PiggyBank size={20} className="text-slate-700 dark:text-slate-350" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-850 dark:text-white mb-2">
              Savings add payment
            </h3>

            {/* Subtitle */}
            <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed font-semibold">
              Deposit funds directly into a member's designated savings account.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default LoanFundsMain;
