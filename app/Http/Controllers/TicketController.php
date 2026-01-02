<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        // authorizeResource links the controller to your TicketPolicy
        $this->authorizeResource(Ticket::class, 'ticket');
    }

    /**
     * Display a listing of tickets based on user role.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // CHECK: Role-based view access
        $canSeeAll = $user->is_admin || $user->role === 'superadmin';

        $ticketsQuery = Ticket::with([
            'author:id,name',
            'assignee:id,name',
        ]);

        // Security Rule: Users only see their own created or assigned tickets
        if (!$canSeeAll) {
            $ticketsQuery->where(function ($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhere('assigned_to', $user->id);
            });
        }

        $tickets = $ticketsQuery
            ->latest()
            ->paginate(10)
            ->appends($request->query());

        $tickets->getCollection()->transform(function ($ticket) {
            return [
                'id' => $ticket->id,
                'name' => $ticket->name,
                'status' => $ticket->status,
                'description' => $ticket->description,
                'file_url' => $ticket->file_path ? Storage::url($ticket->file_path) : null,
                'author' => $ticket->author,
                'assignee' => $ticket->assignee,
                'created_at' => $ticket->created_at->format('Y-m-d H:i'),
                'updated_at' => $ticket->updated_at->format('Y-m-d H:i'),
            ];
        });

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
        ]);
    }

    /**
     * Show form for creating a ticket.
     */
    public function create(Request $request)
    {
        $user = $request->user();
        $canAssign = $user->is_admin || $user->role === 'superadmin';

        return Inertia::render('Tickets/Create', [
            // Assignment Feature: Admin can assign user during creation
            'users' => $canAssign ? User::select('id', 'name')->get() : [],
            'canAssign' => $canAssign,
        ]);
    }

    /**
     * Store a newly created ticket.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|file|max:10240',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('tickets', 'public');
        }

        $data['created_by'] = Auth::id();
        $data['status'] = 'pending';

        // Auto-set assignment date if assigned during creation
        if (!empty($data['assigned_to'])) {
            $data['assigned_at'] = now();
        }

        $ticket = Ticket::create($data);

        return redirect()->route('tickets.show', $ticket->id)
            ->with('success', 'Ticket created successfully.');
    }

   
    public function show(Request $request, Ticket $ticket)
    {
        $ticket->load(['author', 'assignee']);

        return Inertia::render('Tickets/Show', [
            'ticket' => [
                'id' => $ticket->id,
                'name' => $ticket->name,
                'description' => $ticket->description,
                'status' => $ticket->status,
                'file_url' => $ticket->file_path ? Storage::url($ticket->file_path) : null,
                'author' => $ticket->author,
                'assignee' => $ticket->assignee,
                'created_at_formatted' => $ticket->created_at->format('Y-m-d H:i'),
                'updated_at_formatted' => $ticket->updated_at->format('Y-m-d H:i'),
                // Permission checks for UI buttons
                'canUpdateStatus' => $request->user()->can('updateStatus', $ticket),
                'canEdit' => $request->user()->can('update', $ticket),
                'canDelete' => $request->user()->can('delete', $ticket),
            ]
        ]);
    }

   
    public function edit(Request $request, Ticket $ticket)
    {
        $user = $request->user();
        $canAssign = $user->is_admin || $user->role === 'superadmin';

        return Inertia::render('Tickets/Edit', [
            'ticket' => $ticket,
            'users' => $canAssign ? User::select('id', 'name')->get() : [],
            'canAssign' => $canAssign,
        ]);
    }

    
    public function update(Request $request, Ticket $ticket)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,inprogress,completed,onhold',
            'assigned_to' => 'nullable|exists:users,id',
            'file' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('file')) {
            if ($ticket->file_path) Storage::disk('public')->delete($ticket->file_path);
            $data['file_path'] = $request->file('file')->store('tickets', 'public');
        }

        
        if ($data['status'] === 'completed' && $ticket->status !== 'completed') {
            $data['completed_at'] = now();
        }

        
        if (isset($data['assigned_to']) && $data['assigned_to'] != $ticket->assigned_to) {
            $data['assigned_at'] = now();
        }

        $ticket->update($data);

        return redirect()->route('tickets.index')->with('success', 'Ticket updated.');
    }

    
    public function updateStatus(Request $request, Ticket $ticket)
    {
        $this->authorize('updateStatus', $ticket);

        $data = $request->validate([
            'status' => ['required', 'string', Rule::in(['inprogress', 'completed', 'onhold'])],
        ]);

        
        if ($data['status'] === 'completed') {
            $ticket->completed_at = now();
        }

        $ticket->status = $data['status'];
        $ticket->save();

        return back()->with('success', 'Status updated.');
    }

    
    public function assign(Request $request, Ticket $ticket)
    {
        $this->authorize('assign', $ticket);

        $data = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        $ticket->update([
            'assigned_to' => $data['assigned_to'],
            'assigned_at' => now(),
        ]);

        return back()->with('success', 'Assignee updated.');
    }

    
    public function destroy(Ticket $ticket)
    {
        if ($ticket->file_path) Storage::disk('public')->delete($ticket->file_path);
        $ticket->delete();
        
        return redirect()->route('tickets.index')->with('success', 'Ticket deleted.');
    }
}