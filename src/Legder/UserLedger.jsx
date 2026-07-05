import React from "react";
import LedgerList from "../reusableComponents/Display/LedgerList";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
function UserLedger() {
  const {
    data: UserledgerData,
    loading,
    error,
  } = useFetchData("LEDGER", API_ENDPOINTS.LEDGER.USER_LEDGER);

  if (loading) return <div className="p-5">Loading...</div>;
  if (error) return <div className="p-5">Error: {error.message}</div>;

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">User Ledger</h2>
      <>
        {UserledgerData.length > 0 ? (
          <LedgerList
            ledgerData={UserledgerData}
            statusColors={statusColors}
            transactionIcons={transactionIcons}
            formatTimeAgo={formatTimeAgo}
            sentinelRef={sentinelRef}
            loadingMembers={loadingMembers}
            hasMoreMembers={hasMoreMembers}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 opacity-50">
            <div className="p-5 bg-slate-100 dark:bg-slate-800 rounded-full mb-3 shadow-inner">
              <Logs size={28} className="text-slate-400" />
            </div>
            <p className=" text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              No Transactions
            </p>
          </div>
        )}
      </>
      {/* <LedgerList ledgerData={ledgerData} /> */}
    </div>
  );
}

export default UserLedger;
