<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Whitelist extends Model
{
    use HasFactory;
    protected $table = 'whitelist';
    protected $primaryKey = 'whitelist_id';
    protected $guarded = [];

    public function adviser()
    {
        return $this->belongsTo(User::class, 'adviser_id');
    }
    
}