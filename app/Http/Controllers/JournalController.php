<?php

namespace App\Http\Controllers;

use App\Models\Journal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JournalController extends Controller
{
    public function index()
    {
        return Inertia::render('journal', [
            'pages' => Journal::where('user_id', Auth::id())
                ->orderBy('id', 'asc')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        Journal::create([
            'user_id' => Auth::id(),
            'title' => $request->title ?? "New Page",
            'content' => $request->content ?? "",
        ]);

        return back();
    }

    public function update(Request $request, Journal $journal)
    {
        $journal->update($request->only('content', 'title'));
        return back()->with('success', 'Saved');
    }

    public function destroy(Journal $journal)
    {
        if ($journal->user_id !== Auth::id()) {
            abort(403);
        }

        $journal->delete();
        return back()->with('success', 'Deleted');
    }
}
