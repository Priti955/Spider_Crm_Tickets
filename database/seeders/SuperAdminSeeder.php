<?php


namespace Database\Seeders; 

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
   
    public function run(): void
    {
        
        $superAdminRole = 3; 

        
        if (!User::where('email', 'sahoosimali85@gmail.com')->exists()) {
            
            User::create([
                'name' => 'Super Administrator',
                'email' => 'sahoosimali85@gmail.com', 
                'password' => Hash::make('Sahoo@12'), 
                'role' => $superAdminRole, 
            ]);

            echo "Super Admin user created successfully with email: sahoosimali85@gmail.com\n";
        } else {
             echo "Super Admin user already exists. Skipping creation.\n";
        }
    }
}