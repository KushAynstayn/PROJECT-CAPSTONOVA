<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChunkedUpload extends Model
{
    use HasFactory;

    protected $table = 'chunked_uploads';
    protected $guarded = [];

    /**
     * The user who initiated the upload.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The individual file chunks associated with the upload.
     */
    public function fileChunks(): HasMany
    {
        return $this->hasMany(FileChunk::class);
    }
}
