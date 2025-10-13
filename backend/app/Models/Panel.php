<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Panel extends Model
{
    use HasFactory;

    protected $table = 'panels';
    protected $primaryKey = 'panel_id';
    protected $guarded = [];

    /**
     * Get the project researcher group associated with the panel.
     */
    public function projectResearcher(): BelongsTo
    {
        return $this->belongsTo(ProjectResearcher::class, 'project_researcher_id');
    }
}
