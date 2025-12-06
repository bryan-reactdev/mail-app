import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import BasePagination from './BasePagination';
import Tabs from './Tabs';
import TableSearchBar from './TableSearchBar';
import { Effect } from '../animate-ui/primitives/effects/effect';
 
interface BaseTableProps {
    searchBarPlaceholder?: string;
    tabs?: any[];
    data: any[];
    columns: any[];
    card: React.ComponentType<any>;
    cardProps?: any;
    centered?: string[];
    flexable?: string | string[];
    loading?: boolean;
    customHeaderHeight?: number;
    children?: React.ReactNode;
    currentTab?: string;
    onTabChange?: (tab: string) => void;
    isCardTabs?: boolean;
    showTabsAtTop?: boolean;
    hideSearch?: boolean;
    hideSearchbar?: boolean;
    hidePagination?: boolean;
    selectedRowId?: string;
    onRowSelect?: (row: any) => void;
    pageSize?: number;
    subTabs?: any[];
    currentSubTab?: string;
    onSubTabChange?: (tab: string) => void;
    forceTable?: boolean; // Fuerza mostrar tabla incluso en móvil
}

export default function BaseTable({
  searchBarPlaceholder = !isMobile ? 'Search in table...' : 'Search...', 
  tabs = [], 
  data, 
  columns,
  card,
  cardProps = {},
  centered, 
  flexable, 
  loading, 
  customHeaderHeight, 
  children,
  currentTab,
  onTabChange,
  isCardTabs,
  showTabsAtTop = false,
  hideSearch,
  hideSearchbar,
  hidePagination,
    selectedRowId,
    onRowSelect,
  pageSize = !isMobile ? 8 : 6,
  subTabs = [],
  currentSubTab,
  onSubTabChange,
  forceTable = false,
}: BaseTableProps) {
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab');

    const [globalFilter, setGlobalFilter] = useState('')
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: pageSize,
    });

    const globalFilterFn = (row: any, columnId: string, filterValue: string) => {
        const searchableString = row.getValue(columnId);
        
        // If no filter value, include the row
        if (!filterValue || filterValue === '') {
            return true;
        }

        const cellValue = String(searchableString).toLowerCase();
        const filterVal = filterValue.toLowerCase();

        // 1. First try exact match (respects original formatting)
        if (cellValue.includes(filterVal)) {
            return true;
        }

        // 2. Handle currency formatting: remove commas for matching
        // This allows "7357.00" to match "7,357.00" and vice versa
        const cellWithoutCommas = cellValue.replace(/,/g, '');
        const filterWithoutCommas = filterVal.replace(/,/g, '');
        
        if (cellWithoutCommas.includes(filterWithoutCommas)) {
            return true;
        }

        return false;
    };

    useEffect(() => {
        if (initialTab) {
            const matchedTab = tabs.find(tab => tab.label === initialTab);
            if (matchedTab) {
                onTabChange?.(matchedTab.label);
            }
        }
        else if (initialTab === null || initialTab === ''){
            const hasTabs = tabs.length > 0;

            if (hasTabs) {
                onTabChange?.(tabs[0].label);
            }
        }
    }, [initialTab]);

    useEffect(() => {
        setPagination({
            pageIndex: 0,
            pageSize: pageSize
        });
    }, [pageSize]);

    const activeTab = tabs.find(tab => tab.label === currentTab) || {};
    const activeColumns = activeTab.columnDefinitions ?? columns;
    const activeData = activeTab.data ?? data;

    // --- Inicialiazación de la tabla ---
    const table = useReactTable({
        data: activeData,
        columns: activeColumns, 
        state: {
            pagination,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: globalFilterFn,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        getRowId: (originalRow: any) => originalRow.id
    })

    return (
        <>
        {showTabsAtTop && 
            tabs.length > 0 && (
                isCardTabs
                ? null
                :
                <Tabs
                    className="mb-4" 
                    tabs={tabs}
                    currentTab={currentTab} 
                    setCurrentTab={(tab: any) => onTabChange?.(tab.label)} 
                />
            )
        }

        {!hideSearchbar &&
            <Effect slide fade delay={50} className="w-full flex flex-row items-center gap-2 mt-4 mb-4">
                {children}

                {!hideSearch &&
                    <TableSearchBar placeholder={searchBarPlaceholder} globalFilter={globalFilter} setGlobalFilter={(value: string) => setGlobalFilter(value)}/>
                }

                {!showTabsAtTop && tabs.length > 0 && (
                    !isCardTabs && (
                        <Tabs
                            tabs={tabs}
                            currentTab={currentTab}
                            setCurrentTab={(tab: any) => onTabChange?.(tab.label)}
                        />
                    )
                )}
                {subTabs.length > 0 && (
                    <Tabs
                        tabs={subTabs}
                        currentTab={currentSubTab}
                        setCurrentTab={(tab: any) => onSubTabChange?.(tab)}
                    />
                )}
            </Effect>
        }

        {(isMobile && !forceTable)
        ?
        <div className="cards-container">
            {table.getRowModel().rows.map((row) =>(
                React.createElement(activeTab.card ?? card, {
                    row, 
                    key: row.id, 
                    selectedRowId,
                    onRowSelect,
                    ...cardProps
                })
            ))}

            {/* --- Estado de carga durante fetch --- */}
            {loading && (
                <div style={{maxWidth: '100%', display: 'flex', justifyContent: 'center'}}>
                    <div className="spinner"></div>
                </div>
            )}

            {/* --- Estado vacío --- */}
            {!loading && (activeTab?.data?.length <= 0 || !activeTab?.data && data?.length <= 0) && (
                <div style={{ width: "100%", textAlign: "center" }}>
                    <h3>{/* Intentionally left generic; callers should provide empty states */}</h3>
                </div>
            )}

            <BasePagination table={table} hidePagination={hidePagination} />
        </div>
        :
        <div className="w-full" style={forceTable && isMobile ? { overflowX: 'auto', WebkitOverflowScrolling: 'touch' } : {}}>
            <Effect slide fade delay={100} className="table text-sm bg-card blur-bg rounded-xl w-full" style={{width: '100%', maxWidth: '100%', overflowX: 'auto', minWidth: 'auto', WebkitOverflowScrolling: 'touch'}} key={`table-${currentTab}-${activeColumns?.length || 0}`}>
                {table.getHeaderGroups().map((headerGroup) =>(
                    <div className="tr header" key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            const columnSize = header.column.getSize();
                            const isFlexable = typeof flexable === 'string' 
                                ? flexable === header.column.id 
                                : Array.isArray(flexable) && flexable.includes(header.column.id);
                            
                            return (
                            <div 
                                className={`th font-semibold bg-black/10 p-4 gap-2 ${centered?.includes(header.column.id) ? 'column-centered' : ''} ${(header.column.id === 'title' || header.column.id === 'client') ? 'normal-case' : ''}`}
                                style={{
                                ...(isFlexable
                                    ? { flex: 1, minWidth: `${columnSize}px` }
                                    : { 
                                        width: `${columnSize}px`, 
                                        minWidth: `${columnSize}px`, 
                                        maxWidth: `${columnSize}px`,
                                        flexShrink: 0,
                                        flexGrow: 0
                                      }),
                                ...(customHeaderHeight ? { minHeight: customHeaderHeight } : {}),
                                ...((header.column.id === 'title' || header.column.id === 'client') ? { textTransform: 'none' } : {})
                                }}
                                key={header.id}
                            >
                                <span className={forceTable && isMobile && header.column.id.startsWith('day_') ? 'text-[9px]' : ''}>{header.column.columnDef.header?.toString()}</span>
                                {header.column.getCanSort() && (
                                    <i
                                        className={
                                        header.column.getIsSorted() === "asc"
                                            ? "fas fa-sort-up"
                                            : header.column.getIsSorted() === "desc"
                                            ? "fas fa-sort-down"
                                            : "fas fa-sort"
                                        }
                                        onClick={header.column.getToggleSortingHandler()}
                                    ></i>
                                )}

                            </div>
                        )})}
                    </div>
                ))}

                {table.getRowModel().rows.map((row) =>(
                    <div
                        className={`tr ${row.id === selectedRowId ? 'selected-row' : ''}`}
                        key={row.id}
                        onClick={() => onRowSelect?.(row.original)}
                        style={{ cursor: onRowSelect ? 'pointer' : 'default', width: '100%' }}
                    >
                        {row.getVisibleCells().map((cell) => {
                            const columnSize = cell.column.getSize();
                            const isFlexable = typeof flexable === 'string' 
                                ? flexable === cell.column.id 
                                : Array.isArray(flexable) && flexable.includes(cell.column.id);
                            
                            return (
                            <div 
                                className={`td px-4 ${centered?.includes(cell.column.id) ? 'column-centered' : ''} p-1 py-2`}
                                style={isFlexable 
                                    ? {flex: 1, minWidth: `${columnSize}px`} 
                                    : {
                                        width: `${columnSize}px`, 
                                        minWidth: `${columnSize}px`, 
                                        maxWidth: `${columnSize}px`,
                                        flexShrink: 0,
                                        flexGrow: 0
                                      }} 
                                key={cell.id}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                        )})}
                    </div>
                ))}

                {/* --- Estado de carga durante fetch --- */}
                {loading && (
                    <div className="tr">
                        <div className="td" style={{width: table.getTotalSize(), justifyContent: 'center', height: 100, flex: 1}}>
                            <div className="spinner"></div>
                        </div>
                    </div>
                )}

                {/* --- Estado vacío --- */}
                {!loading && (activeTab?.data?.length <= 0 || !activeTab?.data && data?.length <= 0) && (
                    <div className="tr">
                        <div className="td" style={{width: table.getTotalSize(), justifyContent: 'center', flex: 1}}>
                            <h3>THIS TABLE IS EMPTY</h3>
                        </div>
                    </div>
                )}

            </Effect>
            
            <BasePagination table={table} hidePagination={hidePagination} />
        </div>
        }

        </>
    )
}
