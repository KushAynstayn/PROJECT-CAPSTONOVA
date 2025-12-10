<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformType extends Model
{
    use HasFactory;

    protected $table = 'platform_types';
    protected $guarded = [];

    public function projects()
    {
        return $this->belongsToMany(CapstoneProject::class, 'project_platforms', 'platform_type_id', 'project_id');
    }
}
