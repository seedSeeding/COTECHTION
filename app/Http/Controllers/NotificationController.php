<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    public function index(){
        
        $notifications = Notification::orderBy("created_at","desc")->get();
        return response() -> json($notifications);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "subject"=> "required",
            "message"=> "required",
            "percentahe" => "nullable"
            
        ]

    );
    }
    public function mark_seen(Request $request){
        $validator = Validator::make($request->all(), [
            "id" => "required"
        ]);
        if($validator->fails()){
            return response()->json(["Something went wrong"]);
        }
        $notif = Notification::find($request->id);
        $notif->seen = "SEEN";
        $notif-> save();

        return response() -> json(["Succecfull"], 200);

    }
}
