<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ... (commented factory code is fine)

        $this->call([
            // This line is correct because SuperAdminSeeder is in the same namespace
            SuperAdminSeeder::class, 
        ]);
    }
}