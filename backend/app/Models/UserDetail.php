<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDetail extends Model
{
    use HasFactory;
    protected $table = 'user_details';
    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function adviser()
    {
        return $this->belongsTo(User::class, 'adviser_id');
    }
}