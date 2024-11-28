<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\Sale;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Models\Notification;
use App\Mail\PostMail;
use App\Models\User;

class SaleController extends Controller
{
    public function store(Request $request){
    
        
        $validator = Validator::make($request->all(),[
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => "All fields are mandatory",
                "errors" => $validator->messages()
            ], 422);
        }
        $product = Product::find($request-> product_id);
        if($product->product_quantity < $request -> quantity){
            return response()->json(["message" => "Not enough stock available"], 400);
        }
        $stockPercentage = ($product->product_quantity / $product->stock_limit) * 100;
        $stockPercentage = number_format($stockPercentage,  2); 
        
        $users = User::all();
        if ($stockPercentage < 40) {
            
            Notification::create([  
                "subject"=> "Product Status Alert!",
                "message" => "The status of " . $product->product_name . " is below " . $stockPercentage . "%",
                "percentage" => $stockPercentage
            ]);
            foreach ($users as $user) {
                Mail::to($user->email)
                    ->send(new PostMail("The status of " . $product->product_name . " is below " . $stockPercentage . "%", 
                    "Product Status Alert!"));
            }
        }
        

        $product->product_quantity -= $request->quantity;
        $product->save();
        $sale = Sale::create($request->all());
        return response()->json($sale , 201);
    }
    public function report(Request $request)
    {
        $validator = Validator::make($request->all(), [
            
            'filter_date' => 'required|date',
        
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => "Invalid input.",
                "errors" => $validator->messages()
            ], 422);
        }
        $sales = Sale::whereDate('created_at', $request->filter_date)->get();
        $salesData = [];

        foreach($sales as $sale){
            $product = Product::find($sale->product_id); 
            if($product){
                $salesData[] = [
                    "date" => $sale->created_at->format('Y-m-d'),
                    "total" => $sale->quantity * $product->product_price,
                    "total_quantity" => $sale->quantity,
                    "product_name" => $product->product_name,
                    "product_type" => $product->product_type,
                ];
            }
            
        }

        if (!$salesData) {
            return response()->json(['error' => 'No matching sales records found for the specified product and date range.'], 404);
        }
    
        return response()->json([
            "sales" => $salesData,
        
        ]);
    }
    


}