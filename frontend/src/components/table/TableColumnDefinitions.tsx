import type { CellContext } from "@tanstack/react-table";
import type { ExtendedColumnDef } from "@/types/tables";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import React from "react";
import { RippleButton, RippleButtonRipples } from "../animate-ui/components/buttons/ripple";
import { Ellipsis } from "lucide-react";

export const AccionesColumn = (accessorKey: string, buttons: React.ReactNode[]): ExtendedColumnDef<any> => ({
    accessorKey: accessorKey,
    cell: (props: CellContext<any, any>) => {
        const rowData = props.row.original;
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <RippleButton className="bg-transparent text-primary shadow-none hover:text-secondary" variant='default'>
                        <Ellipsis />
                        <RippleButtonRipples />
                    </RippleButton>
                </PopoverTrigger>
                <PopoverContent 
                    side="bottom" 
                    align="end" 
                    className='w-[200px] flex flex-col gap-2 !p-1 ring-1 ring-primary/10'
                >
                    {buttons.map((button, index) => (
                        <React.Fragment key={index}>
                            {React.isValidElement(button) 
                                ? React.cloneElement(button as React.ReactElement<any>, { rowData })
                                : button
                            }
                        </React.Fragment>
                    ))}
                </PopoverContent>
            </Popover>
        );
    },
    size: 100,
    enableSorting: false,
    centered: true
})

/**
 * Standard ID column definition
 */
export const IdColumn = <T extends { id: number | string }>(): ExtendedColumnDef<T> => ({
    id: "id",
    accessorKey: "id",
    header: "ID",
    size: 80,
})

/**
 * Standard text column definition
 */
export const TextColumn = <T,>(
    accessorKey: keyof T,
    header: string,
    size: number = 150
): ExtendedColumnDef<T> => ({
    id: String(accessorKey),
    accessorKey: String(accessorKey),
    header: header,
    size: size,
})

/**
 * Standard email column definition
 */
export const EmailColumn = <T extends { email: string }>(): ExtendedColumnDef<T> => ({
    id: "email",
    accessorKey: "email",
    header: "Email",
    size: 200,
})

/**
 * Column with custom cell rendering
 */
export const CustomCellColumn = <T,>(
    accessorKey: keyof T,
    header: string,
    cellRenderer: (props: CellContext<T, any>) => React.ReactNode,
    size: number = 150
): ExtendedColumnDef<T> => ({
    id: String(accessorKey),
    accessorKey: String(accessorKey),
    header: header,
    size: size,
    cell: cellRenderer,
})


