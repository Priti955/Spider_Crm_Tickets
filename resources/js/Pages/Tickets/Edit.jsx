import React from 'react';
import { Link, usePage, useForm } from '@inertiajs/react'; 

export default function Edit({ ticket, users, canAssign }) {
    const { flash } = usePage().props;

    const { 
        data: updateData, 
        setData: setUpdateData, 
        post: postUpdate, 
        processing: updateProcessing, 
    } = useForm({
        _method: 'PUT',
        name: ticket.name || '',
        description: ticket.description || '',
        status: ticket.status || 'pending',
        file: null,
    });

   
    const { 
        data: assignData, 
        setData: setAssignData, 
        
        post, 
        patch,
    } = useForm({
        assigned_to: ticket.assigned_to || '', 
    });


   
    function submit(e) {
        e.preventDefault();
        postUpdate(route('tickets.update', ticket.id), {
            forceFormData: true, 
        });
    }

    
    function handleAssign(e) {
        e.preventDefault();
        if (!assignData.assigned_to) return;
        
        
        patch(route('tickets.assign', ticket.id), { 
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

            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-900">Edit Ticket #{ticket.id}</h1>
                    <Link href={route('tickets.index')} className="text-blue-700 hover:underline">Back to Tickets</Link>
                </div>

                
                <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
                 
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Title</label>
                        <input
                            value={updateData.name} 
                            onChange={e => setUpdateData('name', e.target.value)} 
                            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                            value={updateData.description} 
                            onChange={e => setUpdateData('description', e.target.value)} 
                            rows="5"
                            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Status</label>
                            <select
                                value={updateData.status}
                                onChange={e => setUpdateData('status', e.target.value)}
                                className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="pending">Pending</option>
                                <option value="inprogress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="onhold">On Hold</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Replace Attachment</label>
                            <input
                                type="file"
                                onChange={e => setUpdateData('file', e.target.files[0])}
                                className="mt-1 block w-full"
                            />
                            
                            {ticket.file_url && (
                                <div className="mt-2 text-sm text-blue-700">
                                    <a href={ticket.file_url} target="_blank" rel="noreferrer" className="hover:underline">
                                        Current file: {ticket.file_path.split('/').pop()}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="submit" disabled={updateProcessing} className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                            {updateProcessing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

             
                {canAssign && (
                    <div className="bg-white p-6 mt-6 rounded-lg shadow-lg">
                        <h3 className="font-semibold text-blue-900 mb-3">Assign Ticket</h3>
                        <form onSubmit={handleAssign} className="flex gap-3 items-center">
                            <select
                                value={assignData.assigned_to} 
                                onChange={e => setAssignData('assigned_to', e.target.value)} 
                                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Select user --</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                ))}
                            </select>
                            <button 
                                type="submit" 
                                disabled={assignProcessing} 
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                            >
                                {assignProcessing ? 'Assigning...' : 'Assign'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}