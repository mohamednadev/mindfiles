<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskController extends Controller
{
    // List all tasks
    public function index()
    {
        $tasks = Task::all();
        return Inertia::render('tasks', [
            'tasks' => $tasks,
        ]);
    }

    // Add a new task
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:spirituality,intelligence,skills,health,body_kinesthetic,awareness',
            'recurring' => 'nullable|boolean', // validate recurring as boolean (true/false)
        ]);

        Task::create([
            'title' => $request->title,
            'category' => $request->category,
            'status' => 'pending',
            'recurring' => $request->recurring ?? true, // default to true if not provided
            'user_id' => Auth::id(),
        ]);

        return back()->with('success', 'Task added successfully!');
    }

    // Edit a task
    public function update(Request $request, Task $task)
    {
        if ($task->status === 'done') {
            return back()->with('error', 'Cannot edit a completed task!');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'recurring' => 'nullable|boolean',
        ]);

        $task->update([
            'title' => $request->title,
            'recurring' => $request->recurring ?? $task->recurring,
        ]);

        return back()->with('success', 'Task updated successfully!');
    }

    // Single task status methods
    public function setDone(Task $task) { return $this->setStatus($task, 'done'); }
    public function setInProgress(Task $task) { return $this->setStatus($task, 'in_progress'); }
    public function setPending(Task $task) { return $this->setStatus($task, 'pending'); }

    // Bulk selected task status methods
    public function setSelectedDone(Request $request) { return $this->setSelectedStatus($request, 'done'); }
    public function setSelectedInProgress(Request $request) { return $this->setSelectedStatus($request, 'in_progress'); }
    public function setSelectedPending(Request $request) { return $this->setSelectedStatus($request, 'pending'); }

    // Private helper for single status
    private function setStatus(Task $task, $status)
    {
        if ($task->status === 'done') {
            return back()->with('error', 'Cannot change status of a completed task!');
        }

        $task->update(['status' => $status]);

        if ($status === 'done') {
            $this->addPoints($task);
        }

        return back()->with('success', 'Task status updated!');
    }

    // Private helper for bulk status
    private function setSelectedStatus(Request $request, $status)
    {
        $request->validate([
            'task_ids' => 'required|array',
            'task_ids.*' => 'exists:tasks,id',
        ]);

        $tasks = Task::whereIn('id', $request->task_ids)
                     ->where('status', '!=', 'done')
                     ->get();

        foreach ($tasks as $task) {
            $task->update(['status' => $status]);
            if ($status === 'done') {
                $this->addPoints($task);
            }
        }

        return back()->with('success', 'Selected tasks updated!');
    }

    // Helper function to add points based on category
    private function addPoints(Task $task)
    {
        $user = $task->user;
        $points = $user->points()->firstOrCreate([]);

        switch ($task->category) {
            case 'spirituality': $points->increment('meditation'); break;
            case 'intelligence': $points->increment('brain'); break;
            case 'skills': $points->increment('skills'); break;
            case 'health': $points->increment('diet'); break;
            case 'body_kinesthetic': $points->increment('training'); break;
            case 'awareness': $points->increment('analyse'); break;
        }
    }
}
