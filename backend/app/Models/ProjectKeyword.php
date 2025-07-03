<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectKeyword extends Model
{
    use HasFactory;
    protected $table = 'project_keywords';
    protected $guarded = [];

    public function project()
    {
        return $this->belongsTo(CapstoneProject::class, 'project_id');
    }

    public function keyword()
    {
        return $this->belongsTo(Keyword::class);
    }
}