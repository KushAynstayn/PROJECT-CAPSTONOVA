<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne; // Import HasOne

class ProjectResearcher extends Model
{
    use HasFactory;

    protected $table = 'project_researchers';
    protected $guarded = [];

    public function project()
    {
        return $this->belongsTo(CapstoneProject::class, 'project_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the panel associated with the project researcher group.
     */
    public function panel(): HasOne
    {
        return $this->hasOne(Panel::class, 'project_researcher_id');
    }
}
