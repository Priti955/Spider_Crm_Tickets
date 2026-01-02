<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response; 

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * God Mode: Grant total access to Admins and Superadmins.
     */
    public function before(User $user, $ability)
    {
        // FIX: Check both the boolean column and the role string
        if ($user->is_admin || $user->role === 'superadmin') {
            return true; 
        }
        
        return null; 
    }

    public function viewAny(User $user)
    {
        // This is only reached by non-admins because of the 'before' method.
        return Response::deny('Only administrators can view the user list.');
    }

    public function create(User $user): Response
    {
         return Response::deny('Only administrators can create users.');
    }

    public function update(User $user, User $model): Response
    {
        // Normal users can only update themselves. 
        // Admins pass through 'before' and can update anyone.
        return $user->id === $model->id
            ? Response::allow()
            : Response::deny('You can only update your own profile.');
    }

    public function delete(User $user, User $model): Response
    {
        // Safety: No one (even a Superadmin) should delete themselves while logged in.
        if ($user->id === $model->id) {
            return Response::deny('You cannot delete your own account while logged in.');
        }

        
        return Response::deny('Only administrators can delete users.');
    }
}