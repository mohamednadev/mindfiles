"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  SortingState,
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "@/components/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table-view-options";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowSelection: Record<string, boolean>;
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onAddClick?: () => void;
  onSetSelectedPending?: (selectedIds: string[]) => void;
  onSetSelectedInProgress?: (selectedIds: string[]) => void;
  onSetSelectedDone?: (selectedIds: string[]) => void;
}

export function TasksDataTable<TData, TValue>({
  columns,
  data = [],
  rowSelection,
  setRowSelection,
  onAddClick,
  onSetSelectedPending,
  onSetSelectedInProgress,
  onSetSelectedDone,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { rowSelection, sorting },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
  });

  const selectedRowCount = Object.keys(rowSelection).length;
  const selectedIds = Object.keys(rowSelection);

  const STATUS_OPTIONS = [
    { value: "pending", label: "Pending", icon: Clock },
    { value: "in_progress", label: "In Progress", icon: Loader2, spin: true },
    { value: "done", label: "Done", icon: CheckCircle2 },
  ];

  const CATEGORY_OPTIONS = [
    "spirituality",
    "intelligence",
    "skills",
    "health",
    "body_kinesthetic",
    "awareness",
  ];

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-4 flex-1 min-w-[200px]">
          {/* Search */}
          <div className="flex items-center gap-2">
            <Label htmlFor="search" className="whitespace-nowrap">Search</Label>
            <Input
              id="search"
              placeholder="Search..."
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
              className="w-40 sm:w-44"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap">Category</Label>
            <Select
              value={(table.getColumn("category")?.getFilterValue() as string) ?? undefined}
              onValueChange={(value) => table.getColumn("category")?.setFilterValue(value || undefined)}
            >
              <SelectTrigger className="w-36 sm:w-42">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map(cat => {
                const label = cat === "body_kinesthetic" ? "Body Kinethetic" : cat.charAt(0).toUpperCase() + cat.slice(1);
                return <SelectItem key={cat} value={cat}>{label}</SelectItem>;
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap">Status</Label>
            <Select
              value={(table.getColumn("status")?.getFilterValue() as string) ?? undefined}
              onValueChange={(value) => table.getColumn("status")?.setFilterValue(value || undefined)}
            >
              <SelectTrigger className="w-36 sm:w-30">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Task */}
          <Button onClick={onAddClick} className="flex items-center whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>

          {/* Bulk Actions */}
          {selectedRowCount > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>Bulk Actions ({selectedRowCount})</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onSetSelectedPending && (
                  <DropdownMenuItem onClick={() => onSetSelectedPending(selectedIds)}>
                    Set Selected Pending ({selectedRowCount})
                  </DropdownMenuItem>
                )}
                {onSetSelectedInProgress && (
                  <DropdownMenuItem onClick={() => onSetSelectedInProgress(selectedIds)}>
                    Set Selected In Progress ({selectedRowCount})
                  </DropdownMenuItem>
                )}
                {onSetSelectedDone && (
                  <DropdownMenuItem onClick={() => onSetSelectedDone(selectedIds)}>
                    Set Selected Done ({selectedRowCount})
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />
    </div>
  );
}
