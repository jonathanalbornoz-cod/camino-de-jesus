<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPhoto extends Model
{
    protected $fillable = ['user_id', 'path', 'position'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
