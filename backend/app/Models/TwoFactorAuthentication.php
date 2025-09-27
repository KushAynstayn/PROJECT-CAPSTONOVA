<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class TwoFactorAuthentication extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'two_factor_authentications';

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'code', // Hide the encrypted code by default
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Get the user that owns the 2FA record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Accessor to automatically decrypt the code attribute.
     */
    public function getCodeAttribute($value): string
    {
        try {
            return Crypt::decryptString($value);
        } catch (Exception $e) {
            return $value; // Return raw value if decryption fails
        }
    }

    /**
     * Mutator to automatically encrypt the code attribute when setting.
     */
    public function setCodeAttribute($value): void
    {
        $this->attributes['code'] = Crypt::encryptString($value);
    }

    /**
     * Check if the 2FA code has expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Check if the provided code matches the stored code.
     */
    public function verifyCode(string $code): bool
    {
        try {
            // Get the raw encrypted code from the database
            $encryptedCode = $this->getRawOriginal('code');

            // Decrypt the stored code
            $decryptedStoredCode = Crypt::decryptString($encryptedCode);

            // Compare the decrypted stored code with the input code
            return $decryptedStoredCode === $code;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Get the raw encrypted code (bypasses the accessor).
     */
    public function getEncryptedCode(): string
    {
        return $this->getRawOriginal('code');
    }

    /**
     * Scope a query to only include valid (non-expired) 2FA records.
     */
    public function scopeValid($query)
    {
        return $query->where('expires_at', '>', now());
    }

    /**
     * Scope a query to only include expired 2FA records.
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }
}
