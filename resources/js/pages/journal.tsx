/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FlipBook from "@/components/FlipBook";
import Editor from "@/components/Wysiwyg"; // lazy-loaded WYSIWYG
import { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Documents", href: "#" },
  { title: "My Journal", href: "/journal" },
];

interface Journal {
  id: number;
  title: string;
  content: string;
}

export default function JournalPage() {
  const { pages: initialPages } = usePage().props as unknown as { pages: Journal[] };
  const [entries, setEntries] = useState<Journal[]>(initialPages || []);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    setEntries(initialPages || []);
  }, [initialPages]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim() || !newContent.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    router.post(
      route("journals.store"),
      { title: newTitle, content: newContent },
      {
        preserveScroll: true,
        onSuccess: (page: any) => {
          setNewTitle("");
          setNewContent("");
          if (page.props?.pages) {
            setEntries(page.props.pages);
          }
        },
        onError: (errors) => {
          console.error("Error creating journal entry:", errors);
        },
      }
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="w-full p-6 mx-auto min-h-screen duration-300">
        <Head title="My Journal" />

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          My Journal
        </h1>

        {/* CREATE NEW PAGE */}
        <div className="mb-8 p-6 border rounded-xl shadow-sm bg-sidebar">
          <h2 className="text-lg font-semibold mb-4">Create New Journal Page</h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Page Title</label>
              <Input
                type="text"
                placeholder="Enter a title for your page..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Suspense fallback={<div className="p-3 bg-white border rounded-md">Loading editor...</div>}>
                {/* Editor always shows toolbar */}
                <Editor
                  value={newContent}
                  onChange={setNewContent}
                  focused={true}
                />
              </Suspense>
            </div>

            <Button type="submit" className="w-full sm:w-auto px-6 py-2">
              Add Page to Journal
            </Button>
          </form>
        </div>

        {/* FLIPBOOK */}
        {entries.length > 0 ? (
          <FlipBook entries={entries} />
        ) : (
          <div className="text-center py-12">
            <p className="text-lg">Your journal is empty.</p>
            <p className="text-sm mt-2">Create your first page above to get started!</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
