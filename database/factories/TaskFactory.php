<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Task;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition()
    {
        $categories = ["spirituality", "intelligence", "skills", "health", "body_kinesthetic", "awareness"];
        $statuses = ["pending", "in_progress"]; // Only these two

        return [
            'title'       => $this->faker->sentence(3),
            'category'    => $this->faker->randomElement($categories),
            'status'      => $this->faker->randomElement($statuses),
            'recurring'   => $this->faker->boolean(70), // 70% chance recurring
            'user_id'     => User::inRandomOrder()->first()->id,
            'created_at'  => now(),
            'updated_at'  => now(),
        ];
    }
}
