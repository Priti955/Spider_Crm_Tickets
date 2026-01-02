import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';

export default function Edit({ auth, ticket, users, canAssign }) {
    const { flash } = usePage().props;

    // Form for updating ticket details
    const { 
        data: updateData, 
        setData: setUpdateData, 
        post: postUpdate, 
        processing: updateProcessing, 
        errors: updateErrors 
    } = useForm({
        _method: 'PUT',
        name: ticket.name || '',
        description: ticket.description || '',
        status: ticket.status || 'pending',
        file: null,
    });

    // Form for assigning to users
    const { 
        data: assignData, 
        setData: setAssignData, 
        patch,
        processing: assignProcessing, 
        errors: assignErrors
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
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('tickets.index')} className="text-slate-400 hover:text-white transition">
                        🎫 Tickets
                    </Link>
                    <span className="text-slate-600">/</span>
                    <h2 className="text-xl font-semibold text-white">Edit Ticket #{ticket.id}</h2>
                </div>
            }
        >
            <Head title={`Edit Ticket #${ticket.id}`} />

            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <span>✅</span> {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT COLUMN: Main Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={submit} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-6 border-b border-slate-800">
                                <h3 className="text-lg font-medium text-white">General Information</h3>
                                <p className="text-slate-500 text-sm">Update the title and core details of this ticket.</p>
                            </div>

                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Ticket Title</label>
                                    <input
                                        type="text"
                                        value={updateData.name} 
                                        onChange={e => setUpdateData('name', e.target.value)} 
                                        className={`w-full bg-slate-950 border rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 transition ${updateErrors.name ? 'border-red-500' : 'border-slate-700'}`}
                                        placeholder="Enter ticket name"
                                    />
                                    {updateErrors.name && <p className="text-red-400 text-xs mt-1">{updateErrors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Detailed Description</label>
                                    <textarea
                                        value={updateData.description} 
                                        onChange={e => setUpdateData('description', e.target.value)} 
                                        rows="6"
                                        className={`w-full bg-slate-950 border rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 transition ${updateErrors.description ? 'border-red-500' : 'border-slate-700'}`}
                                        placeholder="Describe the issue..."
                                    />
                                    {updateErrors.description && <p className="text-red-400 text-xs mt-1">{updateErrors.description}</p>}
                                </div>
                            </div>

                            <div className="bg-slate-800/50 p-6 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={updateProcessing} 
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 disabled:opacity-50 transition shadow-lg shadow-indigo-500/20"
                                >
                                    {updateProcessing ? 'Updating...' : 'Update Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: Settings & Sidebar */}
                    <div className="space-y-6">
                        
                        {/* Status & File Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                                ⚙️ Management
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                                    <select
                                        value={updateData.status}
                                        onChange={e => setUpdateData('status', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:ring-indigo-500"
                                    >
                                        <option value="pending">🟡 Pending</option>
                                        <option value="inprogress">🔵 In Progress</option>
                                        <option value="completed">🟢 Completed</option>
                                        <option value="onhold">🔴 On Hold</option>
                                    </select>
                                </div>

                                <div className="pt-4 border-t border-slate-800">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Attachment</label>
                                    <input
                                        type="file"
                                        onChange={e => setUpdateData('file', e.target.files[0])}
                                        className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/10 file:text-indigo-400 hover:file:bg-indigo-600/20 cursor-pointer"
                                    />
                                    {ticket.file_url && (
                                        <div className="mt-3 p-2 bg-slate-950 rounded border border-slate-800">
                                            <a href={ticket.file_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 text-[11px] flex items-center gap-2 truncate">
                                                📎 {ticket.file_path?.split('/').pop()}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Assignment Card */}
                        {canAssign && (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl border-t-4 border-t-emerald-500/50">
                                <h3 className="text-white font-medium mb-1">Assign User</h3>
                                <p className="text-slate-500 text-xs mb-4">Transfer this ticket to another agent.</p>
                                
                                <form onSubmit={handleAssign} className="space-y-3">
                                    <select
                                        value={assignData.assigned_to} 
                                        onChange={e => setAssignData('assigned_to', e.target.value)} 
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:ring-emerald-500"
                                    >
                                        <option value="">Unassigned</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                    
                                    <button 
                                        type="submit" 
                                        disabled={assignProcessing} 
                                        className="w-full py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-lg font-medium hover:bg-emerald-600 hover:text-white disabled:opacity-50 transition"
                                    >
                                        {assignProcessing ? 'Assigning...' : 'Update Agent'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}