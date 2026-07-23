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
    infiniteLedgerData?.pages.flatMap((page) => page.ledger || []) || [];

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
  console.log("filteredLedgerData:", filteredLedgerData);
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
          <div className="flex items-center gap-4">
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
          <div className="lg:ml-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
            <span className="text-sm font-semibold text-slate-500 shrink-0">
              Status
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
              label="Status"
              options={["Loan", "Savings", "Withdrawal", "Completed"]}
            />
          </div>
          <div className="lg:ml-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
            <span className="text-sm font-semibold text-slate-500 shrink-0">
              Method
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
              label="Method"
              options={["CASH", "GCASH", "MAYA", "QRPH"]}
            />
          </div>
        </div>
      </div>

      <>
        {AllLedgerData?.length > 0 ? (
          <LedgerList
            ledgerData={AllLedgerData}
            // statusColors={statusColors}
            // transactionIcons={transactionIcons}
            formatDate={formatDateTime}
            formatTimeAgo={formatTimeAgo}
            formatFullDate={formatFullDate}
            sentinelRef={sentinelRef}
            // loadingMembers={loadingMembers}
            // hasMoreMembers={hasMoreMembers}
            isLoading={filteredLoading}
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
        {totalPages > 1 && (
          <div className="hidden lg:flex justify-end mt-4">
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
