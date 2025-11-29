import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, SquarePen, Loader2, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  category: "spirituality" | "intelligence" | "skills" | "health" | "body_kinesthetic" | "awareness";
  status: "pending" | "in_progress" | "done";
  recurring: boolean;
  due_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export const createTaskColumns = (
  onUpdate: (task: Task) => void,
  onSetPending: (task: Task) => void,
  onSetInProgress: (task: Task) => void,
  onSetDone: (task: Task) => void
): ColumnDef<Task>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      const value = row.getValue("title") as string;
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => {
        const value = row.getValue("category") as string;
        // Format only body_kinesthetic
        const label = value === "body_kinesthetic" ? "Body Kinethetic" : value.charAt(0).toUpperCase() + value.slice(1);
        return <Badge variant="outline">{label}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const task = row.original;
      const statusMap: Record<string, "in_progress" | "destructive" | "success" | "pending"> = {
        done: "success",
        pending: "pending",
        in_progress: "in_progress",
      };
      const label = task.status.charAt(0).toUpperCase() + task.status.slice(1);
      return <Badge className="capitalize" variant={statusMap[task.status]}>{label}</Badge>;
    },
  },
  {
    accessorKey: "recurring",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Recurring" />,
    cell: ({ row }) => (row.getValue("recurring") ? "Yes" : "No"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const task = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

              <>
                <DropdownMenuItem onClick={() => onUpdate(task)}>
                  <SquarePen className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => onSetPending(task)}>
                  <Clock className="mr-2 h-4 w-4" />
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSetInProgress(task)}>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSetDone(task)}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Done
                </DropdownMenuItem>
              </>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
