<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FileChunk extends Model
{
    use HasFactory;

    protected $table = 'file_chunks';
    protected $guarded = [];

    /**
     * The parent chunked upload process.
     */
    public function chunkedUpload(): BelongsTo
    {
        return $this->belongsTo(ChunkedUpload::class);
    }
}
