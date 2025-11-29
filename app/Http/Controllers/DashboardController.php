<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Task;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Ensure points exist for this user
        $points = $user->points()->firstOrCreate([]);

        $categories = [
            'spirituality',
            'intelligence',
            'skills',
            'health',
            'body_kinesthetic',
            'awareness'
        ];

        // Shorter display names
        $categoryLabels = [
            'spirituality'      => 'Spirit',
            'intelligence'      => 'Brain',
            'skills'            => 'Skills',
            'health'            => 'Health',
            'body_kinesthetic'  => 'Body',
            'awareness'         => 'Aware'
        ];

        // Count tasks grouped by category including soft-deleted ones
        $taskCounts = Task::withTrashed()
            ->where('user_id', $user->id)
            ->select('category')
            ->selectRaw('COUNT(CASE WHEN status = "done" THEN 1 END) as done_count')
            ->selectRaw('COUNT(CASE WHEN status = "overdue" THEN 1 END) as overdue_count')
            ->groupBy('category')
            ->get()
            ->keyBy('category');

        // Prepare the final stats for Recharts
        $taskStats = [];
        foreach ($categories as $category) {
            $taskStats[] = [
                'category' => $categoryLabels[$category], // use short label
                'done'     => $taskCounts[$category]->done_count ?? 0,
                'overdue'  => $taskCounts[$category]->overdue_count ?? 0,
            ];
        }

        return Inertia::render('dashboard', [
            'points' => [
                'Meditation' => $points->meditation,
                'Brain'      => $points->brain,
                'Skills'     => $points->skills,
                'Diet'       => $points->diet,
                'Training'   => $points->training,
                'Analysis'   => $points->analyse,
            ],
            'taskStats' => $taskStats, // array ready for stacked bar chart
        ]);
    }
}
