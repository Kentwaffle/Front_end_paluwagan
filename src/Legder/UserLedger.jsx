import { useEffect, useState, useMemo } from "react";
import LedgerList from "../reusableComponents/Display/LedgerList";
import { useFetchData } from "../serviceToApi/fetchData";
import { API_ENDPOINTS } from "../serviceToApi/ApiEndpoint";
import { Logs } from "lucide-react";
import {
  formatTimeAgo,
  formatDateTime,
  formatFullDate,
} from "../reusableComponents/Utils/TimeDateformat";
import Pagination from "../reusableComponents/Display/Pagination";
import Inputform from "../reusableComponents/Forms/Inputform";
import SelectDropdown from "../reusableComponents/Forms/selectdropdown";
import { useDebounce } from "../reusableComponents/Hooks/useBounce";
import { buildQueryString } from "../reusableComponents/Utils/queryHelper";
import { useInfiniteFetch } from "../serviceToApi/InfiniteScroll";
import { useInfiniteAutoScroll } from "../reusableComponents/Hooks/automaticScroll";
import { useMediaQuery } from "../reusableComponents/Hooks/mediaQuery";
import { useAuth } from "../auth/Auth";

function UserLedger() {
  const [data, setData] = useState(); // undefined
  // const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMoreMembers, setHasMoreMembers] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [filteredData, setFilteredData] = useState({
    reference: "",
    description: "",
    paymentMethod: "",
  });
  const { user } = useAuth();

  const debouncedReference = useDebounce(filteredData.reference, 500);

  const ledgerQueryString = buildQueryString(
    { ...filteredData, reference: debouncedReference },
    currentPage,
  );

  const hasActiveFilters =
    filteredData.reference ||
    filteredData.description ||
    filteredData.paymentMethod;

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const {
    data: filteredLedgerData,
    isFetching: filteredLoading,
    error: filteredError,
  } = useFetchData(
    hasActiveFilters
      ? ["FILTERED_LEDGER", ledgerQueryString]
      : ["USER_LEDGER", currentPage],
    hasActiveFilters
      ? `${API_ENDPOINTS.LEDGER.FILTER_LEDGER}?${ledgerQueryString}`
      : `${API_ENDPOINTS.LEDGER.USER_LEDGER}?page=${currentPage}`,
    { enabled: isDesktop, staleTime: 5000, gcTime: 0 },
  );

  console.log("isDesktop:", isDesktop);

  const {
    data: infiniteLedgerData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteFetch(
    hasActiveFilters
      ? ["FILTERED_LEDGER_INFINITE", ledgerQueryString]
      : ["USER_LEDGER_INFINITE"],
    hasActiveFilters
      ? `${API_ENDPOINTS.LEDGER.FILTER_LEDGER}?${ledgerQueryString}`
      : API_ENDPOINTS.LEDGER.USER_LEDGER,
    { enabled: !isDesktop },
  );

  const InfiniteLedgerData =
    infiniteLedgerData?.pages.flatMap(
      (page) => page.content || page.ledger || [],
    ) || [];

  const sentinelRef = useInfiniteAutoScroll(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    InfiniteLedgerData.length,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedReference,
    filteredData.description,
    filteredData.paymentMethod,
  ]);

  useEffect(() => {
    if (filteredLedgerData?.totalPages) {
      setTotalPages(filteredLedgerData.totalPages);
    }
  }, [filteredLedgerData]);

  // if (loading) return <div className="p-5">Loading...</div>;
  // if (error) return <div className="p-5">Error: {error.message}</div>;

  const AllLedgerData =
    filteredLedgerData?.ledger || filteredLedgerData?.content || [];
  const totalElements = filteredLedgerData?.totalElements || 0;
  const startItem = (currentPage - 1) * 10 + 1;
  const endItem = Math.min(currentPage * 10, totalElements);
  const hasData = isDesktop
    ? AllLedgerData?.length > 0
    : InfiniteLedgerData?.length > 0;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-500 text-slate-900 dark:text-white">
      <div className="hidden md:block border-b border-slate-200/60 dark:border-slate-800/80 pb-5 mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Activity Audit
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review complete transaction footprints, verified historical logs, and
          ledger status values.
        </p>
      </div>
      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end mb-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
          {hasActiveFilters && (
            <button
              onClick={() => {
                setFilteredData({
                  reference: "",
                  description: "",
                  paymentMethod: "",
                });
                setCurrentPage(1);
              }}
              className="text-sm font-semibold bg-red-50 rounded-xl p-2 cursor-pointer text-red-500 hover:text-red-700 dark:hover:text-slate-300"
            >
              Clear Filters
            </button>
          )}
          <div className="lg:flex items-center gap-4 ">
            <span className="text-sm font-semibold text-slate-500 shrink-0">
              Search
            </span>

            <Inputform
              type="text"
              value={filteredData.reference}
              name="reference"
              onChange={(e) =>
                setFilteredData({ ...filteredData, reference: e.target.value })
              }
              placeholder="Reference"
            />
          </div>
          <div className="flex gap-2 lg:flex-row lg:items-center lg:justify-end">
            <div className="flex flex-col gap-3 flex-1 lg:flex-row lg:items-center lg:justify-end">
              <span className="text-sm font-semibold text-slate-500 shrink-0">
                Transaction Type
              </span>
              <SelectDropdown
                name="description"
                value={filteredData.description}
                onChange={(e) =>
                  setFilteredData({
                    ...filteredData,
                    description: e.target.value,
                  })
                }
                label="All types"
                options={["Loan", "Savings", "Withdrawal", "Completed"]}
              />
            </div>

            <div className="flex flex-col gap-3 flex-1 lg:ml-4 lg:flex-row lg:items-center lg:justify-end">
              <span className="text-sm font-semibold text-slate-500 shrink-0">
                Payment method
              </span>
              <SelectDropdown
                name="paymentMethod"
                value={filteredData.paymentMethod}
                onChange={(e) =>
                  setFilteredData({
                    ...filteredData,
                    paymentMethod: e.target.value,
                  })
                }
                label="All methods"
                options={["CASH", "GCASH", "MAYA", "QRPH"]}
                className="lg:w-30"
              />
            </div>
          </div>
        </div>
      </div>

      <>
        {hasData ? (
          <LedgerList
            ledgerData={AllLedgerData}
            mobileLedgerData={InfiniteLedgerData}
            formatDate={formatDateTime}
            formatTimeAgo={formatTimeAgo}
            formatFullDate={formatFullDate}
            sentinelRef={sentinelRef}
            loadingMembers={isFetchingNextPage}
            hasMoreMembers={hasNextPage}
            isLoading={filteredLoading}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 opacity-50">
            <div className="p-5 bg-slate-100 dark:bg-slate-800 rounded-full mb-3 shadow-inner">
              <Logs size={28} className="text-slate-400" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              No Transactions
            </p>
          </div>
        )}
        {totalPages > 1 && (
          <div className="hidden lg:flex justify-between items-center mt-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Showing {startItem}-{endItem} of {totalElements}
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </>
      {/* <LedgerList ledgerData={ledgerData} /> */}
    </div>
  );
}

export default UserLedger;
