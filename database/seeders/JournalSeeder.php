<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Journal;

class JournalSeeder extends Seeder
{
    public function run(): void
    {
        // Create 10–15 journal pages for the single user
        Journal::factory(rand(10, 15))->create([
            'user_id' => 1, // assign to your single user
        ]);
    }
}
