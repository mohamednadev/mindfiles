/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Documents", href: "#" },
  { title: "My Journal", href: "/journal" },
];

// Lazy load Wysiwyg editor
const Wysiwyg = lazy(async () => {
  const mod = await import("react-simple-wysiwyg");
  return {
    default: ({ value, onChange, focused }: { value: string; onChange: (val: string) => void; focused: boolean }) => (
      <mod.EditorProvider>
        {focused && (
          <div className="flex gap-4 p-2">
            <mod.BtnBold className="text-gray-800 dark:text-gray-100" />
            <mod.BtnItalic className="text-gray-800 dark:text-gray-100" />
            <mod.BtnUnderline className="text-gray-800 dark:text-gray-100" />
          </div>
        )}
        <mod.Editor
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          className="w-full p-3 min-h-[200px]"
        />
      </mod.EditorProvider>
    ),
  };
});

interface Journal {
  id: number;
  title: string;
  content: string;
}

export default function JournalPage() {
  const { pages = {} } = usePage().props as any;
  const [entries, setEntries] = useState<Journal[]>(pages.data || []);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setEntries(pages.data || []);
  }, [pages]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(
      route("journals.store"),
      { title: newTitle, content: newContent },
      {
        preserveScroll: true,
        onSuccess: () => {
          setNewTitle("");
          setNewContent("");
        },
      }
    );
  };

  const debouncers = useMemo(() => new Map<number, number>(), []);

  const handleUpdate = (id: number, updated: Partial<Journal>) => {
    setEntries((prev) => prev.map((j) => (j.id === id ? { ...j, ...updated } : j)));
    const existing = debouncers.get(id);
    if (existing) window.clearTimeout(existing);
    const t = window.setTimeout(() => {
      router.put(route("journals.update", id), updated, { preserveState: true, preserveScroll: true });
    }, 600);
    debouncers.set(id, t);
  };

  const handleNext = () => {
    if (currentIndex < entries.length - 1) setCurrentIndex(currentIndex + 1);
    else if (pages.next_page_url) router.get(pages.next_page_url, {}, { preserveState: true, preserveScroll: true });
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else if (pages.prev_page_url) router.get(pages.prev_page_url, {}, { preserveState: true, preserveScroll: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="w-full px-6 mx-auto py-10 min-h-screen duration-300">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">My Journal</h2>
        <Head title="My Journal" />

        {/* Create New Page */}
        <div className="mb-8 p-4 border rounded-xl shadow-sm bg-sidebar">
          <h2 className="text-lg font-semibold mb-2">Create New Journal Page</h2>

          <form onSubmit={handleCreate}>
            <Input
              type="text"
              placeholder="Page Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md"
            />

            <Suspense fallback={<div className="text-sm">Loading editor…</div>}>
              <div className="mb-4 border rounded-md overflow-hidden">
                <Wysiwyg value={newContent} onChange={(val: string) => setNewContent(val)} focused={true} />
              </div>
            </Suspense>

            <Button type="submit" className="px-4 py-2 sm:max-w-max w-full">
              Add Page
            </Button>
          </form>
        </div>

        {/* Display Journal Pages as actual pages */}
        <div className="relative flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {entries[currentIndex] && (
              <motion.div
                key={entries[currentIndex].id}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 shadow-lg rounded-lg p-6 bg-sidebar overflow-auto"
              >
                {/* Page Title */}
                <input
                  type="text"
                  value={entries[currentIndex].title}
                  onChange={(e) => handleUpdate(entries[currentIndex].id, { title: e.target.value })}
                  className="w-full text-2xl font-bold mb-4 bg-transparent"
                />

                {/* Editor with toolbar visible only on focus */}
                <div onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
                  <Suspense fallback={<div className="text-sm">Loading editor…</div>}>
                    <Wysiwyg
                      value={entries[currentIndex].content}
                      onChange={(val: string) => handleUpdate(entries[currentIndex].id, { content: val })}
                      focused={focused}
                    />
                  </Suspense>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrev}
              disabled={currentIndex === 0 && !pages.prev_page_url}
              className="px-4 py-2 disabled:opacity-50"
            >
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentIndex === entries.length - 1 && !pages.next_page_url}
              className="px-4 py-2 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
