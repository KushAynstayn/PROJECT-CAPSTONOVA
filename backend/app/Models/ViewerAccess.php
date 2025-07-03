<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ViewerAccess extends Model
{
    use HasFactory;
    protected $table = 'viewer_accesses';
    protected $primaryKey = 'access_id';
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function project()
    {
        return $this->belongsTo(CapstoneProject::class, 'project_id');
    }
}