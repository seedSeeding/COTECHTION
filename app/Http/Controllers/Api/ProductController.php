<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Mail\PostMail;
use App\Models\AccountLog;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Models\Notification;
class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
    
        if ($products->isNotEmpty()) {
            return response()->json($products);
        } else {
            return response()->json(['message' => 'No Records available'], 200);
        }
    }
    

    public function store(Request $request)
    {
        
        $validator = Validator::make($request->all(), [
            'batch' => 'required|integer',
            'product_type' => 'required|string',
            'product_catigory' => 'required|string',
            'product_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'product_name' => 'required|string',
            'product_price' => 'required|integer',
            'product_quantity' => 'required|integer',
            'stock_limit' => 'required',
            'expiration_date' => 'required',
            'product_date' => 'required',
            'user_email' =>  'required',
        ]);
        
        

        if ($validator->fails()) {
            return response()->json([
                'message' => "All fields are mandatory",
                "errors" => $validator->messages()
            ], 422);
        }
        if($request -> product_quantity > $request-> stock_limit){
            return response()->json([
                'message' => "Invalid Quantity",
            ], 422);
        }
        
        $imagePath = $request->file('product_image')->store('images', 'public');
        AccountLog::where('account', $request -> user()->email)
        ->whereNull('logout_time')
        ->latest()
        ->first()
        ->update(['activity' => "EDITED"]);
        $product = Product::create([
            "batch" => $request -> batch,
            "product_type" => $request->product_type,
            "product_catigory" => $request->product_catigory,
            "product_image" => $imagePath,
            "product_name" => $request->product_name,
            "product_quantity" => $request->product_quantity,
            "product_price" => $request->product_price,
            "stock_limit" => $request -> stock_limit,
            "product_date" => $request->product_date,
            "expiration_date" => $request->expiration_date,
        ]);

        return response()->json([
            'message' => 'Product Created Successfully',
            'data' => new ProductResource($product)
        ], 200);
    }

    public function show(Product $product)
    {
        return new ProductResource($product);
    }

    public function update(Request $request, Product $product)
    {
        
        $validator = Validator::make($request->all(), [
            'product_type' => 'required|string',
            'product_catigory' => 'required|string',
            'product_image' => 'nullable',
            'product_name' => 'required|string',
            'product_price' => 'required|integer',
            'product_quantity' => 'required|integer',
            'product_date' => 'required',
            'stock_limit' => 'required|integer',
            'expiration_date' => 'required',
            'user_email' =>  'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => "All fields are mandatory",
                "errors" => $validator->messages()
            ], 422);
        }

        if ($request->hasFile('product_image')) {
            if ($product->product_image && Storage::disk('public')->exists($product->product_image)) {
                Storage::disk('public')->delete($product->product_image);
            }
            $imagePath = $request->file('product_image')->store('images', 'public');
        } else {
            $imagePath = $product->product_image; 
        }

        AccountLog::where('account', $request -> user()->email)
                ->whereNull('logout_time')
                ->latest()
                ->first()
                ->update(['activity' => "EDITED"]);
        
     
            $users = User::all();
            Notification::create([  
                "subject"=> "Product Update",
                "message"=>$request -> product_name."is Updated by ".$request -> user()->email,
                
            ]);
            foreach ($users as $user) {
                Mail::to($user -> email)->send(new PostMail(
                    $request -> product_name ."is Updated by ".$request -> user()->email,
                    'Product Update'));    
            }
    
        
        $product->update([
            "product_type" => $request->product_type,
            "product_catigory" => $request->product_catigory,
            "product_image" => $imagePath,
            "product_name" => $request->product_name,
            "product_quantity" => $request->product_quantity,
            "product_price" => $request->product_price,
            "product_date" => $request->product_date,
            "stock_limit" => $request -> stock_limit,
            "expiration_date" => $request->expiration_date,
        ]);

        return response()->json([
            'message' => 'Product Updated Successfully',
            'data' => new ProductResource($product)
        ], 200);
    }
    
    public function destroy(Product $product)
    {
        Storage::disk('public')->delete($product->product_image);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }

    public function search(Request $request)
{
   
    $validator = Validator::make($request->all(), [
        'search' => 'required|string|min:1'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Search term is required and should be at least 1 character long.',
            'errors' => $validator->messages()
        ], 422);
    }

    
    $searchTerm = $request->input('search');

   
    $products = Product::where('product_name', 'LIKE', '%' . $searchTerm . '%')->get();

    if ($products->isEmpty()) {
        return response()->json(['message' => 'No products found matching your search criteria.'], 200);
    }

    return response()->json(ProductResource::collection($products), 200);
}
/*public function products_by_batch(Request $request)
{
   
    $products = Product::all();

    
    $formattedProducts = [];

   
    foreach ($products as $product) {
        $productName = $product->product_name;
        $batch = $product->batch;

       
        if (!isset($formattedProducts[$productName])) {
            $formattedProducts[$productName] = [
                'batch' => []
            ];
        }

       
        $formattedProducts[$productName]['batch'][$batch] = [
            'id' => $product->id,
            'product_type' => $product->product_type,
            'product_category' => $product->product_catigory,
            'product_image' => $product->product_image,
            'product_price' => $product->product_price,
            'product_quantity' => $product->product_quantity,
            'stock_limit' => $product->stock_limit,
            'product_date' => $product->product_date,
            'expiration_date' => $product->expiration_date,
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
        ];
    }

  
    return response()->json($formattedProducts, 200);
}
*/
public function products_by_batch(Request $request)
{
    $products = Product::all();
    $formattedProducts = [];

    foreach ($products as $product) {
        $productName = $product->product_name;
        $batch = $product->batch;

     
        if (!isset($formattedProducts[$productName])) {
            $formattedProducts[$productName] = [
                'product_name' => $productName,
                'batch' => []
            ];
        }

       
        $formattedProducts[$productName]['batch'][] = [
            'batch' => $batch,
            'id' => $product->id,
            'product_type' => $product->product_type,
            'product_category' => $product->product_catigory,
            'product_image' => $product->product_image,
            'product_price' => $product->product_price,
            'product_quantity' => $product->product_quantity,
            'stock_limit' => $product->stock_limit,
            'product_date' => $product->product_date,
            'expiration_date' => $product->expiration_date,
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
            'product_name' => $product-> product_name
        ];
    }

    
    $result = array_values($formattedProducts);

    return response()->json($result, 200);
}

public function add_batch(Request $request)
{
    
    $validator = Validator::make($request->all(), [
        'batch' => 'required|integer',
        'product_type' => 'required|string',
        'product_catigory' => 'required|string',
        'product_image' => 'required|string',
        'product_name' => 'required|string',
        'product_price' => 'required|integer',
        'product_quantity' => 'required|integer',
        'stock_limit' => 'required',
        'expiration_date' => 'required',
        'product_date' => 'required',
        'user_email' =>  'required',
    ]);
    
    

    if ($validator->fails()) {
        return response()->json([
            'message' => "All fields are mandatory",
            "errors" => $validator->messages()
        ], 422);
    }
    if($request -> product_quantity > $request-> stock_limit){
        return response()->json([
            'message' => "Invalid Quantity",
        ], 422);
    }
    
    AccountLog::where('account', $request -> user()->email)
    ->whereNull('logout_time')
    ->latest()
    ->first()
    ->update(['activity' => "EDITED"]);
    $product = Product::create([
        "batch" => $request -> batch,
        "product_type" => $request->product_type,
        "product_catigory" => $request->product_catigory,
        "product_image" => $request->product_image,
        "product_name" => $request->product_name,
        "product_quantity" => $request->product_quantity,
        "product_price" => $request->product_price,
        "stock_limit" => $request -> stock_limit,
        "product_date" => $request->product_date,
        "expiration_date" => $request->expiration_date,
    ]); 

    return response()->json([
        'message' => 'Added Batch Successfully',
        'data' => new ProductResource($product)
    ], 200);
}

}
