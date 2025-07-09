<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CapstoneProject extends Model
{
    use HasFactory;
    protected $table = 'capstone_projects';
    protected $guarded = [];

    public function adviser()
    {
        return $this->belongsTo(User::class, 'adviser_id');
    }


    public function manuscript()
    {
        return $this->hasOne(CapstoneManuscript::class, 'project_id');
    }


    public function sourceCode()
    {
        return $this->hasOne(CapstoneSourceCode::class, 'project_id');
    }

    public function researcher()
    {
        return $this->belongsTo(User::class, 'project_researchers');
    }


    public function projectResearcher()
    {
        return $this->hasOne(ProjectResearcher::class, 'project_id');
    }

    public function keywords()
    {
        return $this->belongsToMany(Keyword::class, 'project_keywords', 'project_id', 'keyword_id');
    }

    public function documentRequests()
    {
        return $this->hasMany(DocumentRequest::class, 'project_id');
    }

    public function viewerAccesses()
    {
        return $this->hasMany(ViewerAccess::class, 'project_id');
    }

    public function approvalHistories()
    {
        return $this->hasMany(ApprovalHistory::class, 'project_id');
    }
}