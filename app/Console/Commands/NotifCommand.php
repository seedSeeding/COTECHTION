<?php

namespace App\Console\Commands;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Mail;
use App\Mail\PostMail;
use App\Models\Product;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Console\Command;

class NotifCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:notif-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking product expiration...');

       
        $products = Product::all();

     	$users = User::all();
        foreach ($products as $product) {
          
            $daysUntilExpiration = Carbon::now()->diffInDays(Carbon::parse($product->expiration_date), false);
            $daysUntilExpiration = abs((int)$daysUntilExpiration);

           
            if ($daysUntilExpiration > 0 && $daysUntilExpiration <= 30) {
              	foreach ($users as $user){

                Mail::to($user->email)
                    ->send(new PostMail("Product Expiration Alert", "Your product {$product->name} will expire in {$daysUntilExpiration} days."));
}
            }
        }

        $this->info('Product expiration check completed.');
    }
    }

