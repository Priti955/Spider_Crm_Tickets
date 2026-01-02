import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, users }) {
    const deleteUser = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">User Management</h2>}
        >
            <Head title="User Management" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-slate-300">System Users</h3>
                    <Link
                        href={route('users.create')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold transition"
                    >
                        + Add New User
                    </Link>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 uppercase text-xs tracking-widest">
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Admin Status</th>
                                <th className="p-4">Created</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300">
                            {users.data.map((user) => (
                                <tr key={user.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition">
                                    <td className="p-4 font-medium text-white">{user.name}</td>
                                    <td className="p-4 text-slate-400">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                            user.role === 'superadmin' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-700/50 text-slate-400'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {user.is_admin ? '✅ Yes' : '❌ No'}
                                    </td>
                                    <td className="p-4 text-sm">{user.created_at}</td>
                                    <td className="p-4 text-right space-x-2">
                                        {user.can_edit && (
                                            <Link href={route('users.edit', user.id)} className="text-indigo-400 hover:text-indigo-300">Edit</Link>
                                        )}
                                        {user.can_delete && (
                                            <button onClick={() => deleteUser(user.id)} className="text-red-400 hover:text-red-300 ml-2">Delete</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}