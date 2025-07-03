<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActionType extends Model
{
    use HasFactory;
    protected $table = 'action_types';
    protected $guarded = [];

    public function userLogs()
    {
        return $this->hasMany(UserLog::class);
    }
}