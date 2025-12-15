<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Ticket;
use App\Policies\TicketPolicy;

class AuthServiceProvider extends ServiceProvider
{
    
  protected $policies = [
    \App\Models\Ticket::class => \App\Policies\TicketPolicy::class,
    \App\Models\User::class => \App\Policies\UserPolicy::class,
];

    
    public function boot(): void
    {
        $this->registerPolicies();
        Gate::define('update-ticket', function($user, Ticket $ticket){
        return $user->id === $ticket->created_by;
    });

    Gate::define('update-status', function($user, Ticket $ticket){
        return $user->id === $ticket->assigned_to;
    });
   
    }
}
