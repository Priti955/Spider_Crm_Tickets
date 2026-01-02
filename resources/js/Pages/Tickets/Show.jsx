import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, usePage, router, Head } from '@inertiajs/react';

export default function Show({ auth, ticket, canEdit, canUpdateStatus }) {
    const { flash } = usePage().props;
    const [status, setStatus] = useState(ticket.status);

    const statusStyles = {
        pending: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        inprogress: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        onhold: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    };

    function updateStatus(e) {
        e.preventDefault();
        router.post(route('tickets.status', ticket.id), { status }, {
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
                    <h2 className="text-xl font-semibold text-white">Ticket Details</h2>
                </div>
            }
        >
            <Head title={`Ticket - ${ticket.name}`} />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Flash Success Messages */}
                {flash?.success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3">
                        <span>✅</span> {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Main Ticket Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-8 border-b border-slate-800 flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">{ticket.name}</h1>
                                    <p className="text-slate-500 text-sm italic">Created on {ticket.created_at_formatted}</p>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border ${statusStyles[ticket.status]}`}>
                                    {ticket.status}
                                </span>
                            </div>

                            <div className="p-8">
                                <h3 className="text-slate-300 font-semibold mb-4 uppercase tracking-widest text-xs">Description</h3>
                                <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {ticket.description || 'No description provided.'}
                                </div>

                                {ticket.file_url && (
                                    <div className="mt-8 pt-8 border-t border-slate-800">
                                        <h3 className="text-slate-300 font-semibold mb-4 uppercase tracking-widest text-xs">Attachment</h3>
                                        <a
                                            href={ticket.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-xl transition font-medium"
                                        >
                                            📎 View Attachment
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Back Action */}
                        <div className="flex gap-4">
                            <Link
                                href={route('tickets.index')}
                                className="text-slate-500 hover:text-white transition flex items-center gap-2 text-sm"
                            >
                                ← Back to List
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar Metadata & Controls */}
                    <div className="space-y-6">
                        {/* Info Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Author</label>
                                <p className="text-slate-200 mt-1 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs">
                                        {ticket.author?.name?.charAt(0)}
                                    </span>
                                    {ticket.author?.name || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Assignee</label>
                                <p className="text-slate-200 mt-1 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                                        👤
                                    </span>
                                    {ticket.assignee?.name || 'Unassigned'}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-800">
                                <label className="text-xs font-bold text-slate-500 uppercase">Last Updated</label>
                                <p className="text-slate-400 text-sm mt-1">{ticket.updated_at_formatted}</p>
                            </div>
                        </div>

                        {/* Status Update Card */}
                        {canUpdateStatus && (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl border-t-4 border-t-indigo-500">
                                <h3 className="text-white font-medium mb-4">Quick Status Update</h3>
                                <form onSubmit={updateStatus} className="space-y-4">
                                    <select
                                        value={status}
                                        onChange={e => setStatus(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:ring-indigo-500"
                                    >
                                        <option value="pending">🟡 Pending</option>
                                        <option value="inprogress">🔵 In Progress</option>
                                        <option value="completed">🟢 Completed</option>
                                        <option value="onhold">🔴 On Hold</option>
                                    </select>
                                    <button 
                                        type="submit" 
                                        className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
                                    >
                                        Update Ticket
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Edit Button Card */}
                        {canEdit && (
                            <Link
                                href={route('tickets.edit', ticket.id)}
                                className="block w-full text-center py-3 bg-slate-800 border border-slate-700 text-white rounded-2xl hover:bg-slate-700 transition font-medium"
                            >
                                ✏️ Edit Ticket Details
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}