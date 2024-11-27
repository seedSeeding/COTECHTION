<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountLog extends Model
{
    use HasFactory;

    protected $table = 'accountlog';

    protected $fillable = [
        'account',
        'activity',
        'login_time',
        'logout_time'
    ];
}
