import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';

export default function Edit({ auth, user }) {
    
    // Check if the authenticated user is an admin
    const isAdmin = auth.user.is_admin;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        // The is_admin field is only needed if the current user is an admin
        ...(isAdmin && { is_admin: user.is_admin }), 
    });

    const submit = (e) => {
        e.preventDefault();
        // Route must exist: route('users.update', user.id)
        put(route('users.update', user.id)); 
    };

    return (
        <AuthenticatedLayout
            header={
                // Header text for the blue navbar
                <h2 className="font-semibold text-xl text-white leading-tight">
                    Edit User: {user.name}
                </h2>
            }
        >
            <Head title={`Edit User: ${user.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-xl sm:px-6 lg:px-8">
                    {/* Form Container: Dark gray background matching the theme */}
                    <div className="bg-gray-800 shadow-2xl overflow-hidden sm:rounded-lg p-8 border border-gray-700">
                        
                        <h1 className="text-2xl font-bold mb-6 text-blue-400">
                            Update Account Details
                        </h1>

                        <form onSubmit={submit}>
                            {/* --- Name Field --- */}
                            <div className="mb-4">
                                <InputLabel htmlFor="name" value="Name" className="text-gray-300" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full bg-gray-700 border-gray-600 text-white"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* --- Email Field --- */}
                            <div className="mb-6">
                                <InputLabel htmlFor="email" value="Email" className="text-gray-300" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full bg-gray-700 border-gray-600 text-white"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* --- is_admin Toggle (Admin Only) --- */}
                            {isAdmin && user.id !== auth.user.id && ( // Prevent admin from demoting themselves
                                <div className="mb-6">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="is_admin"
                                            checked={data.is_admin}
                                            onChange={(e) => setData('is_admin', e.target.checked)}
                                            className="text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                        />
                                        <span className="ms-2 text-sm text-gray-300">
                                            Grant Administrator Privileges
                                        </span>
                                    </label>
                                    <InputError message={errors.is_admin} className="mt-2" />
                                </div>
                            )}
                            
                            {/* Note on Admin Protection */}
                            {isAdmin && user.id === auth.user.id && (
                                <p className="mb-6 text-sm text-yellow-400">
                                    You cannot change your own admin status from this page.
                                </p>
                            )}

                            {/* --- Submit Button --- */}
                            <div className="flex items-center justify-end">
                                <PrimaryButton disabled={processing} className="bg-blue-600 hover:bg-blue-500 focus:ring-blue-500">
                                    Update User
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}