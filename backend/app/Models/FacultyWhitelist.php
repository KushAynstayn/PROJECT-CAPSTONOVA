<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;
use Exception;

class FacultyWhitelist extends Model
{
    protected $table = 'faculty_whitelist';
    protected $primaryKey = 'faculty_whitelist_id'; // Matches the new migration PK

    protected $guarded = [];

    /**
     * Accessor to automatically decrypt the email.
     */
    public function getEncryptedEmailAttribute($value)
    {
        try {
            return Crypt::decryptString($value);
        } catch (Exception $e) {
            return $value;
        }
    }

    /**
     * Mutator to automatically encrypt the email when setting it.
     */
    public function setEncryptedEmailAttribute($value)
    {
        $this->attributes['encrypted_email'] = Crypt::encryptString($value);
    }
}
