<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        // Create 50 tasks with only pending or in_progress status
        Task::factory()->count(50)->create();
    }
}
