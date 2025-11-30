"use client";

import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm, router } from "@inertiajs/react";
import { DataTable } from "@/components/visa-docs/data-table";
import { createVisaDocColumns, VisaDoc } from "@/components/visa-docs/columns";
import { useState, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Documents", href: "#" },
  { title: "Visa Docs", href: "/visa-docs" },
];

interface Props {
  visaDocs: VisaDoc[];
  flash?: {
    success?: string;
    error?: string;
  };
}

const STATUS_OPTIONS = ["pending", "done", "in_progress"];
const CATEGORY_OPTIONS = ["personal", "sponsor", "study", "rent", "flight reservation", "medical", "bank statements"];

export default function VisaDocs({ visaDocs, flash }: Props) {
  const [data, setData] = useState<VisaDoc[]>(visaDocs ?? []);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<VisaDoc | null>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const {
    data: createFormData,
    setData: setCreateFormData,
    post: postCreate,
    processing: createProcessing,
    errors: createErrors,
    reset: resetCreateForm,
  } = useForm({
    name: "",
    description: "",
    goals: "",
    file: null as File | null,
    status: "pending",
    category: "personal",
  });

  const {
    data: updateFormData,
    setData: setUpdateFormData,
    post: postUpdate,
    processing: updateProcessing,
    errors: updateErrors,
    reset: resetUpdateForm,
  } = useForm({
    name: "",
    description: "",
    goals: "",
    file: null as File | null,
    status: "pending",
    category: "personal",
    _method: "PUT" as const,
  });

  useEffect(() => setData(visaDocs), [visaDocs]);

  useEffect(() => {
    if (selectedDoc) {
      setUpdateFormData({
        name: selectedDoc.name,
        description: selectedDoc.description ?? "",
        goals: selectedDoc.goals ?? "",
        status: selectedDoc.status,
        category: selectedDoc.category,
        file: null,
        _method: "PUT",
      });
      setIsUpdateSheetOpen(true);
    }
  }, [selectedDoc, setUpdateFormData]);

  useEffect(() => {
    if (flash?.success) {
      setToastMessage(flash.success);
      setToastType("success");
      setShowToast(true);
    } else if (flash?.error) {
      setToastMessage(flash.error);
      setToastType("error");
      setShowToast(true);
    }
  }, [flash]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // --- Direct Actions ---
  const handleUpdateClick = (doc: VisaDoc) => setSelectedDoc(doc);

  const handleDeleteClick = (doc: VisaDoc) => {
  router.delete(route("visa-docs.destroy", doc.id), {
    onSuccess: () => {
      // Update the local state to mark as deleted
      setData(prev =>
        prev.map(d =>
          d.id === doc.id ? { ...d, deleted_at: new Date().toISOString(), status: "deleted" } : d
        )
      );
      setToastMessage("Document deleted successfully!");
      setToastType("success");
      setShowToast(true);
    },
  });
};


  const handleRestoreClick = (doc: VisaDoc) => {
    router.post(route("visa-docs.restore", doc.id), {}, {
      onSuccess: () => {
        setToastMessage("Document restored successfully!");
        setToastType("success");
        setShowToast(true);
      },
    });
  };

  const handleRestoreAllClick = () => {
    router.post(route("visa-docs.restoreAll"), {}, {
      onSuccess: () => {
        setToastMessage("All documents restored successfully!");
        setToastType("success");
        setShowToast(true);
      },
    });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;
    postUpdate(route("visa-docs.update", selectedDoc.id), {
      forceFormData: true,
      onSuccess: () => {
        setIsUpdateSheetOpen(false);
        setSelectedDoc(null);
        resetUpdateForm();
        setToastMessage("Document updated successfully!");
        setToastType("success");
        setShowToast(true);
      },
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postCreate(route("visa-docs.store"), {
      onSuccess: () => {
        setIsCreateSheetOpen(false);
        resetCreateForm();
        setToastMessage("Document added successfully!");
        setToastType("success");
        setShowToast(true);
      },
    });
  };

  const handleSetInProgress = (doc: VisaDoc) => {
    router.post(route("visa-docs.inProgress", doc.id), {}, {
      onSuccess: () => {
        setToastMessage("Document status set to In Progress!");
        setToastType("success");
        setShowToast(true);
      },
    });
  };

  const handleSetDone = (doc: VisaDoc) => {
    router.post(route("visa-docs.done", doc.id), {}, {
      onSuccess: () => {
        setToastMessage("Document status set to Done!");
        setToastType("success");
        setShowToast(true);
      },
    });
  };

  const handleSetPending = (doc: VisaDoc) => {
    router.post(route("visa-docs.pending", doc.id), {}, {
      onSuccess: () => {
        setToastMessage("Document status set to Pending!");
        setToastType("success");
        setShowToast(true);
      },
    });
  };

  // --- Bulk Status Actions ---
const getSelectedIds = () => {
  return Object.keys(rowSelection)
    .filter(key => rowSelection[key])            // Only selected rows
    .map(key => data[parseInt(key)]?.id)         // Map row index to actual DB id
    .filter(id => id !== undefined);             // Remove undefined just in case
};

const handleBulkSetPending = () => {
  const selectedIds = getSelectedIds();
  if (selectedIds.length === 0) return;

  router.post(route("visa-docs.setSelectedPending"), { ids: selectedIds }, {
    onSuccess: () => {
      setToastMessage("Selected documents set to Pending!");
      setToastType("success");
      setShowToast(true);
    },
  });
};

const handleBulkSetInProgress = () => {
  const selectedIds = getSelectedIds();
  if (selectedIds.length === 0) return;

  router.post(route("visa-docs.setSelectedInProgress"), { ids: selectedIds }, {
    onSuccess: () => {
      setToastMessage("Selected documents set to In Progress!");
      setToastType("success");
      setShowToast(true);
    },
  });
};

const handleBulkSetDone = () => {
  const selectedIds = getSelectedIds();
  if (selectedIds.length === 0) return;

  router.post(route("visa-docs.setSelectedDone"), { ids: selectedIds }, {
    onSuccess: () => {
      setToastMessage("Selected documents set to Done!");
      setToastType("success");
      setShowToast(true);
    },
  });
};

  const hasSoftDeleted = (visaDocs ?? []).some(n => n.deleted_at !== null);
  const columns = createVisaDocColumns(
    handleUpdateClick,
    handleDeleteClick,
    handleRestoreClick,
    handleSetInProgress, 
    handleSetDone,
    handleSetPending
  );

  const formatStatus = (status: string) => {
    if (status === "in_progress") return "In Progress";
    return status.charAt(0).toUpperCase() + status.slice(1); // Capitalize first letter
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Visa Documents" />

      {/* Toast */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg text-white animate-in fade-in slide-in-from-top-5 ${
          toastType === "success" ? "bg-black text-white dark:text-black dark:bg-white" : "bg-red-500"
        }`}>
          {toastType === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* DataTable */}
      <div className="w-full p-6 mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">My Visa Documents</h2>

        <DataTable
            columns={columns}
            data={data}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onAddClick={() => setIsCreateSheetOpen(true)}
            onRestoreAllClick={handleRestoreAllClick}
            onSetSelectedPending={handleBulkSetPending}
            onSetSelectedInProgress={handleBulkSetInProgress}
            onSetSelectedDone={handleBulkSetDone}
            hasSoftDeleted={hasSoftDeleted}
        />
      </div>

      {/* CREATE SHEET */}
      <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Document</SheetTitle>
            <SheetDescription>Fill in the document details.</SheetDescription>
          </SheetHeader>

          <form
            onSubmit={handleCreateSubmit}
            encType="multipart/form-data"
            className="space-y-6"
          >
            {/* BASIC INFO */}
            <div className="space-y-3">
              <div className="grid gap-3">
                <div className="flex flex-col gap-2">
                  <Label>Document Name</Label>
                  <Input
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData("name", e.target.value)}
                  />
                  {createErrors.name && <p className="text-red-500">{createErrors.name}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Description</Label>
                  <Textarea
                    className="h-20"
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData("description", e.target.value)}
                  />
                  {createErrors.description && <p className="text-red-500">{createErrors.description}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Goals</Label>
                  <Textarea
                    className="h-20"
                    value={createFormData.goals}
                    onChange={(e) => setCreateFormData("goals", e.target.value)}
                  />
                  {createErrors.goals && <p className="text-red-500">{createErrors.goals}</p>}
                </div>
              </div>
            </div>

            {/* META */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Document Metadata</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Status</Label>
                  <Select
                    value={createFormData.status}
                    onValueChange={(v) => setCreateFormData("status", v)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {formatStatus(option)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {createErrors.status && <p className="text-red-500">{createErrors.status}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Category</Label>
                  <Select
                    value={createFormData.category}
                    onValueChange={(v) => setCreateFormData("category", v)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {createErrors.category && <p className="text-red-500">{createErrors.category}</p>}
                </div>

                <div className="col-span-2 flex flex-col gap-2">
                  <Label>File</Label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCreateFormData("file", e.target.files?.[0] ?? null)}
                  />
                  {createErrors.file && <p className="text-red-500">{createErrors.file}</p>}
                </div>
              </div>
            </div>

            <SheetFooter>
              <Button type="submit" className="w-full mt-2" disabled={createProcessing}>
                Save
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>


      {/* UPDATE SHEET */}
      <Sheet open={isUpdateSheetOpen} onOpenChange={setIsUpdateSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Document</SheetTitle>
            <SheetDescription>Update the document details.</SheetDescription>
          </SheetHeader>

          <form
            onSubmit={handleUpdateSubmit}
            encType="multipart/form-data"
            className="space-y-6"
          >
            {/* BASIC INFO */}
            <div className="space-y-3">
              <div className="grid gap-3">
                <div className="flex flex-col gap-2">
                  <Label>Document Name</Label>
                  <Input
                    value={updateFormData.name}
                    onChange={(e) => setUpdateFormData("name", e.target.value)}
                  />
                  {updateErrors.name && <p className="text-red-500">{updateErrors.name}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Description</Label>
                  <Textarea
                    className="h-20"
                    value={updateFormData.description}
                    onChange={(e) => setUpdateFormData("description", e.target.value)}
                  />
                  {updateErrors.description && <p className="text-red-500">{updateErrors.description}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Goals</Label>
                  <Textarea
                    className="h-20"
                    value={updateFormData.goals}
                    onChange={(e) => setUpdateFormData("goals", e.target.value)}
                  />
                  {updateErrors.goals && <p className="text-red-500">{updateErrors.goals}</p>}
                </div>
              </div>
            </div>

            {/* META */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Document Metadata</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Status</Label>
                  <Select
                    value={updateFormData.status}
                    onValueChange={(v) => setUpdateFormData("status", v)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {formatStatus(option)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {updateErrors.status && <p className="text-red-500">{updateErrors.status}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Category</Label>
                  <Select
                    value={updateFormData.category}
                    onValueChange={(v) => setUpdateFormData("category", v)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {updateErrors.category && <p className="text-red-500">{updateErrors.category}</p>}
                </div>

                <div className="col-span-2 flex flex-col gap-2">
                  <Label>File (optional)</Label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setUpdateFormData("file", e.target.files?.[0] ?? null)}
                  />
                  {updateErrors.file && <p className="text-red-500">{updateErrors.file}</p>}
                </div>
              </div>
            </div>

            <SheetFooter>
              <Button type="submit" className="w-full mt-2" disabled={updateProcessing}>
                Update
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

    </AppLayout>
  );
}