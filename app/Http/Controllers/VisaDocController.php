<?php

namespace App\Http\Controllers;

use App\Models\VisaDoc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class VisaDocController extends Controller
{
    /**
     * Display all visa documents.
     */
    public function index()
    {
        $docs = VisaDoc::withTrashed()->get();

        return Inertia::render('visa-docs', [
            'visaDocs' => $docs,
        ]);
    }

    /**
     * Store a new visa document.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'goals'       => 'nullable|string|max:5000',
            'file'        => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'status'      => 'required|in:pending,in_progress,done',
            'category'    => 'required|in:personal,sponsor,study,rent,flight reservation,medical,bank statements',
        ]);

        try {
            $filePath = null;

            if ($request->hasFile('file')) {
                $filename = Str::uuid() . '.' . $request->file('file')->getClientOriginalExtension();
                $filePath = $request->file('file')->storeAs('visa_docs', $filename, 'public');
            }

            VisaDoc::create([
                'name'        => $request->name,
                'description' => $request->description,
                'goals'       => $request->goals,
                'file'        => $filePath,
                'status'      => $request->status,
                'category'    => $request->category,
            ]);

            return back()->with('success', 'Document created successfully!');
        } catch (\Exception $e) {
            Log::error("Error creating document: " . $e->getMessage());
            return back()->with('error', 'An error occurred. Please try again.');
        }
    }

    /**
     * Update a visa document.
     */
    public function update(Request $request, $id)
    {
        $doc = VisaDoc::findOrFail($id);

        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'goals'       => 'nullable|string|max:5000',
            'file'        => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'status'      => 'required|in:pending,in_progress,done',
            'category'    => 'required|in:personal,sponsor,study,rent,flight reservation,medical,bank statements',
        ]);

        $data = $request->only(['name', 'description', 'goals', 'status', 'category']);

        if ($request->hasFile('file')) {
            if ($doc->file && Storage::disk('public')->exists($doc->file)) {
                Storage::disk('public')->delete($doc->file);
            }

            $filename = Str::uuid() . '.' . $request->file('file')->getClientOriginalExtension();
            $data['file'] = $request->file('file')->storeAs('visa_docs', $filename, 'public');
        }

        $doc->update($data);

        return back()->with('success', 'Document updated successfully!');
    }

    /**
     * Soft delete a visa document.
     */
    public function destroy($id)
    {
        $doc = VisaDoc::findOrFail($id);
        $doc->delete();

        return back()->with('success', 'Document deleted successfully!');
    }


    /**
     * Restore a soft-deleted document.
     */
    public function restore($id)
    {
        $doc = VisaDoc::withTrashed()->findOrFail($id);

        if ($doc->trashed()) {
            $doc->restore();
            return back()->with('success', 'Document restored successfully!');
        }

        return back()->with('error', 'This document is not deleted.');
    }

    /**
     * Restore all soft-deleted documents.
     */
    public function restoreAll()
    {
        VisaDoc::onlyTrashed()->restore();

        return back()->with('success', 'All documents restored successfully!');
    }

    /**
     * Set the status of a visa document to in_progress.
     */
    public function setInProgress($id)
    {
        $doc = VisaDoc::findOrFail($id);
        $doc->update(['status' => 'in_progress']);

        return back()->with('success', 'Document status set to In Progress!');
    }

    /**
     * Set the status of a visa document to done.
     */
    public function setDone($id)
    {
        $doc = VisaDoc::findOrFail($id);
        $doc->update(['status' => 'done']);

        return back()->with('success', 'Document status set to Done!');
    }

    /**
     * Set the status of a visa document to pending.
     */
    public function setPending($id)
    {
        $doc = VisaDoc::findOrFail($id);
        $doc->update(['status' => 'pending']);

        return back()->with('success', 'Document status set to Pending!');
    }

    public function setSelectedPending(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:visa_docs,id',
        ]);

        VisaDoc::whereIn('id', $request->ids)
            ->whereNull('deleted_at')
            ->update(['status' => 'pending', 'updated_at' => now()]);

        return back()->with('success', 'Selected documents set to Pending!');
    }

    public function setSelectedDone(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:visa_docs,id',
        ]);

        VisaDoc::whereIn('id', $request->ids)
            ->whereNull('deleted_at')
            ->update(['status' => 'done', 'updated_at' => now()]);

        return back()->with('success', 'Selected documents set to Done!');
    }

    public function setSelectedInProgress(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:visa_docs,id',
        ]);

        VisaDoc::whereIn('id', $request->ids)
            ->whereNull('deleted_at')
            ->update(['status' => 'in_progress', 'updated_at' => now()]);

        return back()->with('success', 'Selected documents set to In Progress!');
    }
}
