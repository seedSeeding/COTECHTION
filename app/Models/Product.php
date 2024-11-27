<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $fillable = [
        'batch',
        'product_type',
        'product_catigory',
        'product_image',
        'product_name',
        'product_price',
        'product_quantity',
        'stock_limit',
        'product_date',
        'expiration_date'
        

    ];
}
