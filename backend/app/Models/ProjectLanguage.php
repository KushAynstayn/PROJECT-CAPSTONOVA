<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectLanguage extends Model
{
    use HasFactory;
    protected $table = 'project_languages';
    protected $guarded = [];

    public function sourceCode()
    {
        return $this->belongsTo(CapstoneSourceCode::class, 'source_code_id');
    }

    public function programmingLanguage()
    {
        return $this->belongsTo(ProgrammingLanguage::class, 'language_id');
    }
}