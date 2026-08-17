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
    <div className="min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* MOBILE VIEW */}
      <div className="block md:hidden">
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
        
        <div className="flex items-center justify-between mx-2 mb-3 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
              Filter by:
            </span>
            <SelectDropdown
              name="filter"
              label={"Filter"}
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
              options={["All", "User", "Admin"]}
              className={"h-7 rounded-lg border-slate-200 text-sm"}
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
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:flex flex-col gap-6 text-left">
        
        {/* Header Section */}
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col text-left">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              User Directory
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Manage and review all registered accounts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <SearchInput
              name="search"
              placeholder="Search name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs h-11 text-xs dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            />
            <button
              onClick={() => navigate("addAdmin")}
              className="h-11 px-6 flex justify-center items-center gap-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded-xl active:scale-95 transition-all text-xs font-bold shadow-sm"
            >
              <Plus size={16} /> Admin
            </button>
          </div>
        </div>

        {/* Filter Row Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap">
              FILTER BY:
            </span>
            <SelectDropdown
              name="filter"
              label={"User Role"}
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
              options={["All", "User", "Admin"]}
              className="h-10 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-xs font-medium focus:border-blue-500"
            />
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {`${totalElements} TOTAL`}
          </span>
        </div>

        {/* 2-Column Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cardContent && cardContent.length > 0 ? (
            cardContent.map((content, index) => (
              <MemberListCard
                content={content}
                key={index}
                memberHandle={() => memberHandle(content.user_id)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm my-2">
              <span className="text-slate-400 dark:text-slate-500 font-medium text-sm italic">
                No records found
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Sentinel Loader Scroll */}
      <div ref={sentinel} className="flex items-center justify-center mt-6">
        {loadingAdmins ? (
          <span className="loading loading-dots text-blue-600"></span>
        ) : hasMoreAdmins ? (
          <p className="text-[10px] text-slate-400 uppercase tracking-widest animate-pulse font-bold">
            Scroll to load more
          </p>
        ) : null}
      </div>

    </div>
  );
}

export default Memberlist;
