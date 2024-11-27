<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class VerificationController extends Controller
{
    public function sendVerificationCode(Request $request)
    {
        $request->validate(['id' => 'required|integer|exists:users,id']);
        $user = User::find($request->id);
        $verificationCode = Str::random(6);
        $user->verification_code = $verificationCode;
        $user->save();

        Mail::raw("Your verification code is: {$verificationCode}", function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Email Verification Code');
        });

        return response()->json(['message' => 'Verification code sent to ' . $user->email]);
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'code' => 'required|string',
        ]);

        $user = User::find($request->id);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->verification_code === $request->code) {
            $user->markEmailAsVerified();
            $user->verification_code = null;
            $user->save();

            return response()->json(['message' => 'Email verified successfully.']);
        }

        return response()->json(['message' => 'Invalid verification code.'], 422);
    }

    public function resendVerificationCode(Request $request)
    {
        $request->validate(['id' => 'required|integer|exists:users,id']);
        $user = User::find($request->id);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $verificationCode = Str::random(6);
        $user->verification_code = $verificationCode;
        $user->save();

        Mail::raw("Your new verification code is: {$verificationCode}", function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Email Verification Code');
        });

        return response()->json(['message' => 'Verification code resent to ' . $user->email]);
    }
}
