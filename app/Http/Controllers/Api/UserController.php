<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
class UserController extends Controller
{
    public function index(Request $reuest){
        
        $users = User::all();
        //Mail::to("yellyhaze000@gmail.com")->send(new PostMail("fwqefeqf","eqfqefqfefe"));
        if ($users->count() > 0) {
            return response()->json($users);
        } else {
            return response()->json(['message' => 'No Records available'], 200);
        }

    }
    public function checkUserStatus($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['status' => 'User not found'], 404);
        }

        $lastSeen = $user->last_seen;
        $isOnline = $lastSeen && $lastSeen->diffInMinutes(now()) < 5;

        return response()->json(['online' => $isOnline]);
    }
}
