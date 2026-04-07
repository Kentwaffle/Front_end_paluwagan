import React from "react";
import DatePickerField from "./Datepicker";
import SearchInput from "./SearchInput";
import { Search } from "lucide-react";
import { useFetchData } from "../../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";

function SeeAllPayments({
  refSearch,
  setRefSeach,
  startDateFilter,
  setStartdateFilter,
  endDateFilter,
  setEnddateFilter,
  handleFilterSaving,
}) {
  return (
    <div className="flex flex-col gap-3 bg-white p-5 shadow-sm rounded-xl">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center mb-1">
          <label className="text-slate-500 font-semibold text-sm tracking-wider">
            Search reference
          </label>
        </div>
        <SearchInput
          value={refSearch}
          onChange={(e) => setRefSeach(e.target.value)}
          placeholder="Search reference number..."
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-slate-500 font-semibold text-sm tracking-wider">
          Date Range
        </label>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <DatePickerField
              name="startDateFilter"
              value={startDateFilter}
              onChange={(e) => setStartdateFilter(e.target.value)}
            />
          </div>
          <span className="text-slate-300 text-sm">to</span>
          <div className="relative">
            <DatePickerField
              name="endDateFilter"
              value={endDateFilter}
              onChange={(e) => setEnddateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={handleFilterSaving}
        className="shadow-blue-200/50 bg-gradient-to-r from-sky-500 to-sky-600 py-3 text-white rounded-xl shadow flex items-center justify-center gap-2"
      >
        Search
        <Search size={15} />
      </button>
    </div>
  );
}

export default SeeAllPayments;
