<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}