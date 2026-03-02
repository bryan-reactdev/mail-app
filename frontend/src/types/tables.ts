import type { ColumnDef } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";

// Extended ColumnDef with custom properties
export type ExtendedColumnDef<TData = unknown, TValue = unknown> = ColumnDef<TData, TValue> & {
    centered?: boolean;
} & Record<string, any>;

export interface Tab {
    label: string
    columnDefinitions: ColumnDef<unknown>[]
    card: React.ComponentType<any>
    data: any[]
    content: any | {
        text: string
        total: number
        size: number
    }
}

export interface TabTooltip {
    label: string
    text?: string
    value?: number
}

export interface CardTab {
    icon: LucideIcon
    iconBgColor?: string
    label: string
    columnDefinitions: ColumnDef<unknown>[]
    card: React.ComponentType<any>
    data: any[]
    content: any | {
        text: string
        total: number
        size: number
    }
    contentTooltip: TabTooltip[]
}



