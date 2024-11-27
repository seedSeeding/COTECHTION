<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AccessRegister; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; 
use Illuminate\Support\Facades\Auth; 

class AccessRegisterController extends Controller
{
  
    public function register(Request $request)
    {
        
        $request->validate([
            'password' => 'required|min:6', 
        ]);

        
        $user = new AccessRegister();
        $user->password = Hash::make($request->password); 
        $user->save();

        return response()->json(['message' => 'User registered successfully.'], 201);
    }

   
    public function login(Request $request)
{
   
    $request->validate([
        'password' => 'required',
    ]);

   
    $user = AccessRegister::first(); 
   
    if ($user && Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Login successful.'], 200);
    }

    return response()->json(['message' => 'Invalid credentials.'], 401);
}

    
}
