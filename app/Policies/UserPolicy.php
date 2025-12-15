<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response; 
class UserPolicy
{
    use HandlesAuthorization;

    
    public function before(User $user, $ability)
    {
       
        if ($user->is_admin) {
            return true; 
        }
        
        
        return null; 
    }

   
    public function viewAny(User $user)
    {
        
        return Response::deny('Only administrators can view the user list.');
    }

    
    public function update(User $user, User $model): Response
    {
       
        return $user->id === $model->id
            ? Response::allow()
            : Response::deny('You can only update your own profile.');
    }

    
    public function create(User $user): Response
    {
         return Response::deny('Only administrators can create users.');
    }
    
   
public function delete(User $user, User $model): Response
{
    if ($user->id === $model->id) {
        return Response::deny('You cannot delete your own account while logged in.');
    }
    
   
    return Response::allow(); 
}
}