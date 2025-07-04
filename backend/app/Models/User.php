<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';
    protected $guarded = [];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function userDetail()
    {
        return $this->hasOne(UserDetail::class);
    }

    public function advisedProjects()
    {
        return $this->hasMany(CapstoneProject::class, 'adviser_id');
    }

    public function advisedSuggestions()
    {
        return $this->hasMany(Suggestion::class, 'adviser_id');
    }

    public function interestedSuggestions()
    {
        return $this->hasMany(Suggestion::class, 'interested_student_id');
    }

    public function advisedWhitelists()
    {
        return $this->hasMany(Whitelist::class, 'adviser_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function projectResearchers()
    {
        return $this->hasMany(ProjectResearcher::class);
    }

    public function projects()
    {
        return $this->belongsToMany(CapstoneProject::class, 'project_researchers');
    }

    public function documentRequests()
    {
        return $this->hasMany(DocumentRequest::class, 'viewer_id');
    }

    public function viewerAccesses()
    {
        return $this->hasMany(ViewerAccess::class);
    }

    public function viewerApprovalHistories()
    {
        return $this->hasMany(ApprovalHistory::class, 'viewer_id');
    }

    public function approvedHistories()
    {
        return $this->hasMany(ApprovalHistory::class, 'approver_id');
    }

    public function userLogs()
    {
        return $this->hasMany(UserLog::class);
    }
}