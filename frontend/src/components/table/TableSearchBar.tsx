import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

interface TableSearchBarProps {
  placeholder: string;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export default function TableSearchBar({placeholder, globalFilter, setGlobalFilter}: TableSearchBarProps) {
  return (
    <div className="relative rounded-md blur-bg">
      <Input
        className="peer h-10 w-full max-w-[300px] ps-8 pe-2"
        placeholder={placeholder}
        type="search"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <div className="text-primary pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
        <SearchIcon size={16} />
      </div>
    </div>
  )
}
