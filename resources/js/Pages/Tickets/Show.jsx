import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react'; 

export default function Show({ ticket, canEdit, canUpdateStatus }) {
    const { flash } = usePage().props;
    const [status, setStatus] = useState(ticket.status);

    const statusColors = {
        pending: 'bg-gray-400',
        inprogress: 'bg-blue-400',
        completed: 'bg-green-400',
        onhold: 'bg-yellow-400',
    };

    function updateStatus(e) {
        e.preventDefault();
        router.post(route('tickets.status', ticket.id), { status }, {
             preserveScroll: true,
        });
    }

    return (
        <div className="min-h-screen bg-blue-50 p-6">
            {flash?.success && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-800 p-4 rounded">
                    {flash.success}
                </div>
            )}

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
                
                {/* Header and Status Badge */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-blue-900">{ticket.name}</h1>
                    <span className={`px-3 py-1 rounded text-white ${statusColors[ticket.status]}`}>
                        {ticket.status.toUpperCase()}
                    </span>
                </div>

                {/* Metadata (The Fixed Section) */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 border-b pb-4">
                    {/* --- FIX 1: Change ticket.user to ticket.author --- */}
                    <p><strong>Author:</strong> {ticket.author?.name || 'N/A'}</p> 
                    
                    {/* --- FIX 2: Change ticket.assigned_user to ticket.assignee --- */}
                    <p><strong>Assignee:</strong> {ticket.assignee?.name || 'Unassigned'}</p> 
                    
                    <p><strong>Created On:</strong> {ticket.created_at_formatted}</p>
                    <p><strong>Last Updated:</strong> {ticket.updated_at_formatted}</p>
                </div>
                
                {/* Description */}
                <div>
                    <h2 className="text-lg font-semibold text-blue-800 mb-2">Description</h2>
                    <p className="p-4 rounded bg-blue-100 text-blue-900 whitespace-pre-wrap">{ticket.description || 'No description provided'}</p>
                </div>

                {/* File */}
                {ticket.file_url && (
                    <div>
                        <a
                            href={ticket.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            View File
                        </a>
                    </div>
                )}

                {/* Status Update (only assignee/authorized user) */}
                {canUpdateStatus && (
                    <form onSubmit={updateStatus} className="mt-4 flex items-center gap-3">
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="pending">Pending</option>
                            <option value="inprogress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="onhold">On Hold</option>
                        </select>
                        <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded">
                            Update Status
                        </button>
                    </form>
                )}

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                    <Link
                        href={route('tickets.index')}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded"
                    >
                        Back to Tickets
                    </Link>

                    {canEdit && (
                        <Link
                            href={route('tickets.edit', ticket.id)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
                        >
                            Edit Ticket
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}