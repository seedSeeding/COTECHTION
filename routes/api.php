<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\SaleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActivityController;
use Illuminate\Auth\Notifications\VerifyEmail;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\VerificationController;
use App\Http\Controllers\AccessRegisterController;

Route::get('/sales-rep' , [SaleController::class,'report']);
Route::post('/create-register-access', [AccessRegisterController::class, 'register']);
Route::post('/register-access', [AccessRegisterController::class, 'login']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/sendmail', [EmailController::class,'sendEmail']);


Route::post('/send-verification-code', [VerificationController::class, 'sendVerificationCode']);
Route::post('/verify-code', [VerificationController::class, 'verifyCode']);
Route::post('/resend-verification-code', [VerificationController::class, 'resendVerificationCode']);


Route::middleware(['auth:sanctum'])->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::apiResource('products', ProductController::class);
    
    Route::get('/user', function(Request $request){
        return $request->user();
    });
    Route::post('/store' , [SaleController::class,'store']);
    Route::get("/acc-log", [ActivityController::class,"index"]);
    Route::get("/notifications", [NotificationController::class,"index"]);
    Route::put('/update-password', [AuthController::class, 'updatePassword']);
    Route::get('/search', [ProductController::class, 'search']);
    Route::get('/product-by-batch',[ProductController::class,'products_by_batch']);    
    Route::post('/add-batch',[ProductController::class,'add_batch']);
    Route::get('/sales-report' , [SaleController::class,'report']);
    Route::get("/users", [UserController::class, "index"]);
});


