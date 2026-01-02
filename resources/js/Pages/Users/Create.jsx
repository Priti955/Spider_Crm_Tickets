import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Create({ auth }) {
   
    const canManageRoles = auth.user.role === 'admin' || auth.user.role === 'superadmin';

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user', // Default role
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('users.index')} className="text-slate-400 hover:text-white transition">
                        👥 Users
                    </Link>
                    <span className="text-slate-600">/</span>
                    <h2 className="text-xl font-semibold text-white leading-tight">Create New Account</h2>
                </div>
            }
        >
            <Head title="Create User" />

            <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl overflow-hidden">
                    {/* Form Header */}
                    <div className="p-8 border-b border-slate-800 bg-slate-800/30">
                        <h1 className="text-2xl font-bold text-white">User Registration</h1>
                        <p className="text-slate-400 text-sm mt-1">Create a new profile and assign system permissions.</p>
                    </div>

                    <form onSubmit={submit} className="p-8 space-y-6">
                        {/* Name Field */}
                        <div>
                            <InputLabel htmlFor="name" value="Full Name" className="text-slate-300 mb-2 font-semibold uppercase text-xs tracking-wider" />
                            <TextInput
                                id="name"
                                type="text"
                                value={data.name}
                                className="mt-1 block w-full bg-slate-950 border-slate-700 text-slate-200 focus:ring-indigo-500 rounded-xl py-3"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Email Field */}
                        <div>
                            <InputLabel htmlFor="email" value="Email Address" className="text-slate-300 mb-2 font-semibold uppercase text-xs tracking-wider" />
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                className="mt-1 block w-full bg-slate-950 border-slate-700 text-slate-200 focus:ring-indigo-500 rounded-xl py-3"
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="john@example.com"
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Password Field */}
                            <div>
                                <InputLabel htmlFor="password" value="Password" className="text-slate-300 mb-2 font-semibold uppercase text-xs tracking-wider" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    className="mt-1 block w-full bg-slate-950 border-slate-700 text-slate-200 focus:ring-indigo-500 rounded-xl py-3"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-slate-300 mb-2 font-semibold uppercase text-xs tracking-wider" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full bg-slate-950 border-slate-700 text-slate-200 focus:ring-indigo-500 rounded-xl py-3"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* --- NEW: Role Selection Dropdown --- */}
                        <div className="pt-4 border-t border-slate-800">
                            <InputLabel htmlFor="role" value="System Role" className="text-slate-300 mb-2 font-semibold uppercase text-xs tracking-wider" />
                            
                            <select
                                id="role"
                                value={data.role}
                                disabled={!canManageRoles}
                                onChange={(e) => setData('role', e.target.value)}
                                className="mt-1 block w-full bg-slate-950 border-slate-700 text-slate-200 focus:ring-indigo-500 rounded-xl py-3 px-4 transition-all disabled:opacity-50"
                            >
                                <option value="user">👤  User</option>
                                <option value="admin">🛠️ Admin</option>
                                <option value="superadmin">👑 Super Admin</option>
                            </select>
                            
                            <p className="mt-3 text-xs text-slate-500 leading-relaxed italic">
                                * Roles define what actions the user can perform across tickets and settings.
                            </p>
                            <InputError message={errors.role} className="mt-2" />
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-4 pt-6">
                            <Link href={route('users.index')} className="text-slate-400 hover:text-white text-sm transition">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}