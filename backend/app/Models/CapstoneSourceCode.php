<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CapstoneSourceCode extends Model
{
    use HasFactory;
    protected $table = 'capstone_source_codes';
    protected $guarded = [];

    public function project()
    {
        return $this->belongsTo(CapstoneProject::class, 'project_id');
    }

    public function programmingLanguages()
    {
        return $this->belongsToMany(ProgrammingLanguage::class, 'project_languages', 'source_code_id', 'language_id');
    }
}