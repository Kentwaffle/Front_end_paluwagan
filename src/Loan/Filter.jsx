import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectDropdown from "../reusableComponents/selectdropdown";
import { formatDateForAPI } from "../reusableComponents/formatter";

function Filter({
  isFilterOpen,
  setFilterOpen,
  setStatus,
  setmethod,
  setStartdateFilter,
  setEnddateFilter,
}) {
  if (!isFilterOpen) return null;

  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setmethodFilter] = useState("");
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");

  const submitFilter = (e) => {
    e.preventDefault();
    setStatus(statusFilter);
    setmethod(methodFilter);
    setStartdateFilter(startDate);
    setEnddateFilter(endDate);
    setFilterOpen(false);
  };

  const statusfilterOptions = ["PAID", "FAILED"];
  const ModefilterOptions = ["GCASH", "MAYA"];

  return (
    <div className="p-5 fixed inset-0 overflow-y-auto z-[99] flex items-center justify-center bg-black/50 backdrop-blur">
      <div className="bg-white p-5 rounded-3xl w-full max-w-md h-fit my-auto shadow-2xl flex flex-col">
        <div className="flex justify-between">
          <span>Filter payment history</span>
          <div className="">
            <button
              className="bg-sky-200 text-sky-500 text-sm rounded-full px-2 py-1"
              onClick={setFilterOpen}
            >
              <span className="text-md font-semibold">X</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col my-3 ">
          <h1 className="font-semibold text-sm">Select date range</h1>
          <div className="flex items-center">
            <div className="relative">
              <DatePicker
                selected={startDate ? new Date(startDate) : null}
                onChange={(date) => setstartDate(formatDateForAPI(date))}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                scrollableYearDropdown
                placeholderText="Select date"
                className="input input-bordered w-full max-w-xs"
                portalId="root"
                popperClassName="!z-99"
              />
            </div>
            <div className=" divider divider-horizontal text-sky-500">to</div>
            <div>
              <DatePicker
                selected={endDate ? new Date(endDate) : null}
                onChange={(date) => setendDate(formatDateForAPI(date))}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                scrollableYearDropdown
                placeholderText="Select date"
                className="input input-bordered w-full max-w-xs"
                portalId="root"
                popperClassName="!z-99"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-5 ">
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-500 font-semibold">
              Filter status
            </label>
            <SelectDropdown
              name="status"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusfilterOptions}
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-500 font-semibold">
              Mode of payment
            </label>
            <SelectDropdown
              name="moodepayment"
              label="Mode of payment"
              value={methodFilter}
              onChange={(e) => setmethodFilter(e.target.value)}
              options={ModefilterOptions}
            />
          </div>
        </div>
        <button
          onClick={submitFilter}
          className="bg-sky-200 my-3 p-2 rounded-xl text-sky-500"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default Filter;
