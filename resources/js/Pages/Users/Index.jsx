

import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, users }) {

    
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">User Management</h2>}
        >
            <Head title="Manage Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                        
                       
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">System Users</h1>
                          
                            <Link 
                                href={route('users.create')} 
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-150"
                            >
                                + Create New User
                            </Link>
                        </div>

                        
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        
                                        {/* Role Badge */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span 
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_admin ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-700'}`}
                                            >
                                                {user.is_admin ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.created_at}</td>
                                        
                                        {/* Actions (Future CRUD) */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {user.can_edit && (
                                                <Link href={route('users.edit', user.id)} className="text-blue-600 hover:text-blue-900 mr-3">
                                                    Edit
                                                </Link>
                                            )}
                                            {user.can_delete && (
                                                <button disabled={user.is_admin} className={`text-red-600 hover:text-red-900 ${user.is_admin ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {/* Pagination Links */}
                        <div className="mt-4">
                            <Pagination links={users.links} /> 
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}