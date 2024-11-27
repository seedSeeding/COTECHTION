<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccessRegister extends Model
{
    use HasFactory;
    protected $table = 'register_pass';

    protected $fillable = [
        'password',
        
    ];
}
