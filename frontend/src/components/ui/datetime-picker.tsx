import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
    value?: Date;
    onChange: (date: Date) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    "aria-invalid"?: boolean;
}

const DateTimePicker = ({
    value,
    onChange,
    placeholder = "Pick a date",
    className,
    disabled = false,
    "aria-invalid": ariaInvalid,
}: DateTimePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dateValue = value ?? undefined;
    // Check if time is at midnight (00:00:00) and was likely set automatically (not by user)
    // We'll show empty time if it's exactly midnight with 0 seconds and milliseconds
    const isAutoMidnight = dateValue && 
        dateValue.getHours() === 0 && 
        dateValue.getMinutes() === 0 && 
        dateValue.getSeconds() === 0 && 
        dateValue.getMilliseconds() === 0;
    const timeValue = dateValue && !isAutoMidnight ? format(dateValue, "HH:mm") : "";

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            const newDate = new Date(date);
            // If there's an existing date with a time (not auto-midnight), preserve the time
            if (dateValue && !isAutoMidnight) {
                newDate.setHours(dateValue.getHours());
                newDate.setMinutes(dateValue.getMinutes());
            } else {
                // Set to midnight (00:00:00) to indicate "date only, no time selected"
                newDate.setHours(0, 0, 0, 0);
            }
            onChange(newDate);
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!dateValue) {
            // If no date is selected, create a new date with today + selected time
            const [hours, minutes] = e.target.value.split(":").map(Number);
            const newDate = new Date();
            newDate.setHours(hours || 0);
            newDate.setMinutes(minutes || 0);
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
            onChange(newDate);
        } else {
            // Update time on existing date
            const [hours, minutes] = e.target.value.split(":").map(Number);
            const newDate = new Date(dateValue);
            newDate.setHours(hours || 0);
            newDate.setMinutes(minutes || 0);
            onChange(newDate);
        }
    };

    return (
        <div className={cn("flex flex-row gap-2", className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="flex-1 justify-start text-left font-normal"
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
            <Input
                type="time"
                value={timeValue}
                onChange={handleTimeChange}
                className="w-32"
                disabled={disabled}
                aria-invalid={ariaInvalid}
            />
        </div>
    );
};

export { DateTimePicker };

