import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import React, { useEffect, useRef, useState } from 'react'
import BasePagination from '@/components/table/BasePagination';
import { useIsMobile } from '@/hooks/use-mobile';
import { Effect } from '@/components/animate-ui/primitives/effects/effect';
import SearchBar from '@/components/table/SearchBar';
import type { CardTab, Tab, TabTooltip, ExtendedColumnDef } from '@/types/tables';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatCurrencySV } from '@/utils/currencyUtils';
import { Spinner } from '../ui/spinner';

const SwipeableCardTabs = ({ currentTab, onTabChange, cardTabs }: { currentTab: CardTab, onTabChange: (tab: CardTab) => void, cardTabs: CardTab[] }) => {
    const currentIndex = cardTabs.findIndex(tab => tab.label === currentTab?.label);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const minSwipeDistance = 50;
    
    const handleTouchStart = (e: React.TouchEvent) => {
        touchEndX.current = null;
        touchStartX.current = e.targetTouches[0].clientX;
    };
    
    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };
    
    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        
        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe && currentIndex < cardTabs.length - 1) {
            onTabChange(cardTabs[currentIndex + 1]);
        }
        if (isRightSwipe && currentIndex > 0) {
            onTabChange(cardTabs[currentIndex - 1]);
        }
    };

    return (
        <div className="w-full">
            {/* Mobile swipeable tabs */}
            <div 
                className="md:hidden w-full relative overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="flex items-center justify-center w-full py-3 px-4">
                    <div className="flex items-center gap-2 w-full">
                        {currentIndex > 0 && (
                            <button
                                onClick={() => onTabChange(cardTabs[currentIndex - 1])}
                                className="p-2 text-muted-foreground flex-shrink-0"
                                aria-label="Previous tab"
                            >
                                ←
                            </button>
                        )}
                        <div className="flex-1 text-center min-w-0 flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <div className={`flex p-2 rounded-lg bg-${currentTab?.iconBgColor || 'accent-muted'}`}>
                                    {currentTab?.icon && <currentTab.icon size={16} />}
                                </div>
                                <span className="font-semibold text-sm">{currentTab?.label}</span>
                                <Badge className="!text-xs !p-[0.025rem] !px-[0.2rem]">
                                    {Array.isArray(currentTab?.data) ? currentTab.data.length : Object.values(currentTab?.data || {}).flat().length}
                                </Badge>
                            </div>
                            {currentTab?.content && (
                                <span className="font-bold text-sm text-muted-foreground">
                                    {currentTab.content.text}
                                    {formatCurrencySV(currentTab.content.total)}
                                </span>
                            )}
                        </div>
                        {currentIndex < cardTabs.length - 1 && (
                            <button
                                onClick={() => onTabChange(cardTabs[currentIndex + 1])}
                                className="p-2 text-muted-foreground flex-shrink-0"
                                aria-label="Next tab"
                            >
                                →
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop tabs */}
            <div className="hidden md:block w-full">
                <Tabs className='w-full' value={currentTab?.label} onValueChange={(value: string) => onTabChange(cardTabs.find((tab) => tab.label === value) as CardTab)}>
                    <TabsList className='!bg-transparent relative gap-2 w-full flex overflow-x-auto !h-auto !p-2 !min-h-[80px]'>
                        {cardTabs.map((tab: CardTab) => {
                            const isActive = currentTab?.label === tab.label;
                            const tooltipKey = `${tab.label}-${tab.contentTooltip?.map(item => String(item.value ?? item.text ?? '')).join('-') || ''}`;
                            return (
                                <TooltipProvider key={tooltipKey}>
                                    <Tooltip>
                                        <TooltipTrigger asChild className='flex-1 min-w-0'>
                                            <TabsTrigger 
                                                className={`group flex justify-start items-center py-4 px-4 flex-1 w-full !text-xs !bg-transparent !border-0 ring-1 transition-all duration-150 flex-shrink-0 !h-auto min-h-[80px] ${isActive ? '!bg-white/40 !ring-1' : '!bg-white/10'}`}
                                                value={tab.label}
                                                onClick={() => onTabChange(tab)}
                                            >
                                                <div className={`flex p-3 rounded-lg bg-${tab.iconBgColor || 'accent-muted'} flex-shrink-0 ${isActive ? '[&_svg]:!text-white [&_svg]:!stroke-white' : ''}`}>
                                                    <tab.icon size={18} className={isActive ? '!text-white !stroke-white' : ''} />
                                                </div>

                                                <div className='w-full flex flex-col items-start gap-1 min-w-0 flex-1'>
                                                    <div className='flex w-full items-center gap-2'>
                                                        <span className={`font-normal text-sm ${isActive ? '!text-white' : 'text-muted-foreground'} ${(!tab.content.total || tab.content.total === 0) ? 'flex-1' : 'truncate'}`}>
                                                            {tab.label}
                                                        </span>
                                                        <Badge className='font-normal ml-auto !text-xs !p-[0.025rem] !px-[0.2rem] flex-shrink-0'>
                                                            {Array.isArray(tab.data) ? tab.data.length : Object.values(tab.data || {}).flat().length}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </TabsTrigger>
                                        </TooltipTrigger>
                                    
                                    <TooltipContent key={tooltipKey} className='flex flex-col gap-1'>
                                        <div className='flex items-center gap-1 font-semibold'>
                                            <span className='text-sm text-primary-foreground'>{tab.label}</span>
                                            <span className='text-sm text-primary-foreground'>
                                                {tab.content.text}
                                                {formatCurrencySV(tab.content.total)}
                                            </span>
                                        </div>
                                        {tab.contentTooltip &&
                                            tab.contentTooltip.map((item: TabTooltip, index: number) => {
                                                if (item.value != null) {
                                                    return (
                                                        <span key={`${item.label}-${item.value}-${index}`} className='font-normal text-xs'>
                                                            {item.label}: {formatCurrencySV(item.value)}
                                                        </span>
                                                    );
                                                } else if (item.text != null) {
                                                    return (
                                                        <span key={`${item.label}-${item.text}-${index}`} className='font-normal text-xs'>
                                                            {item.label}: {item.text}
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })
                                        }
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            );
                        })}
                    </TabsList>
                </Tabs>
            </div>
        </div>
    );
};

export const renderCardTabs = (currentTab: CardTab, onTabChange: (tab: CardTab) => void, cardTabs: CardTab[]) => {
    return <SwipeableCardTabs currentTab={currentTab} onTabChange={onTabChange} cardTabs={cardTabs} />;
};

export interface BaseTableProps {
  searchBarPlaceholder?: string;
  tabs?: Tab[];
  cardTabs?: CardTab[];
  currentTab: Tab | CardTab;
  onTabChange: (tab: Tab | CardTab) => void;
  data: any[];
  columnDefinitions: ColumnDef<any>[];
  card: React.ComponentType<any> | React.ReactNode;
  centered?: string[];
  flexable?: string | string[];
  loading?: boolean;
  children?: React.ReactNode;
  showTabsAtTop?: boolean;
  hideSearchbar?: boolean;
  hidePagination?: boolean;
  pageSize?: number;
  selectedRowId?: string;
  onRowSelect?: (row: any) => void;
}

export default function BaseTable({
  searchBarPlaceholder = !useIsMobile() ? 'Buscar en tabla...' : 'Buscar...', 
  tabs = [], 
  cardTabs = [],
  data, 
  columnDefinitions,
  card,
  centered, 
  flexable, 
  loading,
  children,
  currentTab,
  onTabChange,
  showTabsAtTop = false,
  hideSearchbar,
  hidePagination,
    selectedRowId,
    onRowSelect,
  pageSize = !useIsMobile() ? 8 : 6,
}: BaseTableProps) {

    const [globalFilter, setGlobalFilter] = useState('')
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: pageSize,
    });
    
    // Swipe refs for mobile tabs
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const globalFilterFn = (row: Row<unknown>, columnId: string, filterValue: string) => {
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
        setPagination({
            pageIndex: 0,
            pageSize: pageSize
        });
    }, [pageSize]);

    // Reset pagination when tab changes
    useEffect(() => {
        setPagination(prev => ({
            ...prev,
            pageIndex: 0
        }));
    }, [currentTab]);

    // --- Inicialiazación de la tabla ---
    const table = useReactTable({
        data: currentTab.data as any[] || data,
        columns: currentTab.columnDefinitions as ColumnDef<Row<unknown>>[] || columnDefinitions, 
        meta: {
            card: currentTab.card ?? card,
        },
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
        getRowId: (originalRow: Row<unknown>) => originalRow.id,
        autoResetPageIndex: false
    })

    const renderTabs = () => {
        const tabsList = tabs.length > 0 ? tabs : [];
        const currentIndex = tabsList.findIndex(tab => tab.label === currentTab?.label);
        
        const minSwipeDistance = 50;
        
        const handleTouchStart = (e: React.TouchEvent) => {
            touchEndX.current = null;
            touchStartX.current = e.targetTouches[0].clientX;
        };
        
        const handleTouchMove = (e: React.TouchEvent) => {
            touchEndX.current = e.targetTouches[0].clientX;
        };
        
        const handleTouchEnd = () => {
            if (!touchStartX.current || !touchEndX.current) return;
            
            const distance = touchStartX.current - touchEndX.current;
            const isLeftSwipe = distance > minSwipeDistance;
            const isRightSwipe = distance < -minSwipeDistance;
            
            if (isLeftSwipe && currentIndex < tabsList.length - 1) {
                onTabChange(tabsList[currentIndex + 1]);
            }
            if (isRightSwipe && currentIndex > 0) {
                onTabChange(tabsList[currentIndex - 1]);
            }
        };

        return (
            <div className="w-full overflow-hidden">
                {/* Mobile swipeable tabs */}
                <div 
                    className="md:hidden w-full relative overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="flex items-center justify-center w-full py-3 px-4">
                        <div className="flex items-center gap-2">
                            {currentIndex > 0 && (
                                <button
                                    onClick={() => onTabChange(tabsList[currentIndex - 1])}
                                    className="p-2 text-muted-foreground"
                                    aria-label="Previous tab"
                                >
                                    ←
                                </button>
                            )}
                            <div className="flex-1 text-center min-w-0">
                                <span className="font-semibold text-sm">{currentTab?.label}</span>
                                <Badge className="ml-2 !text-xs !p-[0.025rem] !px-[0.2rem]">
                                    {Array.isArray(currentTab?.data) ? currentTab.data.length : (currentTab?.data ? Object.values(currentTab.data).flat().length : 0)}
                                </Badge>
                            </div>
                            {currentIndex < tabsList.length - 1 && (
                                <button
                                    onClick={() => onTabChange(tabsList[currentIndex + 1])}
                                    className="p-2 text-muted-foreground"
                                    aria-label="Next tab"
                                >
                                    →
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 border-b-2 border-white/30" />
                </div>

                {/* Desktop tabs */}
                <div className="hidden md:block">
                    <Tabs value={currentTab?.label} onValueChange={(value: string) => onTabChange(tabsList.find((tab) => tab.label === value) as Tab)}>
                        <TabsList className='!bg-transparent relative overflow-x-auto'>
                            <div className='absolute bottom-[2px] border-b-2 border-white/30 !rounded-none w-full'/>
                            {tabsList.map((tab: Tab) => (
                                <TabsTrigger 
                                    key={tab.label} 
                                    className='p-4 !text-xs !bg-transparent !border-0 !border-b-2 data-[state=active]:!bg-white/20 data-[state=active]:!border-white rounded-b-none flex-shrink-0' 
                                    value={tab.label}
                                    onClick={() => onTabChange(tab)}
                                >
                                    {tab.label}
                                    <Badge className='!text-xs !p-[0.025rem] !px-[0.2rem]'>
                                        {tab.data?.length}
                                    </Badge>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            </div>
        )
    }

    return (
        <>
        {showTabsAtTop && 
            <div className='w-full flex flex-row items-center gap-2 mt-4 mb-4'>
                {tabs.length > 0 && (
                    cardTabs.length > 0
                    ?
                        renderCardTabs(currentTab as CardTab, onTabChange, cardTabs ?? [])
                    :
                        renderTabs()
                )}
            </div>
        }

        {!hideSearchbar &&
            <Effect slide fade delay={50} className="w-full flex flex-col md:flex-row items-center gap-2 mt-4 mb-4">
                {children}

                <SearchBar placeholder={searchBarPlaceholder} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}/>

                {!showTabsAtTop && tabs.length > 0 && (
                    cardTabs.length > 0
                    ?
                        renderCardTabs(currentTab as CardTab, onTabChange, cardTabs ?? [])
                    :
                        renderTabs()
                )}
            </Effect>
        }

        {/* {useIsMobile() 
        ?
        <div className="cards-container">
            {table.getRowModel().rows.map((row) =>(
                React.createElement(currentTab.card ?? card, {
                    row, 
                    key: row.id, 
                    selectedRowId,
                    onRowSelect,
                })
            ))}

            {loading && (
                <div style={{maxWidth: '100%', display: 'flex', justifyContent: 'center'}}>
                    <div className="spinner"></div>
                </div>
            )}

            {!loading && (currentTab.data?.length <= 0 || !currentTab.data && data?.length <= 0) && (
                <div style={{width: '100%', textAlign: 'center'}}>
                    <h3>ESTA SECCIÓN ESTÁ VACÍA.</h3>
                </div>
            )}

            <BasePagination table={table} hidePagination={hidePagination} />
        </div>
        : */}
        <div className="w-full" style={{}}>
            <Effect slide fade delay={100} className="table text-sm bg-card blur-bg rounded-xl w-full" style={{width: '100%', maxWidth: '100%', overflowX: 'auto', minWidth: 'auto'}} key={`table-${currentTab}-${currentTab.columnDefinitions?.length || 0}`}>
                {table.getHeaderGroups().map((headerGroup) =>(
                    <div className="tr header" key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            const columnSize = header.column.getSize();
                            const isFlexable = typeof flexable === 'string' 
                                ? flexable === header.column.id 
                                : Array.isArray(flexable) && flexable.includes(header.column.id);
                            

                            const defaultCentered = (header.column.columnDef as ExtendedColumnDef).centered;
                            const isCentered = defaultCentered || centered?.includes(header.column.id)

                            return (
                            <div 
                                className={`th font-semibold bg-black/5 p-4 gap-2 ${isCentered ? 'column-centered' : ''} ${(header.column.id === 'title' || header.column.id === 'client') ? 'normal-case' : ''}`}
                                style={{
                                ...(isFlexable
                                    ? { flex: 1, minWidth: columnSize ? `${columnSize}px` : 0 }
                                    : { 
                                        width: `${columnSize}px`, 
                                        minWidth: `${columnSize}px`, 
                                        maxWidth: `${columnSize}px`,
                                        flexShrink: 0,
                                        flexGrow: 0
                                      }),
                                ...((header.column.id === 'title' || header.column.id === 'client') ? { textTransform: 'none' } : {})
                                }}
                                key={header.id}
                            >
                                <span>{header.column.columnDef.header as React.ReactNode}</span>
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

                            const defaultCentered = (cell.column.columnDef as ExtendedColumnDef).centered;
                            const isCentered = defaultCentered || centered?.includes(cell.column.id)

                            return (
                            <div
                                className={`td px-4 ${isCentered ? 'column-centered text-center' : ''} p-1 py-2`}
                                style={isFlexable 
                                    ? {flex: 1, minWidth: columnSize ? `${columnSize}px` : 0} 
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
                        <div className="td" style={{width: table.getTotalSize(), justifyContent: 'center', minHeight: 100, flex: 1}}>
                            <Spinner className='size-8'/>
                        </div>
                    </div>
                )}

                {/* --- Estado vacío --- */}
                {!loading && ((currentTab.data as any[])?.length <= 0 || !currentTab.data && data?.length <= 0) && (
                    <div className="tr">
                        <div className="td" style={{width: table.getTotalSize(), justifyContent: 'center', minHeight: 100, flex: 1}}>
                            <h3 className='text-center text-md font-medium'>ESTA SECCIÓN ESTÁ VACÍA.</h3>
                        </div>
                    </div>
                )}

            </Effect>
            
            <BasePagination table={table} hidePagination={hidePagination ?? false} />
        </div>

        </>
    )
}
