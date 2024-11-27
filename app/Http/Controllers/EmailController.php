<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;

use App\Mail\PostMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use PharIo\Manifest\Email;

class EmailController extends Controller
{
    public function sendEmail(Request $request){
        
        $validate = Validator::make($request->all(), [
            "email" => "required" ,
            "product" => "required",
            "percentage" => "required",
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => "All fields are mandatory",
                "errors" => $validate->messages()
            ], 422);
        }
        
        $toEmail = "yellyhaze000@gmail.com";
        $message = "HHHAHAHHHHAHAHAHHAh";
        $subject = "ahhahsqvqv";
        
        $response = Mail::to($toEmail)->send(new PostMail($message,$subject));
       
    }
}
