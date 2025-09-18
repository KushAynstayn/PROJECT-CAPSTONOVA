<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectAttachment extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'project_attachments';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'attachment_id';

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * Get the project that owns the attachments.
     */
    public function project()
    {
        return $this->belongsTo(CapstoneProject::class, 'project_id');
    }
}
