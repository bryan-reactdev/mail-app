import type { Table } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isMobile } from 'react-device-detect';
import { Effect } from '../animate-ui/primitives/effects/effect';

interface BasePaginationProps {
    table: Table<any>;
    hidePagination?: boolean;
}

const BasePagination = ({ table, hidePagination }: BasePaginationProps) => {
    if (hidePagination) return null;

    if (isMobile) {
        return (
            <div className="pagination">
                <button
                    className='btn-navigation'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    &laquo; ANTERIOR
                </button>

                <span>
                    {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                </span>
                
                <button
                    className='btn-navigation'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    SIGUIENTE &raquo;
                </button>
            </div>
        );
    }

    return (
        <Effect slide fade delay={150} className="w-full flex flex-row items-center justify-center gap-2 mt-4 text-sm">
            <Button size="sm" variant={`${table.getCanPreviousPage() ? 'default' : 'outline'}`} onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronLeft/>
                ANTERIOR
            </Button>
            
            <span className={`${(table.getCanPreviousPage() || table.getCanNextPage()) ? 'text-primary' : 'text-muted-foreground'}`}>
                Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            
            <Button size="sm" variant={`${table.getCanNextPage() ? 'default' : 'outline'}`} onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                SIGUIENTE
                <ChevronRight/>
            </Button>
        </Effect>
    );
};

export default BasePagination;

