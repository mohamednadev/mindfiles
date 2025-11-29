"use client";

import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm, router } from "@inertiajs/react";
import { TasksDataTable } from "@/components/tasks/data-table";
import { createTaskColumns, Task } from "@/components/tasks/columns"; 
import { useState, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Tasks", href: "#" },
  { title: "My Tasks", href: "/tasks" },
];

interface Props {
  tasks: Task[];
  flash?: {
    success?: string;
    error?: string;
  };
}

const CATEGORY_OPTIONS = ["spirituality","intelligence","skills","health","body_kinesthetic","awareness"];

export default function Tasks({ tasks, flash }: Props) {
  const [data, setData] = useState<Task[]>(tasks ?? []);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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
    title: "",
    category: "spirituality",
    recurring: true,
  });

  const {
    data: updateFormData,
    setData: setUpdateFormData,
    post: postUpdate,
    processing: updateProcessing,
    errors: updateErrors,
    reset: resetUpdateForm,
  } = useForm({
    title: "",
    category: "spirituality",
    recurring: true,
    _method: "PUT" as const,
  });

  useEffect(() => setData(tasks), [tasks]);

  useEffect(() => {
    if (selectedTask) {
      setUpdateFormData({
        title: selectedTask.title,
        category: selectedTask.category,
        recurring: selectedTask.recurring,
        _method: "PUT",
      });
      setIsUpdateSheetOpen(true);
    }
  }, [selectedTask, setUpdateFormData]);

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
  const handleUpdateClick = (task: Task) => setSelectedTask(task);

  const handleSetPending = (task: Task) => changeStatus(task, "pending");
  const handleSetInProgress = (task: Task) => changeStatus(task, "in_progress");
  const handleSetDone = (task: Task) => changeStatus(task, "done");

  const changeStatus = (task: Task, status: string) => {
    router.patch(route(`tasks.set${status.charAt(0).toUpperCase() + status.slice(1)}`, task.id), {}, {
      onSuccess: () => {
        setToastMessage(`Task status set to ${status.replace("_"," ")}!`);
        setToastType("success");
        setShowToast(true);
      },
    });
  };

  // --- Bulk Actions ---
  const getSelectedIds = () => Object.keys(rowSelection)
    .filter(key => rowSelection[key])
    .map(key => data[parseInt(key)]?.id)
    .filter(id => id !== undefined);

  const handleBulkStatus = (status: string) => {
    const ids = getSelectedIds();
    if (!ids.length) return;

    router.post(route(`tasks.setSelected${status.charAt(0).toUpperCase() + status.slice(1)}`), { task_ids: ids }, {
      onSuccess: () => {
        setToastMessage(`Selected tasks set to ${status.replace("_"," ")}!`);
        setToastType("success");
        setShowToast(true);
      },
    });
  };

  const columns = createTaskColumns(
    handleUpdateClick,
    handleSetPending,
    handleSetInProgress,
    handleSetDone
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="My Tasks" />

      {/* Toast */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg text-white animate-in fade-in slide-in-from-top-5 ${
          toastType === "success" ? "bg-black text-white dark:text-black dark:bg-white" : "bg-red-500"
        }`}>
          {toastType === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="w-full px-6 mx-auto py-10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">My Tasks</h2>

        <TasksDataTable
          columns={columns}
          data={data}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onAddClick={() => setIsCreateSheetOpen(true)}
          onSetSelectedPending={() => handleBulkStatus("pending")}
          onSetSelectedInProgress={() => handleBulkStatus("in_progress")}
          onSetSelectedDone={() => handleBulkStatus("done")}
        />
      </div>

      {/* CREATE SHEET */}
      <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Task</SheetTitle>
            <SheetDescription>Fill in the task details.</SheetDescription>
          </SheetHeader>
          <form onSubmit={e => { e.preventDefault(); postCreate(route("tasks.store"), { onSuccess: () => { setIsCreateSheetOpen(false); resetCreateForm(); setToastMessage("Task added successfully!"); setToastType("success"); setShowToast(true); } }); }} className="grid gap-4">
            <Label>Task Title</Label>
            <Input value={createFormData.title} onChange={e => setCreateFormData("title", e.target.value)} />
            {createErrors.title && <p className="text-red-500">{createErrors.title}</p>}

            <Label>Category</Label>
            <Select value={createFormData.category} onValueChange={v => setCreateFormData("category", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map(option => {
                const label = option.includes("body_kinesthetic") 
                    ? "Body Kinethetic" 
                    : option.replace("_"," ").charAt(0).toUpperCase() + option.replace("_"," ").slice(1);
                return <SelectItem key={option} value={option}>{label}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            {createErrors.category && <p className="text-red-500">{createErrors.category}</p>}

            <Label>Recurring</Label>
            <Select
            value={createFormData.recurring ? "true" : "false"}
            onValueChange={v => setCreateFormData("recurring", v === "true")}
            >
            <SelectTrigger>
                <SelectValue placeholder="Recurring?" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
            </SelectContent>
            </Select>
            {createErrors.recurring && <p className="text-red-500">{createErrors.recurring}</p>}

            <SheetFooter>
              <Button type="submit" className="w-full mt-4" disabled={createProcessing}>Save</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* UPDATE SHEET */}
      <Sheet open={isUpdateSheetOpen} onOpenChange={setIsUpdateSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Task</SheetTitle>
            <SheetDescription>Update the task details.</SheetDescription>
          </SheetHeader>
          <form onSubmit={e => { e.preventDefault(); if (!selectedTask) return; postUpdate(route("tasks.update", selectedTask.id), { forceFormData: true, onSuccess: () => { setIsUpdateSheetOpen(false); setSelectedTask(null); resetUpdateForm(); setToastMessage("Task updated successfully!"); setToastType("success"); setShowToast(true); } }); }} className="grid gap-4">
            <Label>Task Title</Label>
            <Input value={updateFormData.title} onChange={e => setUpdateFormData("title", e.target.value)} />
            {updateErrors.title && <p className="text-red-500">{updateErrors.title}</p>}

            <Label>Recurring</Label>
            <Select
            value={updateFormData.recurring ? "true" : "false"}
            onValueChange={v => setUpdateFormData("recurring", v === "true")}
            >
            <SelectTrigger>
                <SelectValue placeholder="Recurring?" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
            </SelectContent>
            </Select>
            {updateErrors.recurring && <p className="text-red-500">{updateErrors.recurring}</p>}

            <SheetFooter>
              <Button type="submit" className="w-full mt-4" disabled={updateProcessing}>Update</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
