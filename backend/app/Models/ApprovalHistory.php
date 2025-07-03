<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApprovalHistory extends Model
{
    use HasFactory;
    protected $table = 'approval_histories';
    protected $primaryKey = 'history_id';
    protected $guarded = [];

    public function viewer()
    {
        return $this->belongsTo(User::class, 'viewer_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function project()
    {
        return $this->belongsTo(CapstoneProject::class, 'project_id');
    }
}