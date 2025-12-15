<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TicketPolicy
{
    use HandlesAuthorization;

   
    public function before(User $user, $ability)
    {
       
        if (property_exists($user, 'is_admin') && $user->is_admin) {
            return true;
        }
    }

    
    public function viewAny(User $user)
    {
        return true; 
    }

    
    public function view(User $user, Ticket $ticket)
    {
        return $ticket->created_by === $user->id || $ticket->assigned_to === $user->id;
    }

   
    public function create(User $user)
    {
        return true; 
    }


    public function update(User $user, Ticket $ticket)
    {
        return $ticket->created_by === $user->id;
    }

    
    public function updateStatus(User $user, Ticket $ticket): bool
    {
        return $ticket->assigned_to === $user->id;
    }

   
    public function assign(User $user, Ticket $ticket): bool
    {
     
        return $user->is_admin;
    }

    public function delete(User $user, Ticket $ticket)
    {
        return $ticket->created_by === $user->id;
    }
}