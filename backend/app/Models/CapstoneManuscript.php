<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CapstoneManuscript extends Model
{
    use HasFactory;
    protected $table = 'capstone_manuscripts';
    protected $primaryKey = 'manuscript_id';
    protected $guarded = [];

    public function project()
    {
        return $this->belongsTo(CapstoneProject::class, 'project_id');
    }
}