<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Whitelist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;

class WhitelistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing Proponents and Advisers
        $proponents = User::where('role', 'Proponent')->get();
        $advisers = User::where('role', 'Adviser')->pluck('id');

        if ($proponents->isEmpty() || $advisers->isEmpty()) {
            // If no proponents or advisers, create 10 random entries as a fallback
            Whitelist::factory()->count(10)->create();
            return;
        }

        // Create a whitelist entry for each existing proponent
        foreach ($proponents as $proponent) {
            $email = $proponent->getRawOriginal('encrypted_email'); // Get the original encrypted value

            // Decrypt to re-hash, simulating what would happen in the app
            try {
                $decryptedEmail = Crypt::decryptString($email);
            } catch (\Exception $e) {
                // Handle cases where decryption might fail for dummy data
                $decryptedEmail = "proponent{$proponent->id}@example.com";
            }

            Whitelist::factory()->create([
                'user_id'       => $proponent->id,
                'encrypted_email' => $email,
                'hashed_email'    => hash('sha256', $decryptedEmail),
                'adviser_id'    => $advisers->random(),
            ]);
        }
    }
}
