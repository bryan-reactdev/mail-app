import { Separator } from "@/components/ui/separator"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormSectionHeaderProps {
    icon?: LucideIcon
    title: string
    className?: string
    separatorClassName?: string
}

export const FormSectionHeader = ({
    icon: Icon,
    title,
    className,
    separatorClassName,
}: FormSectionHeaderProps) => {
    return (
        <>
            <h1 className={cn("flex items-center gap-2 text-md !mb-0 mt-8 text-muted-foreground pointer-events-none select-none", className)}>
                {Icon && <Icon className="text-muted-foreground" size={16} />}
                {title}
            </h1>
            <Separator className={cn("mt-2 mb-2", separatorClassName)} />
        </>
    )
}




