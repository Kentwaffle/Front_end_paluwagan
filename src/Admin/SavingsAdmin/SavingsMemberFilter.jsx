import React from "react";
import SeeAllPayments from "../../reusableComponents/SeeAllPayments";
import MemberCard from "./MemberCard";
function SavingsMemberFilter() {
  return (
    <div className="min-h-screen p-5">
      <div className=" my-3 text-slate-700 font-semibold">
        Member Savings Accounts
      </div>
      <SeeAllPayments
      // refSearch={refSearch}
      // setRefSeach={setRefSeach}
      // startDateFilter={startDateFilter}
      // setStartdateFilter={setStartdateFilter}
      // endDateFilter={endDateFilter}
      // setEnddateFilter={setEnddateFilter}
      // handleFilterSaving={handleFilterSaving}
      />

      {/* <MemberCard
        key={member.savingId || member.savingsId}
        member={member}
        onAction={hanldeShowMemberPayment}
        formatCurrency={formatCurrency}
        getProfileImage={getProfileImage}
      /> */}
    </div>
  );
}

export default SavingsMemberFilter;
