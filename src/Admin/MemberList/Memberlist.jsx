import React, { useState } from "react";
import { Plus, Database } from "lucide-react";
import SearchInput from "../../reusableComponents/SearchInput";
import SelectDropdown from "../../reusableComponents/selectdropdown";
import MemberListCard from "./MemberListCard";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { useFetchData } from "../../serviceToApi/fetchData";
import { useInfiniteFetch } from "../../serviceToApi/InfiniteScroll";
import { useInfiniteAutoScroll } from "../../reusableComponents/Hooks/automaticScroll";
import { useDebounce } from "../../reusableComponents/Hooks/useBounce";
function Memberlist() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const debouncedSearch = useDebounce(search, 500);
  const params = new URLSearchParams();

  const roleMap = { User: "ROLE_USER", Admin: "ROLE_ADMIN" };

  if (debouncedSearch) params.append("name", debouncedSearch);
  if (filter !== "All") params.append("role", roleMap[filter]);

  const queryString = params.toString();
  const activeEndpoint = queryString
    ? `${API_ENDPOINTS.ADMIN_MEMBERLIST}?${queryString}`
    : API_ENDPOINTS.ADMIN_MEMBERLIST;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteFetch(["memberlist", debouncedSearch, filter], activeEndpoint);

  const sentinel = useInfiniteAutoScroll(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

  const cardContent = data?.pages.flatMap((page) => page.content) || [];
  const totalElements = data?.pages?.[0]?.totalElements || 0;

  return (
    <div className="p-5 min-h-screen">
      <header className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          <SearchInput
            name="search"
            placeholder="Search name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => navigate("addAdmin")}
          className="shadow-md h-10 px-4 flex justify-center items-center gap-1 text-white bg-sky-500 rounded-xl active:scale-95 transition-all text-sm font-bold"
        >
          <Plus size={18} /> Admin
        </button>
      </header>
      <div className="flex items-center justify-between mx-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="  text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
            Filter by:
          </span>
          <SelectDropdown
            name="filter"
            label={"Filter"}
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
            options={["All", "User", "Admin"]}
            className={"h-7  rounded-lg border-slate-200 text-sm"}
          />
        </div>

        <span className="text-[10px] font-bold text-slate-400 uppercase">
          {`${totalElements} total`}
        </span>
      </div>
      <div className="space-y-2">
        {cardContent && cardContent.length > 0 ? (
          cardContent.map((content, index) => (
            <MemberListCard content={content} key={index} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 my-5">
            <span className="text-slate-500 dark:text-slate-400 font-medium text-lg italic">
              No records found
            </span>
          </div>
        )}
      </div>

      <div ref={sentinel} className="flex items-center justify-center ">
        {isFetchingNextPage ? (
          <span className="loading loading-dots"></span>
        ) : (
          hasNextPage && <p className="text-xs italic">Loading more...</p>
        )}
      </div>
    </div>
  );
}

export default Memberlist;
