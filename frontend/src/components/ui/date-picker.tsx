import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
    value?: Date;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    "aria-invalid"?: boolean;
}

const DatePicker = ({
    value,
    onChange,
    placeholder = "Pick a date",
    className,
    disabled = false,
    "aria-invalid": ariaInvalid,
}: DatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dateValue = value ?? undefined;

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            // Set to midnight to normalize the date (time doesn't matter for date-only)
            const newDate = new Date(date);
            newDate.setHours(0, 0, 0, 0);
            onChange(newDate);
        } else {
            onChange(undefined);
        }
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", className)}
                    type="button"
                    disabled={disabled}
                    aria-invalid={ariaInvalid}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateValue ? format(dateValue, "PPP") : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-100" align="start">
                <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={handleDateSelect}
                    disabled={disabled}
                />
            </PopoverContent>
        </Popover>
    );
};

export { DatePicker };

