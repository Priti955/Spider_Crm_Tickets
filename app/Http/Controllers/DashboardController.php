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


        $isAdmin = $user->is_admin ?? false;


        $props = [
            'totalTickets' => 0,
            'activeTickets' => 0,
            'users' => [],
            'recentUserTickets' => [],
        ];

        if ($isAdmin) {

            $props['users'] = User::latest()->paginate(10);
            $props['totalTickets'] = Ticket::count();
            $props['activeTickets'] = Ticket::whereIn('status', ['open', 'pending'])->count();


            $props['viewType'] = 'admin';
        } else {


            $userTicketsQuery = Ticket::where('created_by', $user->id)
                ->orWhere('assigned_to', $user->id);


            $props['viewType'] = 'user';


            $props['totalTickets'] = $userTicketsQuery->count();
            $props['activeTickets'] = (clone $userTicketsQuery)->whereIn('status', ['open', 'pending'])->count();


            $props['recentUserTickets'] = $userTicketsQuery->latest()->limit(5)->get();
        }


        $props['auth_user'] = $user;

        return Inertia::render('Dashboard', $props);
    }
}
