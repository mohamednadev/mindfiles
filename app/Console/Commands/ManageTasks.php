<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Task;

class ManageTasks extends Command
{
    protected $signature = 'tasks:manage';
    protected $description = 'Mark non-done tasks as overdue, delete all tasks, and recreate only recurring tasks';

    public function handle(): void
    {
        // 1️⃣ Mark all non-done tasks as overdue
        $tasksToOverdue = Task::where('status', '!=', 'done')->get();
        foreach ($tasksToOverdue as $task) {
            $task->update(['status' => 'overdue']);
        }
        $this->info('Marked '.count($tasksToOverdue).' tasks as overdue.');

        // 2️⃣ Get recurring tasks BEFORE deletion
        $recurringTasksData = Task::where('recurring', true)->get();
        $this->info('Found '.count($recurringTasksData).' recurring tasks.');

        // 3️⃣ Delete ALL tasks
        $totalDeleted = Task::query()->delete();
        $this->info('Deleted ALL tasks: '.$totalDeleted);

        // 4️⃣ Recreate recurring tasks fresh
        foreach ($recurringTasksData as $task) {
            Task::create([
                'title'       => $task->title,
                'category'  => $task->category, 
                'status'      => 'pending',
                'recurring'   => true,
                'user_id'     => $task->user_id,
            ]);
        }

        $this->info('Recreated '.count($recurringTasksData).' recurring tasks.');
    }
}
