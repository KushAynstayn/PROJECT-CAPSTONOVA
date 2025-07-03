<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suggestion extends Model
{
    use HasFactory;
    protected $table = 'suggestions';
    protected $primaryKey = 'suggestion_id';
    protected $guarded = [];

    public function adviser()
    {
        return $this->belongsTo(User::class, 'adviser_id');
    }

    public function interestedStudent()
    {
        return $this->belongsTo(User::class, 'interested_student_id');
    }
}