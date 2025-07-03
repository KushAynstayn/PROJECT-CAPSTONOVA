<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserLog extends Model
{
    use HasFactory;
    protected $table = 'user_logs';
    protected $primaryKey = 'log_id';
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function actionType()
    {
        return $this->belongsTo(ActionType::class);
    }
}