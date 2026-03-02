import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
  placeholder: string;
  globalFilter: string;
  setGlobalFilter: (globalFilter: string) => void;
}

export default function SearchBar({placeholder, globalFilter, setGlobalFilter}: SearchBarProps) {
  return (
  <div className="flex flex-row items-center gap-2">
    <div className="relative max-w-[300px] h-[40px]">
        <Input
            className="peer h-full w-full max-w-full ps-8 pe-2 !bg-white/10"
            placeholder={placeholder}
            type="search"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
            <SearchIcon size={16} />
        </div>
    </div>
  </div>
  )
}



