import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface SearchbarProps {
  className?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function Searchbar({className, placeholder, value, onChange}: SearchbarProps) {
  return (
    <div className={cn("relative rounded-md blur-bg", className)}>
      <Input
        className="peer h-10 w-full w-full ps-8 pe-2"
        placeholder={placeholder}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="text-primary pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
        <SearchIcon size={16} />
      </div>
    </div>
  )
}
