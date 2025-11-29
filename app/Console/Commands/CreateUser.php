<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateUser extends Command
{
    protected $signature = 'make:user';
    protected $description = 'Interactively create a new user';

    public function handle()
    {
        $this->info("Let's create a new user!");
        $this->line('--------------------------------');

        // Ask for name
        $name = $this->ask('Name');

        // Ask for email
        $email = $this->ask('Email');

        // Password (hidden)
        $password = $this->secret('Password');

        // Confirm
        if (!$this->confirm("Create user with name: $name and email: $email?")) {
            $this->error('User creation cancelled.');
            return;
        }

        // Create user
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
        ]);

        $this->info("User created successfully! (ID: {$user->id})");
    }
}
