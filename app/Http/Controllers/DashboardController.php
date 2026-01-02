<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Ticket;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Define common base props
        $props = [
            'auth_user' => $user,
            'totalTickets' => 0,
            'activeTickets' => 0,
            'users' => null, // Initialized as null
            'recentUserTickets' => [],
            'viewType' => 'user', // Default view
        ];

        
        if ($user->role === 'superadmin') {
            $props['viewType'] = 'superadmin';
            $props['totalTickets'] = Ticket::count();
            $props['activeTickets'] = Ticket::whereIn('status', ['pending', 'inprogress'])->count();
            
            
            $props['users'] = User::latest()->paginate(5); 
            $props['totalUsersCount'] = User::count();
        } 
        
        
        elseif ($user->is_admin) {
            $props['viewType'] = 'admin';
            $props['totalTickets'] = Ticket::count();
            $props['activeTickets'] = Ticket::whereIn('status', ['pending', 'inprogress'])->count();
            
            // Admins don't see the user list on dashboard, just ticket stats
            $props['recentTickets'] = Ticket::with('author')->latest()->limit(5)->get();
        } 
        
        // 3. REGULAR USER LOGIC
        else {
            $userTicketsQuery = Ticket::where('created_by', $user->id)
                ->orWhere('assigned_to', $user->id);

            $props['viewType'] = 'user';
            $props['totalTickets'] = $userTicketsQuery->count();
            $props['activeTickets'] = (clone $userTicketsQuery)
                ->whereIn('status', ['pending', 'inprogress'])->count();
            $props['recentUserTickets'] = $userTicketsQuery->latest()->limit(5)->get();
        }

        return Inertia::render('Dashboard', $props);
    }
}