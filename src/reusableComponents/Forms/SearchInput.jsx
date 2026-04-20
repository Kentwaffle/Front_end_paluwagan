import { Search } from "lucide-react";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <label
      className={`input rounded-xl w-full flex items-center gap-2 bg-white px-4 py-2 shadow-sm focus-within:border-sky-500 transition-all ${className}`}
    >
      <Search
        className="opacity-30 text-slate-500 dark:text-slate-400"
        size={18}
      />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="grow outline-none text-sm text-slate-700 bg-transparent dark:text-slate-200 dark:placeholder:text-slate-500 w-full"
      />
    </label>
  );
};

export default SearchInput;
