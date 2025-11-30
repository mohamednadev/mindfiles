<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Journal>
 */
class JournalFactory extends Factory
{
    protected $model = \App\Models\Journal::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3), // realistic page title
            'content' => $this->faker->paragraphs(rand(3, 7), true), // multiple paragraphs
            'created_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'updated_at' => now(),
        ];
    }
}
