import { cn } from "@/lib/utils";

interface RequiredIndicatorProps {
    className?: string;
}

export function RequiredIndicator({ className }: RequiredIndicatorProps) {
    return (
        <span className={cn("inline-block -ml-1 text-xs text-red-500", className)}>
            *
        </span>
    );
}

