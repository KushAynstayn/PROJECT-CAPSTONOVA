<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keyword extends Model
{
    use HasFactory;
    protected $table = 'keywords';
    protected $guarded = [];

    public function projects()
    {
        return $this->belongsToMany(CapstoneProject::class, 'project_keywords');
    }
}