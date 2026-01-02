<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest; 

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');

        
        $this->authorizeResource(\App\Models\User::class, 'user');
    }


    public function index(Request $request)
{
    $currentUser = $request->user();

    // Include 'role' in the selection to distinguish superadmin
    $users = User::select('id', 'name', 'email', 'role', 'is_admin', 'created_at')
        ->latest()
        ->paginate(10)
        ->appends($request->query());

    $users->getCollection()->transform(function ($user) use ($currentUser) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role, // New: track the role string
            'is_admin' => (bool) $user->is_admin,
            'can_edit' => $currentUser->can('update', $user),
            'can_delete' => $currentUser->can('delete', $user) && $user->id !== $currentUser->id,
            'created_at' => $user->created_at->format('Y-m-d'),
        ];
    });

    return Inertia::render('Users/Index', [
        'users' => $users,
    ]);
}


    
    public function create()
    {
        
        return Inertia::render('Users/Create');
    }
    
    
    public function store(UserStoreRequest $request)
{
    $validatedData = $request->validated();
    
    User::create([
        'name' => $validatedData['name'],
        'email' => $validatedData['email'],
        'password' => Hash::make($validatedData['password']),
        'role' => $validatedData['role'] ?? 'user', // Handle the role
        'is_admin' => $validatedData['is_admin'] ?? false,
    ]);

    return redirect()->route('users.index')->with('success', 'User created successfully.');
}

  
    public function edit(User $user)
    {
       
        return Inertia::render('Users/Edit', [
            'user' => $user,
        ]);
    }
    
   
    public function update(UserUpdateRequest $request, User $user)
    {
        
        $validatedData = $request->validated();
        
        $user->update($validatedData);

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }
    
   

public function destroy(User $user)
{
    
    if ($user->id === Auth::id()) {
        return back()->withErrors(['error' => 'You cannot delete your own account.']);
    }
    
    $user->delete();

    return redirect()->route('users.index')
        ->with('success', 'User deleted successfully.');
}

}