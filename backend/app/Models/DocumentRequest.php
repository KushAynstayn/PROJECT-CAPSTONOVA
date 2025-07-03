<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentRequest extends Model
{
    use HasFactory;
    protected $table = 'document_requests';
    protected $primaryKey = 'request_id';
    protected $guarded = [];

    public function viewer()
    {
        return $this->belongsTo(User::class, 'viewer_id');
    }

    public function project()
    {
        return $this->belongsTo(CapstoneProject::class, 'project_id');
    }
}