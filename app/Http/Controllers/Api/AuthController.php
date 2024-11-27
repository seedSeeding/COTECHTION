<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AccountLog;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
           
            'email'=> 'required|email|max:255',
            'password' => 'required|string|min:8|max:255'
        ]);

        $user = User::where('email', $request->email)->first();
        
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'The provided credentials are incorrect'], 401);
        }

        $token = $user->createToken($user->name.'Auth-Token')->plainTextToken;
        AccountLog::create([
            'account' => $user->email, 
            'activity' => "LOGGED IN",
            'login_time' => now(), 
        ]);
        //$user->markEmailAsVerified();
        return response()->json([
            'message' => "Login Successful",
            'token_type' => 'Bearer',
            'token' => $token,
            'position' => $user -> position,
            'isVerified' => $user -> email_verified_at,
            'user_id' => $user -> id,
        ], 200);
    }

    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email'=> 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:8|max:255',
            'position'=> 'required|string|max:255',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'position' => $request->position,
        ]);

        if ($user) {
            $token = $user->createToken($user->name.'Auth-Token')->plainTextToken;
          
            return response()->json([
                'message' => "Registration Successful",
                'token_type' => 'Bearer',
                'token' => $token,
                'user_id' => $user -> id
            ], 201);
        } else {
            return response()->json(['message' => "Something went wrong during registration"], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user) {
            AccountLog::where('account', $user->email)
                ->whereNull('logout_time')
                ->latest()
                ->first()
                ->update(['logout_time' => now()]);

            $user->currentAccessToken()->delete();
            return response()->json(['message' => 'Logged out successfully'], 200);
        } else {
            return response()->json(['message' => "User Not Found."], 404);
        }
    }

    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user) {
            return response()->json([
                'message' => 'Profile Fetched.',
                'data' => $user
            ], 200);
        } else {
            return response()->json(['message' => "Not Authenticated."], 401);
        }
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $request->validate([
            'id' => 'required|exists:users,id',
            'current_password' => 'required|string|min:8|max:255',
            'new_password' => 'required|string|min:8|max:255'
        ]);

        $user = User::find($request->id);

        if (!$user || !Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        AccountLog::create([
            'account' => $user->email,
            'activity' => "PASSWORD UPDATED",
            'login_time' => now(),
        ]);

        return response()->json(['message' => 'Password updated successfully.'], 200);
    }
}
