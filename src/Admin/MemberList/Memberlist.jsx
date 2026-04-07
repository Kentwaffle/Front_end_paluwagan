import React, { useState } from "react";
import { Plus, Database } from "lucide-react";
import SearchInput from "../../reusableComponents/Forms/SearchInput";
import SelectDropdown from "../../reusableComponents/Forms/selectdropdown";
import MemberListCard from "./MemberListCard";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../serviceToApi/ApiEndpoint";
import { useInfiniteFetch } from "../../serviceToApi/InfiniteScroll";
import { useInfiniteAutoScroll } from "../../reusableComponents/Hooks/automaticScroll";
import { useDebounce } from "../../reusableComponents/Hooks/useBounce";

function Memberlist() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("User");
  const debouncedSearch = useDebounce(search, 500);
  const params = new URLSearchParams();

  const roleMap = { User: "ROLE_USER", Admin: "ROLE_ADMIN" };

  if (debouncedSearch) params.append("fullName", debouncedSearch);
  if (filter !== "All") params.append("role", roleMap[filter]);

  const queryString = params.toString();
  const activeEndpoint = queryString
    ? `${API_ENDPOINTS.ADMIN_MEMBERLIST}?${queryString}`
    : API_ENDPOINTS.ADMIN_MEMBERLIST;

  const {
    data: adminData,
    fetchNextPage: loadMoreAdmins,
    hasNextPage: hasMoreAdmins,
    isFetchingNextPage: loadingAdmins,
  } = useInfiniteFetch(["adminList", debouncedSearch, filter], activeEndpoint, {
    enabled: !!activeEndpoint,
    staleTime: 5000,
    gcTime: 0,
  });
  const cardContent = adminData?.pages.flatMap((page) => page.content) || [];
  const sentinel = useInfiniteAutoScroll(
    loadMoreAdmins,
    hasMoreAdmins,
    loadingAdmins,
    cardContent.length,
  );

  const totalElements = adminData?.pages?.[0]?.totalElements || 0;

  const memberHandle = (user_id) => {
    navigate(`/admin/memberlist/${user_id}`);
  };

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
            <MemberListCard
              content={content}
              key={index}
              memberHandle={() => memberHandle(content.user_id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 my-5">
            <span className="text-slate-500 dark:text-slate-400 font-medium text-lg italic">
              No records found
            </span>
          </div>
        )}
      </div>
      <div ref={sentinel} className=" flex items-center justify-center">
        {loadingAdmins ? (
          <span className="loading loading-dots text-sky-500"></span>
        ) : hasMoreAdmins ? (
          <p className="text-[10px] text-slate-300 uppercase tracking-widest animate-pulse">
            Scroll to load more
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default Memberlist;
