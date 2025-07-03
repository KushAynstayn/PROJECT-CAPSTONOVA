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

    public function manuscripts()
    {
        return $this->hasMany(CapstoneManuscript::class, 'project_id');
    }

    public function sourceCodes()
    {
        return $this->hasMany(CapstoneSourceCode::class, 'project_id');
    }

    public function researchers()
    {
        return $this->belongsToMany(User::class, 'project_researchers');
    }

    public function projectResearchers()
    {
        return $this->hasMany(ProjectResearcher::class, 'project_id');
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