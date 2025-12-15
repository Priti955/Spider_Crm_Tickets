<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'status',
        'file_path',
        'created_by',
        'assigned_to',
        'assigned_at',
        'completed_at',
    ];

    protected $dates = ['assigned_at', 'completed_at', 'deleted_at'];

 
    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }


    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
    
}
