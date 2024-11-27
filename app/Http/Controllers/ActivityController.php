<?php

namespace App\Http\Controllers;
use App\Models\AccountLog;
use App\Models\User;
use Illuminate\Http\Request;

class ActivityController extends Controller
{ public function index()
    {
        $logs = AccountLog::whereNotNull('logout_time')
        ->orderBy('login_time', 'desc')
        ->get();
    
    return response()->json($logs);
    

    }

    public function log_activity(Request $request)
    {
        AccountLog::create([
            'account' => $request -> email, 
            'activity' => $request -> activity,
            'login_time' => now(), 
        ]);
    }

    public function update_activity(Request $request){
        AccountLog::where('account', $request -> user()->email)
                ->where('login_time')
                ->latest()
                ->first()
                ->update(['logout_time' => now()]);
    }

    

}
