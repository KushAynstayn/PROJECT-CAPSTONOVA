<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Whitelist extends Model
{
    use HasFactory;

    protected $table = 'whitelist';
    protected $primaryKey = 'whitelist_id';
    protected $guarded = [];

    // REMOVED: The user() relationship was incorrect for this table's purpose.

    /**
     * Get the adviser associated with the whitelisted entry.
     */
    public function adviser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'adviser_id');
    }
}
