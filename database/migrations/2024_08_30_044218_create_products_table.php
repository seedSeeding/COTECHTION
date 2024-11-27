<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {

            $table->id();
            $table->integer('batch');
            $table->string('product_type');
            $table->string('product_catigory')->nullable();
            $table->string('product_image')->nullable(); 
            $table->string('product_name'); 
            $table->decimal('product_price', 8, 2); 
            $table->integer('product_quantity');
            $table->integer('stock_limit');
            $table->date('product_date')->nullable();
            $table->date('expiration_date')->nullable();
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
