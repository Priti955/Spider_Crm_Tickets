import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Ensure this path is correct
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function Index({ auth, tickets }) {
    
    function deleteTicket(id) {
        if (confirm("Are you sure you want to delete this ticket?")) {
            router.delete(route('tickets.destroy', id));
        }
    }

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'inprogress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-white">Ticket Management</h2>}
        >
            <Head title="Tickets" />

            <div className="mb-6 flex justify-between items-center">
                <p className="text-slate-400 text-sm">Manage and track all support requests.</p>
                <Link 
                    href={route('tickets.create')} 
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-indigo-500/20"
                >
                    + Create New Ticket
                </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800/50 text-slate-300 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 font-semibold">ID</th>
                            <th className="px-6 py-4 font-semibold">Ticket Name</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold">Participants</th>
                            <th className="px-6 py-4 font-semibold">File</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {tickets.data.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4 text-slate-500 text-sm font-mono">#{t.id}</td>
                                <td className="px-6 py-4">
                                    <span className="text-slate-200 font-medium block">{t.name}</span>
                                    <span className="text-slate-500 text-xs">Created by {t.author?.name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(t.status)}`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                            {t.assignee?.name ?? 'Unassigned'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {t.file_url ? (
                                        <a href={t.file_url} target="_blank" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
                                            📎 View
                                        </a>
                                    ) : <span className="text-slate-600 text-xs">None</span>}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-3">
                                        <Link href={route('tickets.show', t.id)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition">
                                            👁️
                                        </Link>
                                        <Link href={route('tickets.edit', t.id)} className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-md transition">
                                            ✏️
                                        </Link>
                                        <button onClick={() => deleteTicket(t.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* --- PAGINATION --- */}
                {tickets.links && (
                    <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-800 flex justify-center gap-2">
                        {tickets.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3 py-1 text-xs rounded-md border transition ${
                                    link.active 
                                    ? 'bg-indigo-600 border-indigo-500 text-white' 
                                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}