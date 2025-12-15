<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage; // Keep this import

class TicketController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->authorizeResource(\App\Models\Ticket::class, 'ticket');
    }

    public function index(Request $request)
    {
        
        $user = $request->user();
        $isAdmin = $user->is_admin ?? false;

        /** @var \Illuminate\Database\Eloquent\Builder $ticketsQuery */
        $ticketsQuery = Ticket::with([
            'author:id,name',
            'assignee:id,name',
        ]);
        
        
        if (!$isAdmin) {
            $ticketsQuery->where(function($q) use ($user) {
                
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
                'file_path' => $ticket->file_path,
                'file_url' => $ticket->file_path ? Storage::url($ticket->file_path) : null,
                'author' => $ticket->author ? ['id' => $ticket->author->id, 'name' => $ticket->author->name] : null,
                'assignee' => $ticket->assignee ? ['id' => $ticket->assignee->id, 'name' => $ticket->assignee->name] : null,
                // --- FIX 3: Format dates for the Index view ---
                'created_at' => $ticket->created_at->format('Y-m-d H:i'),
                'updated_at' => $ticket->updated_at->format('Y-m-d H:i'),
                
            ];
        });

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
        ]);
    }


    public function create()
    {
        $this->authorize('create', Ticket::class);
        return Inertia::render('Tickets/Create');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Ticket::class);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('tickets', 'public');
            $data['file_path'] = $path;
            
            // Using imported Storage facade
            $data['file_url'] = Storage::url($path); 
        }

        
        $data['created_by'] = $request->user()->id;

        
        $ticket = Ticket::create($data);

        return redirect()->route('tickets.show', $ticket->id)
                         ->with('success', 'Ticket created.');
    }


    public function show(Request $request, Ticket $ticket)
    {
        $this->authorize('view', $ticket); 
        $ticket->load(['author', 'assignee']); 

        return Inertia::render('Tickets/Show', [
            'ticket' => [
                'id' => $ticket->id,
                'name' => $ticket->name,
                'description' => $ticket->description,
                'status' => $ticket->status,
                'file_path' => $ticket->file_path,
                'file_url' => $ticket->file_path ? Storage::url($ticket->file_path) : null,
                
                // --- FIX 1: Add 'id' to Author and Assignee for robustness ---
                'author' => $ticket->author ? ['id' => $ticket->author->id, 'name' => $ticket->author->name] : null,
                'assignee' => $ticket->assignee ? ['id' => $ticket->assignee->id, 'name' => $ticket->assignee->name] : null,
                
                'created_at_formatted' => $ticket->created_at->format('Y-m-d H:i'),
                'updated_at_formatted' => $ticket->updated_at->format('Y-m-d H:i'),
                
                
                'canUpdateStatus' => $request->user()->can('updateStatus', $ticket),
                'canEdit' => $request->user()->can('update', $ticket),
            ]
        ]);
    }


    public function edit(Request $request, Ticket $ticket) 
    {
        // Existing correct code
        $this->authorize('update', $ticket);
        $users = \App\Models\User::select('id','name','email')->get();
        $canAssign = $request->user()->is_admin ?? false; 

        return Inertia::render('Tickets/Edit', [
            'ticket' => $ticket, 
            'users' => $users,
            'canAssign' => $canAssign, 
        ]);
    }

    public function update(Request $request, Ticket $ticket)
    {
        $this->authorize('update', $ticket);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,inprogress,completed,onhold',
            'file' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('file')) {
            if ($ticket->file_path) {
                Storage::disk('public')->delete($ticket->file_path);
            }
            $path = $request->file('file')->store('tickets', 'public');
            $data['file_path'] = $path;
            $data['file_url'] = Storage::url($path);
        }

        
        if ($data['status'] === 'completed') {
            $data['completed_at'] = now();
        } else {
            
            $data['completed_at'] = null;
        }

        $ticket->update($data);

        return redirect()->route('tickets.show', $ticket->id)->with('success','Ticket updated.');
    }

    
    public function updateStatus(Request $request, Ticket $ticket)
    {
        $this->authorize('updateStatus', $ticket);

    
        $data = $request->validate([
            'status' => ['required', 'string', Rule::in(['inprogress', 'completed'])],
        ]);

    
        $ticket->status = $data['status'];
        $ticket->save();

        return back()->with('success','Status updated.');
    }
    
    public function assign(Request $request, Ticket $ticket)
    {
        $this->authorize('assign', $ticket);

        $data = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        $ticket->assigned_to = $data['assigned_to'];
        $ticket->assigned_at = now();
        $ticket->save();

        return back()->with('success','Ticket assigned.');
    }

    public function destroy(Ticket $ticket)
    {
        $this->authorize('delete', $ticket);
        $ticket->delete(); 
        return redirect()->route('tickets.index')->with('success','Ticket deleted.');
    }
}