import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, Undo2, SquarePen, Download, Loader2, CheckCircle2, Clock } from "lucide-react";
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

export interface VisaDoc {
  goals: string;
  description: string | null;
  id: number;
  name: string;
  file: string | null;
  status: "in_progress" | "done" | "pending" | "deleted" ;
  category: "personal" | "sponsor" | "study" | "rent" | "flight reservation" | "medical" | "bank statements";
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export const createVisaDocColumns = (
  onUpdate: (doc: VisaDoc) => void,
  onDelete: (doc: VisaDoc) => void,
  onRestore: (doc: VisaDoc) => void,
  onSetInProgress: (doc: VisaDoc) => void,
  onSetDone: (doc: VisaDoc) => void,
  onSetPending: (doc: VisaDoc) => void,
): ColumnDef<VisaDoc>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="border border-1 border-black dark:border-white"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="border border-1 border-black dark:border-white"
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
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const value = row.getValue("name") as string;
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => {
      const value = row.getValue("description") as string | null;
      if (!value) return <span>No description</span>;
      const truncated = value.length > 50 ? value.slice(0, 50) + "..." : value;
      return truncated.charAt(0).toUpperCase() + truncated.slice(1);
    },
  },
  {
    accessorKey: "goals",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Goals" />,
    cell: ({ row }) => {
      const value = row.getValue("goals") as string | null;
      if (!value) return <span>No goals</span>;
      const truncated = value.length > 50 ? value.slice(0, 50) + "..." : value;
      return truncated.charAt(0).toUpperCase() + truncated.slice(1);
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => {
      const value = row.getValue("category") as string;
      const formatted = value.charAt(0).toUpperCase() + value.slice(1);
      return <Badge variant="outline">{formatted}</Badge>;
    },
  },
{
  accessorKey: "status",
  header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
  cell: ({ row }) => {
    const doc = row.original;
    const displayedStatus = doc.deleted_at ? "deleted" : doc.status;

    const statusMap: Record<string, "in_progress" | "destructive" | "success" | "pending"> = {
      done: "success",
      pending: "pending",
      in_progress: "in_progress",
      deleted: "destructive",
    };

    const formatStatus = (status: string) => {
      if (status === "in_progress") return "In Progress";
      return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const label = formatStatus(displayedStatus);
    return <Badge className="capitalize" variant={statusMap[displayedStatus]}>{label}</Badge>;
  },
},

  {
  accessorKey: "file",
  header: ({ column }) => <DataTableColumnHeader column={column} title="File" />,
  cell: ({ row }) => {
    const filePath = row.original.file;
    if (!filePath) return <span>No file</span>;

    const fileUrl = `/storage/${filePath}`;
    const ext = filePath.split(".").pop()?.toLowerCase() || "";

    const imageExt = ["png", "jpg", "jpeg", "webp", "gif"];

    if (imageExt.includes(ext)) {
      return (
        <img
          src={fileUrl}
          alt={row.original.name}
          className="w-12 h-12 rounded object-cover"
        />
      );
    }

    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-4 py-1.5 border text-black dark:text-white max-w-max rounded-md text-xs bg-[var(--color-cocollab)] dark:bg-[var(--color-cocollab-light)] hover:bg-[var(--color-cocollab)]/80 dark:hover:bg-[var(--color-cocollab-light)]/80 transition-colors"
      >
        <Download className="w-4 h-4" />
        Download
      </a>
    );
  },
},
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const doc = row.original;
      const isDeleted = !!doc.deleted_at;

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

                {!isDeleted && (
                <>
                    <DropdownMenuItem onClick={() => onUpdate(doc)}>
                    <SquarePen className="mr-2 h-4 w-4" />
                    Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => onSetInProgress(doc)}>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSetDone(doc)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Done
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSetPending(doc)}>
                    <Clock className="mr-2 h-4 w-4" />
                    Pending
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => onDelete(doc)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                    </DropdownMenuItem>
                </>
                )}

                {isDeleted && (
                <DropdownMenuItem onClick={() => onRestore(doc)}>
                    <Undo2 className="mr-2 h-4 w-4" />
                    Restore
                </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>

      );
    },
  },
];