<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\PostMail;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;

class ProductExpirationAlert extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'product:expiration-alert';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send an alert email for products expiring within 30 days';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {	
	$users = User::all();
        $products = Product::all();
        foreach ($products as $product) {
            $daysUntilExpiration = Carbon::now()->diffInDays(Carbon::parse($product->expiration_date), false);
            if ($daysUntilExpiration > 0 && $daysUntilExpiration <= 30) {
                foreach($users as $user){
		Mail::to($user -> email)->send(new PostMail("Product Expiration Alert", "Your product {$product->name} will expire in {$daysUntilExpiration} days."));
            }}
        }

        $this->info('Expiration alerts sent successfully!');
        return 0;
    }
}
