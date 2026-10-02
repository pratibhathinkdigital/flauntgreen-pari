<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates a default admin user for the Flaunt Green portal.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@flauntgreen.com'],
            [
                'name'              => 'Admin',
                'email'             => 'admin@flauntgreen.com',
                'phone'             => '9000000000',
                'role'              => 'admin',
                'password'          => Hash::make('Admin@1234'),
                'email_verified_at' => now(), // Admin is pre-verified
                'otp_code'          => null,
                'otp_expires_at'    => null,
            ]
        );

        $this->command->info('✅ Admin user created: admin@flauntgreen.com / Admin@1234');
    }
}
