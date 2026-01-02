<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TicketPolicy
{
    use HandlesAuthorization;

    /**
     * The 'before' method runs before any other checks.
     * This fulfills the 'Access Control Layer' requirement by allowing
     * Superadmins and Admins to bypass standard user restrictions.
     */
    public function before(User $user, $ability)
    {
        if ($user->role === 'superadmin' || $user->is_admin) {
            return true;
        }
    }

    public function viewAny(User $user)
    {
        return true; 
    }

    public function view(User $user, Ticket $ticket)
    {
        // Security Rule: No User can see any other author or assigned tickets
        return $ticket->created_by === $user->id || $ticket->assigned_to === $user->id;
    }

    public function update(User $user, Ticket $ticket) 
    {
        // Security Rule: Only Author can update all Ticket details
        return $user->id === $ticket->created_by; 
    }
    
    public function updateStatus(User $user, Ticket $ticket): bool
    {
        // Security Rule: Assignee can update Ticket status to Completed/InProgress
        return $ticket->assigned_to === $user->id;
    }

    public function delete(User $user, Ticket $ticket)
    {
        // Restricted to Author or Admin (via before)
        return $ticket->created_by === $user->id;
    }
}