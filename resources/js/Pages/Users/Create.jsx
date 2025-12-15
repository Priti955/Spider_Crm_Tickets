import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';

export default function Create({ auth }) {
    
    // We assume only admins can reach this page, but we keep the check for safety
    const isAdmin = auth.user.is_admin; 

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        is_admin: false,
    });

    const submit = (e) => {
        e.preventDefault();
        // Route must exist: route('users.store')
        post(route('users.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                // Header text for the blue navbar
                <h2 className="font-semibold text-xl text-white leading-tight">
                    Create New User
                </h2>
            }
        >
            <Head title="Create User" />

            <div className="py-12">
                <div className="mx-auto max-w-xl sm:px-6 lg:px-8">
                    {/* Form Container: Dark gray background matching the theme */}
                    <div className="bg-gray-800 shadow-2xl overflow-hidden sm:rounded-lg p-8 border border-gray-700">
                        
                        <h1 className="text-2xl font-bold mb-6 text-blue-400">
                            New User Registration
                        </h1>
                        
                        {!isAdmin && (
                            <p className="mb-6 text-red-500">
                                WARNING: You should not be able to view this page. Access is restricted to Administrators.
                            </p>
                        )}


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
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* --- Email Field --- */}
                            <div className="mb-4">
                                <InputLabel htmlFor="email" value="Email" className="text-gray-300" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full bg-gray-700 border-gray-600 text-white"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* --- Password Field --- */}
                            <div className="mb-4">
                                <InputLabel htmlFor="password" value="Password" className="text-gray-300" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full bg-gray-700 border-gray-600 text-white"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>
                            
                            {/* --- Confirm Password Field --- */}
                            <div className="mb-6">
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-gray-300" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full bg-gray-700 border-gray-600 text-white"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            {/* --- is_admin Toggle (Only available if the current user is an admin) --- */}
                            {isAdmin && (
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

                            {/* --- Submit Button --- */}
                            <div className="flex items-center justify-end">
                                <PrimaryButton disabled={processing} className="bg-blue-600 hover:bg-blue-500 focus:ring-blue-500">
                                    Create Account
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}