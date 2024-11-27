<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //return parent::toArray($request);
        return [
            "id"=> $this->id,
            "product_type" => $this->product_type,
            "product_catigory" => $this->product_catigory,
            "product_image" => $this->product_image,
            "product_name" => $this->product_name,
            "product_quantity" => $this->product_quantity,
            "product_price" => $this->product_price,
            "product_date" => $this-> product_date,
            'stock_limit' => $this->stock_limit,
            "expiration_date"=> $this->expiration_date,
            "created_at"=> $this->created_at,
            
        ];
    }
}
